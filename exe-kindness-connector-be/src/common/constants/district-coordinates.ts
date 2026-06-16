// Tọa độ tương đối của các Quận/Huyện (Kinh độ [longitude], Vĩ độ [latitude])
export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  // Hà Nội
  'Quận Ba Đình': [105.82, 21.0333],
  'Quận Hoàn Kiếm': [105.8522, 21.0285],
  'Quận Tây Hồ': [105.8167, 21.0667],
  'Quận Long Biên': [105.9, 21.0333],
  'Quận Cầu Giấy': [105.795, 21.0333],
  'Quận Đống Đa': [105.825, 21.0167],
  'Quận Hai Bà Trưng': [105.85, 21.0],
  'Quận Hoàng Mai': [105.85, 20.9667],
  'Quận Thanh Xuân': [105.8083, 20.9933],
  'Huyện Sóc Sơn': [105.8333, 21.25],
  'Huyện Đông Anh': [105.85, 21.15],
  'Huyện Gia Lâm': [105.95, 21.0167],
  'Quận Nam Từ Liêm': [105.7667, 21.0167],
  'Huyện Thanh Trì': [105.8333, 20.9333],
  'Quận Bắc Từ Liêm': [105.75, 21.0667],
  'Huyện Mê Linh': [105.7167, 21.1833],
  'Quận Hà Đông': [105.7667, 20.9667],
  'Thị xã Sơn Tây': [105.5, 21.1333],
  'Huyện Ba Vì': [105.3833, 21.1833],
  'Huyện Phúc Thọ': [105.55, 21.1],
  'Huyện Đan Phượng': [105.6667, 21.1],
  'Huyện Hoài Đức': [105.7, 21.0333],
  'Huyện Quốc Oai': [105.6167, 20.9833],
  'Huyện Thạch Thất': [105.55, 21.0167],
  'Huyện Chương Mỹ': [105.6667, 20.8833],
  'Huyện Thanh Oai': [105.7667, 20.85],
  'Huyện Thường Tín': [105.85, 20.8667],
  'Huyện Phú Xuyên': [105.9, 20.7333],
  'Huyện Ứng Hòa': [105.7833, 20.7333],
  'Huyện Mỹ Đức': [105.75, 20.7],

  // TP HCM
  'Quận 1': [106.6958, 10.7769],
  'Quận 2': [106.745, 10.7872],
  'Quận 3': [106.6853, 10.7816],
  'Quận 4': [106.7028, 10.76],
  'Quận 5': [106.6667, 10.7544],
  'Quận 6': [106.6389, 10.7486],
  'Quận 7': [106.7264, 10.7344],
  'Quận 8': [106.6339, 10.7258],
  'Quận 9': [106.8111, 10.8286],
  'Quận 10': [106.6667, 10.7733],
  'Quận 11': [106.6433, 10.7658],
  'Quận 12': [106.6419, 10.8667],
  'Quận Bình Tân': [106.5917, 10.7667],
  'Quận Bình Thạnh': [106.7083, 10.8083],
  'Quận Gò Vấp': [106.6667, 10.8333],
  'Quận Phú Nhuận': [106.6833, 10.7967],
  'Quận Tân Bình': [106.65, 10.8],
  'Quận Tân Phú': [106.625, 10.7917],
  'Huyện Bình Chánh': [106.5667, 10.6833],
  'Huyện Cần Giờ': [106.8778, 10.4083],
  'Huyện Củ Chi': [106.5167, 11.0],
  'Huyện Hóc Môn': [106.5833, 10.8833],
  'Huyện Nhà Bè': [106.7167, 10.6667],
};

export function getCoordinatesFromDistrict(
  districtName: string,
): [number, number] | undefined {
  if (!districtName) return undefined;

  // Try exact match
  if (DISTRICT_COORDINATES[districtName]) {
    return DISTRICT_COORDINATES[districtName];
  }

  // Try case-insensitive substring match
  const lowerDistrict = districtName.toLowerCase();
  for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
    // E.g. "Cầu Giấy" matches "Quận Cầu Giấy"
    if (
      lowerDistrict.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerDistrict)
    ) {
      return coords;
    }

    // Also try stripping "Quận ", "Huyện ", "Thị xã "
    const nakedKey = key.replace(/^(Quận|Huyện|Thị xã)\s+/i, '').toLowerCase();
    const nakedDistrict = districtName
      .replace(/^(Quận|Huyện|Thị xã)\s+/i, '')
      .toLowerCase();

    if (nakedDistrict === nakedKey) {
      return coords;
    }
  }

  // Nếu không tìm thấy, có thể trả về một tọa độ mặc định (ví dụ trung tâm Hà Nội)
  // Nhưng tốt nhất là undefined để Database không query sai.
  return undefined;
}
