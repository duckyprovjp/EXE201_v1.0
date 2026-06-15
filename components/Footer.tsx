"use client";

import Link from "next/link";
import { BookOpen, Mail, Globe, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.scss";

export default function Footer() {
  const pathname = usePathname();
  const isChat = pathname?.startsWith("/chat");
  
  if (isChat) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandIcon}>
                <BookOpen size={18} className="text-white" />
              </div>
              <span className={styles.brandName}>Kindness Connector</span>
            </Link>
            <p className={styles.description}>
              Mạng lưới trao đổi sách cũ 0đ phi lợi nhuận lớn nhất dành cho những người yêu tri thức. Cùng nhau trao đi cuốn sách cũ, nhận lại niềm vui mới và lan tỏa văn hóa đọc đến mọi miền.
            </p>
            <div className={styles.madeWith}>
              <span>Được xây dựng với</span>
              <Heart size={12} className={styles.heartIcon} />
              <span>bởi cộng đồng mến sách.</span>
            </div>
          </div>

          {/* Column 1: Links */}
          <div className={styles.linkGroup}>
            <h4>Khám phá</h4>
            <ul>
              <li><Link href="/">Tủ sách 0đ gần bạn</Link></li>
              <li><Link href="/post">Đăng tặng sách mới</Link></li>
              <li><Link href="/rewards">Đổi mã quà tặng VIP</Link></li>
              <li><Link href="/rewards">Bảng xếp hạng Đại Sứ</Link></li>
            </ul>
          </div>

          {/* Column 2: Contact & Socials */}
          <div className={styles.linkGroup}>
            <h4>Hỗ trợ & Liên hệ</h4>
            <ul>
              <li><Link href="#">Quy chuẩn cộng đồng</Link></li>
              <li><Link href="#">Hướng dẫn nhận sách</Link></li>
              <li className={styles.socials}>
                <a href="#">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a href="mailto:support@bookshare.vn"><Mail size={14} /></a>
                <a href="#"><Globe size={14} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} Kindness Connector. Mọi quyền được bảo lưu.</p>
          <div className={styles.legalLinks}>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
