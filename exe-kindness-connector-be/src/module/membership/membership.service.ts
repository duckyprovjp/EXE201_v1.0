// membership.service.ts
import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SePayPgClient } from 'sepay-pg-node';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { User } from '../user/entities/user.entity';
import { Membership } from './entities/membership.entity';
import { MembershipRecord } from '../membership_record/entities/membership_record.entity';
import { Membership_Status } from 'src/common/enums/status.enum';
import * as crypto from 'crypto';

type CheckoutLinks = {
  successUrl?: string;
  errorUrl?: string;
  cancelUrl?: string;
};

type CheckoutResponse = {
  checkoutURL: string;
  formFields: Record<string, string>;
  orderInvoiceNumber: string;
  amount: number;
  qrUrl: string;
  bankAccount: string;
  bankName: string;
};

// Định nghĩa interface cho SePay webhook payload
interface SePayWebhookPayload {
  id: number;                 // Mã giao dịch SePay - DÙNG ĐỂ CHỐNG DUPLICATE
  gateway: string;           // Tên ngân hàng
  transactionDate: string;   // Thời gian giao dịch
  accountNumber: string;     // Số tài khoản nhận
  code: string | null;       // Mã thanh toán (nếu có)
  content: string;           // Nội dung chuyển khoản - CHỨA MÃ ĐƠN HÀNG
  transferType: 'in' | 'out'; // 'in' = tiền vào
  transferAmount: number;    // Số tiền
  accumulated: number;       // Số dư sau giao dịch
  subAccount: string | null;
  referenceCode: string;
  description: string;
}

@Injectable()
export class MembershipService {
  private readonly membershipAmount = Number(process.env.MEMBERSHIP_PRICE ?? 50000);
  private readonly membershipDurationDays = Number(process.env.MEMBERSHIP_DURATION_DAYS ?? 30);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Membership.name) private readonly membershipModel: Model<Membership>,
    @InjectModel(MembershipRecord.name) private readonly membershipRecordModel: Model<MembershipRecord>,
  ) { }

  private createClient() {
    const merchantId = process.env.SEPAY_MERCHANT_ID;
    const secretKey = process.env.SEPAY_MERCHANT_SECRET_KEY;

    if (!merchantId || !secretKey) {
      throw new ConflictException('Missing SePay credentials');
    }

    return new SePayPgClient({
      env: (process.env.SEPAY_ENV as 'sandbox' | 'production') ?? 'sandbox',
      merchant_id: merchantId,
      secret_key: secretKey,
    });
  }

  async createCheckout(userId: string, links: CheckoutLinks): Promise<CheckoutResponse> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const client = this.createClient();
    const orderInvoiceNumber = `MEM-${userId}-${Date.now()}`;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    const checkoutURL = client.checkout.initCheckoutUrl();
    const formFields = client.checkout.initOneTimePaymentFields({
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: orderInvoiceNumber,
      order_amount: this.membershipAmount,
      currency: 'VND',
      order_description: `Thanh toan goi premium cho ${user.fullName || user.email}`,
      success_url: links.successUrl || `${baseUrl}/rewards?payment=success&invoice=${orderInvoiceNumber}`,
      error_url: links.errorUrl || `${baseUrl}/rewards?payment=error&invoice=${orderInvoiceNumber}`,
      cancel_url: links.cancelUrl || `${baseUrl}/rewards?payment=cancel&invoice=${orderInvoiceNumber}`,
    });

    const bankAccount = process.env.SEPAY_BANK_ACCOUNT || '123456789';
    const bankName = process.env.SEPAY_BANK_NAME || 'MBBank';
    const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${this.membershipAmount}&des=${orderInvoiceNumber}`;

    return {
      checkoutURL,
      formFields: Object.fromEntries(
        Object.entries(formFields).map(([key, value]) => [key, String(value)]),
      ),
      orderInvoiceNumber,
      amount: this.membershipAmount,
      qrUrl,
      bankAccount,
      bankName,
    };
  }

  /**
   * Xử lý webhook từ SePay
   * QUAN TRỌNG: Phải trả về HTTP 200 và {"success": true} để SePay không gửi lại
   */
  async handleSePayWebhook(payload: SePayWebhookPayload, signature?: string) {
    // 1. Kiểm tra loại giao dịch (chỉ xử lý tiền vào)
    if (payload.transferType !== 'in') {
      console.log('Skipping outgoing transaction');
      return { success: true, message: 'Ignored outgoing transaction' };
    }

    // 2. Kiểm tra số tiền (có thể bỏ qua nếu muốn linh hoạt)
    if (payload.transferAmount < this.membershipAmount) {
      console.log(`Amount too low: ${payload.transferAmount} < ${this.membershipAmount}`);
      return { success: true, message: 'Amount too low' };
    }

    // 3. CHỐNG DUPLICATE: Kiểm tra xem giao dịch đã xử lý chưa
    const existingPayment = await this.membershipModel.findOne({
      transactionId: String(payload.id),
    }).exec();

    if (existingPayment) {
      console.log(`Duplicate webhook for transaction ${payload.id}, skipping`);
      return { success: true, message: 'Already processed' };
    }

    // 4. Trích xuất mã đơn hàng từ nội dung chuyển khoản
    // Hỗ trợ cả trường hợp có hoặc không có dấu gạch ngang (do một số ngân hàng tự động loại bỏ ký tự đặc biệt)
    // Ví dụ: "MEM-6a30ac7ef85b815a96bad6b4-1781574793109" hoặc "MEM6a30ac7ef85b815a96bad6b41781574793109"
    const match = payload.content.match(/MEM-?([a-fA-F0-9]{24})-?(\d{13})/i);

    if (!match) {
      console.log(`Cannot extract invoice number or userId from content: ${payload.content}`);
      return { success: true, message: 'Invalid invoice number format' };
    }

    const userId = match[1];
    const invoiceNumber = match[0];

    // 5. Tìm user
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      console.log(`User not found: ${userId}`);
      return { success: true, message: 'User not found' };
    }

    // 7. Kiểm tra xem user đã có membership ACTIVE chưa
    const existingActiveMembership = await this.membershipModel.findOne({
      user: user._id,
      status: Membership_Status.ACTIVE,
      endDate: { $gt: new Date() },
    }).exec();

    if (existingActiveMembership) {
      console.log(`User ${userId} already has active membership`);
      // Vẫn tạo membership mới nhưng chưa active? Hoặc extend? Tùy logic bạn
    }

    // 8. Tạo membership mới
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.membershipDurationDays);

    // Cập nhật user
    user.isPremium = true;
    await user.save();

    // Tạo membership record
    const membership = await this.membershipModel.create({
      user: user._id,
      startDate,
      endDate,
      status: Membership_Status.ACTIVE,
      method: 'ONLINE' as any,
      transactionId: String(payload.id),
      amount: payload.transferAmount,
    }) as any;

    // Tạo membership record lịch sử
    await this.membershipRecordModel.create({
      membership: membership._id,
      user: user._id,
      action: 'CREATED' as any,
    } as any);

    console.log(`✅ Activated premium for user: ${user.email} (${userId})`);
    console.log(`   Transaction: ${payload.id} | Amount: ${payload.transferAmount} VND`);

    return { success: true, membershipId: membership._id };
  }

  /**
   * Trích xuất invoice number từ nội dung chuyển khoản
   * Ví dụ: "MEM-user123-1737000000000" -> "MEM-user123-1737000000000"
   * Hoặc: "Thanh toan MEM-user123-1737000000000" -> "MEM-user123-1737000000000"
   */
  private extractInvoiceNumberFromContent(content: string): string | null {
    // Tìm pattern bắt đầu bằng MEM- và kết thúc bằng số
    const match = content.match(/MEM-[a-zA-Z0-9]+-\d+/);
    if (match) {
      return match[0];
    }

    // Fallback: tìm bất kỳ chuỗi nào có dạng XXX-xxx-xxx
    const fallbackMatch = content.match(/[A-Z]+-[a-zA-Z0-9]+-\d+/);
    return fallbackMatch ? fallbackMatch[0] : null;
  }

  /**
   * Trích xuất userId từ invoice number
   * Invoice format: MEM-{userId}-{timestamp}
   */
  private extractUserIdFromInvoice(invoiceNumber: string): string | null {
    const parts = invoiceNumber.split('-');
    if (parts.length >= 2) {
      return parts[1]; // userId là phần thứ 2 sau MEM-
    }
    return null;
  }

  /**
   * Xác thực webhook signature (nếu SePay hỗ trợ)
   * Bạn có thể bỏ qua ở giai đoạn test, nhưng production nên dùng
   */
  verifySignature(payload: any, signature: string, secretKey: string): boolean {
    if (!signature) return false;

    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    return computedSignature === signature;
  }

  // Các method cũ giữ nguyên
  create(createMembershipDto: CreateMembershipDto) {
    return 'This action adds a new membership';
  }

  findAll() {
    return `This action returns all membership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return `This action updates a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}