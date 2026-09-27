export const mockAdminUser = {
  _id: '64a000000000000000000001',
  email: 'admin@localmate.com',
  fullName: 'System Administrator',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  nationality: 'Vietnam',
  isVerified: true
};

export const mockDashboardData = {
  totalUsers: 128,
  totalGuides: 34,
  totalBookings: 245,
  pendingGuides: 5,
  completedBookings: 198,
  totalRevenue: 48500
};

export const mockRecentBookings = [
  {
    _id: 'bk_001',
    touristId: { _id: 'u_1', fullName: 'Sarah Jenkins', email: 'sarah@test.com' },
    guideId: { _id: 'g_1', userId: { fullName: 'Trần Văn Nam', email: 'nam@guide.com' } },
    locationId: { _id: 'loc_1', name: 'Phố Cổ Hà Nội', city: 'Hà Nội' },
    bookingDate: '2026-10-05T08:00:00.000Z',
    date: '2026-10-05T08:00:00.000Z',
    durationHours: 4,
    totalAmount: 120,
    totalPrice: 120,
    platformFee: 12,
    guideEarnings: 108,
    status: 'CONFIRMED',
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    _id: 'bk_002',
    touristId: { _id: 'u_2', fullName: 'Kenji Sato', email: 'kenji@test.com' },
    guideId: { _id: 'g_2', userId: { fullName: 'Lê Hoàng Long', email: 'long@guide.com' } },
    locationId: { _id: 'loc_2', name: 'Bà Nà Hills', city: 'Đà Nẵng' },
    bookingDate: '2026-10-06T09:00:00.000Z',
    date: '2026-10-06T09:00:00.000Z',
    durationHours: 6,
    totalAmount: 180,
    totalPrice: 180,
    platformFee: 18,
    guideEarnings: 162,
    status: 'COMPLETED',
    createdAt: '2026-09-21T11:00:00.000Z'
  },
  {
    _id: 'bk_003',
    touristId: { _id: 'u_3', fullName: 'John Smith', email: 'tourist@test.com' },
    guideId: { _id: 'g_1', userId: { fullName: 'Trần Văn Nam', email: 'nam@guide.com' } },
    locationId: { _id: 'loc_3', name: 'Chợ Bến Thành', city: 'Hồ Chí Minh' },
    bookingDate: '2026-10-08T14:00:00.000Z',
    date: '2026-10-08T14:00:00.000Z',
    durationHours: 3,
    totalAmount: 90,
    totalPrice: 90,
    platformFee: 9,
    guideEarnings: 81,
    status: 'PENDING',
    createdAt: '2026-09-22T09:30:00.000Z'
  }
];

export const mockPendingGuides = [
  {
    _id: 'g_pen_001',
    userId: {
      _id: 'u_g1',
      fullName: 'Vũ Thị Mai',
      email: 'mai.guide@test.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      nationality: 'Vietnam',
      phone: '+84988776655',
      createdAt: '2026-09-25T08:00:00.000Z'
    },
    bio: 'Hướng dẫn viên du lịch văn hóa và lịch sử Hà Nội với 5 năm kinh nghiệm.',
    languages: ['Vietnamese', 'English', 'French'],
    hourlyRate: 35,
    dailyRate: 200,
    experienceYears: 5,
    certificates: ['Thẻ hướng dẫn viên quốc tế', 'Chứng chỉ IELTS 7.5'],
    idCardUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    isApproved: false,
    createdAt: '2026-09-25T08:10:00.000Z'
  },
  {
    _id: 'g_pen_002',
    userId: {
      _id: 'u_g2',
      fullName: 'Phạm Đức Anh',
      email: 'ducanh@guide.com',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      nationality: 'Vietnam',
      phone: '+84912345678',
      createdAt: '2026-09-26T09:00:00.000Z'
    },
    bio: 'Chuyên gia ẩm thực đường phố và trekking thiên nhiên Đà Nẵng - Hội An.',
    languages: ['Vietnamese', 'English', 'Japanese'],
    hourlyRate: 40,
    dailyRate: 220,
    experienceYears: 4,
    certificates: ['Thẻ hướng dẫn viên nội địa'],
    idCardUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
    isApproved: false,
    createdAt: '2026-09-26T09:15:00.000Z'
  }
];

export const mockUsersList = [
  {
    _id: 'u_1',
    fullName: 'System Administrator',
    email: 'admin@localmate.com',
    role: 'ADMIN',
    nationality: 'Vietnam',
    phone: '+84901234567',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-08-01T00:00:00.000Z'
  },
  {
    _id: 'u_2',
    fullName: 'John Smith',
    email: 'tourist@test.com',
    role: 'TOURIST',
    nationality: 'USA',
    phone: '+15551234567',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-08-10T00:00:00.000Z'
  },
  {
    _id: 'u_3',
    fullName: 'Nguyễn Văn Minh',
    email: 'guide@test.com',
    role: 'GUIDE',
    nationality: 'Vietnam',
    phone: '+84988112233',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-08-15T00:00:00.000Z'
  }
];

export const mockLocationsList = [
  {
    _id: 'loc_001',
    name: 'Phố Cổ Hà Nội (Old Quarter)',
    category: 'CULTURE',
    city: 'Hà Nội',
    address: 'Hoàn Kiếm, Hà Nội',
    priceRange: 'BUDGET',
    openingHours: '06:00 - 23:00',
    tags: ['historic', 'food', 'walking', 'nightlife'],
    description: 'Khu 36 phố phường cổ kính lưu giữ nét văn hóa Thăng Long nghìn năm văn hiến.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
    isActive: true
  },
  {
    _id: 'loc_002',
    name: 'Cầu Rồng Đà Nẵng',
    category: 'ENTERTAINMENT',
    city: 'Đà Nẵng',
    address: 'Đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    priceRange: 'FREE',
    openingHours: '24/7 (Phun lửa 21:00 cuối tuần)',
    tags: ['bridge', 'lightshow', 'photography'],
    description: 'Cây cầu biểu tượng với khả năng phun lửa và phun nước vào mỗi cuối tuần.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500',
    isActive: true
  },
  {
    _id: 'loc_003',
    name: 'Chợ Bến Thành',
    category: 'SHOPPING',
    city: 'Hồ Chí Minh',
    address: 'Quận 1, TP. Hồ Chí Minh',
    priceRange: 'MODERATE',
    openingHours: '06:00 - 18:00',
    tags: ['market', 'souvenirs', 'streetfood'],
    description: 'Ngôi chợ sầm uất lâu đời nhất Sài Gòn, nơi hội tụ đặc sản ẩm thực và quà lưu niệm.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500',
    isActive: true
  }
];

export const mockReportsData = {
  summary: {
    totalGross: 48500,
    totalCommission: 4850,
    avgOrderValue: 125,
    totalCount: 42
  },
  monthlyData: [
    { month: 'Jan', revenue: 7500, commission: 750, bookings: 7 },
    { month: 'Feb', revenue: 11200, commission: 1120, bookings: 10 },
    { month: 'Mar', revenue: 14600, commission: 1460, bookings: 13 },
    { month: 'Apr', revenue: 15200, commission: 1520, bookings: 12 }
  ],
  categoryData: [
    { name: 'CULTURE', value: 18, revenue: 21500 },
    { name: 'FOOD', value: 12, revenue: 14200 },
    { name: 'NATURE', value: 7, revenue: 8400 },
    { name: 'SHOPPING', value: 5, revenue: 4400 }
  ]
};

export const mockWithdrawalsList = [
  {
    _id: 'with_001',
    guideId: {
      _id: 'g_1',
      userId: { fullName: 'Trần Văn Nam', email: 'nam@guide.com' }
    },
    amount: 500,
    bankName: 'Vietcombank',
    accountNumber: '0011004321987',
    accountHolder: 'TRAN VAN NAM',
    bankInfo: {
      bankName: 'Vietcombank',
      accountNumber: '0011004321987',
      accountHolder: 'TRAN VAN NAM'
    },
    status: 'pending',
    createdAt: '2026-09-24T10:00:00.000Z'
  },
  {
    _id: 'with_002',
    guideId: {
      _id: 'g_2',
      userId: { fullName: 'Lê Hoàng Long', email: 'long@guide.com' }
    },
    amount: 320,
    bankName: 'Techcombank',
    accountNumber: '19034567891011',
    accountHolder: 'LE HOANG LONG',
    bankInfo: {
      bankName: 'Techcombank',
      accountNumber: '19034567891011',
      accountHolder: 'LE HOANG LONG'
    },
    status: 'completed',
    createdAt: '2026-09-20T14:30:00.000Z'
  }
];
