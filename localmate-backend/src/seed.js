require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const GuideProfile = require('./models/GuideProfile');
const Location = require('./models/Location');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Review = require('./models/Review');
const Wallet = require('./models/Wallet');
const WithdrawalRequest = require('./models/WithdrawalRequest');
const GuideSchedule = require('./models/GuideSchedule');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Bookmark = require('./models/Bookmark');

const seedDatabase = async () => {
  const isStandalone = mongoose.connection.readyState !== 1;
  if (isStandalone) {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localmate';
    await mongoose.connect(uri);
    console.log('🌱 Connected to MongoDB for comprehensive seeding...');
  } else {
    console.log('🌱 Seeding database on active connection...');
  }

  // 1. Clear existing database collections
  await Promise.all([
    User.deleteMany({}),
    GuideProfile.deleteMany({}),
    Location.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
    Wallet.deleteMany({}),
    WithdrawalRequest.deleteMany({}),
    GuideSchedule.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Bookmark.deleteMany({})
  ]);

  console.log('🧹 Cleaned existing collections.');

  // Password hashes
  const adminHash = await bcrypt.hash('admin123', 12);
  const commonHash = await bcrypt.hash('password123', 12);

  // 2. Create Admin User
  const adminUser = await User.create({
    email: 'admin@localmate.com',
    passwordHash: adminHash,
    fullName: 'System Administrator',
    phone: '+84901234567',
    role: 'ADMIN',
    nationality: 'Vietnam',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerified: true
  });

  // 3. Create Diverse Tourist Users
  const touristsData = [
    {
      email: 'tourist@test.com',
      passwordHash: commonHash,
      fullName: 'John Smith',
      nationality: 'USA',
      phone: '+15551234567',
      role: 'TOURIST',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isVerified: true
    },
    {
      email: 'sarah@test.com',
      passwordHash: commonHash,
      fullName: 'Sarah Jenkins',
      nationality: 'UK',
      phone: '+447911123456',
      role: 'TOURIST',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isVerified: true
    },
    {
      email: 'kenji@test.com',
      passwordHash: commonHash,
      fullName: 'Kenji Sato',
      nationality: 'Japan',
      phone: '+819012345678',
      role: 'TOURIST',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isVerified: true
    },
    {
      email: 'linh@test.com',
      passwordHash: commonHash,
      fullName: 'Trần Thùy Linh',
      nationality: 'Vietnam',
      phone: '0987654321',
      role: 'TOURIST',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isVerified: true
    },
    {
      email: 'david@test.com',
      passwordHash: commonHash,
      fullName: 'David Dupont',
      nationality: 'France',
      phone: '+33612345678',
      role: 'TOURIST',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      isVerified: true
    }
  ];

  const tourists = await User.insertMany(touristsData);
  const [john, sarah, kenji, linh, david] = tourists;

  // 4. Create Guide Users (6 Approved + 2 Pending for Admin Review testing)
  const guideUsersData = [
    // Approved Guides
    {
      email: 'guide@test.com',
      passwordHash: commonHash,
      fullName: 'Nguyễn Văn Minh',
      nationality: 'Vietnam',
      phone: '0912345678',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      isVerified: true
    },
    {
      email: 'huong@test.com',
      passwordHash: commonHash,
      fullName: 'Lê Thị Thu Hương',
      nationality: 'Vietnam',
      phone: '0923456789',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      isVerified: true
    },
    {
      email: 'nam@test.com',
      passwordHash: commonHash,
      fullName: 'Trần Hải Nam',
      nationality: 'Vietnam',
      phone: '0934567890',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      isVerified: true
    },
    {
      email: 'anh@test.com',
      passwordHash: commonHash,
      fullName: 'Phạm Hoàng Anh',
      nationality: 'Vietnam',
      phone: '0945678901',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      isVerified: true
    },
    {
      email: 'thao@test.com',
      passwordHash: commonHash,
      fullName: 'Vũ Phương Thảo',
      nationality: 'Vietnam',
      phone: '0956789012',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      isVerified: true
    },
    {
      email: 'tuan@test.com',
      passwordHash: commonHash,
      fullName: 'Đặng Anh Tuấn',
      nationality: 'Vietnam',
      phone: '0967890123',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      isVerified: true
    },
    // Pending Guides for Admin Approval testing
    {
      email: 'pending1@test.com',
      passwordHash: commonHash,
      fullName: 'Hoàng Quốc Bảo',
      nationality: 'Vietnam',
      phone: '0978901234',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      isVerified: true
    },
    {
      email: 'pending2@test.com',
      passwordHash: commonHash,
      fullName: 'Nguyễn Mai Chi',
      nationality: 'Vietnam',
      phone: '0989012345',
      role: 'GUIDE',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      isVerified: true
    }
  ];

  const guideUsers = await User.insertMany(guideUsersData);

  // 5. Create Guide Profiles
  const guideProfilesData = [
    {
      userId: guideUsers[0]._id, // Minh - Hanoi
      bio: 'Native Hanoian with 5+ years of experience guiding international travelers. Specialized in Old Quarter secret culinary spots, French colonial architecture, and craft villages.',
      languages: ['English', 'Vietnamese', 'French'],
      hourlyRate: 25,
      dailyRate: 150,
      ratingAvg: 4.9,
      totalReviews: 28,
      totalTours: 52,
      areas: ['Hanoi', 'Ninh Binh', 'Ha Long'],
      yearsExperience: 5,
      isApproved: true,
      approvedAt: new Date('2025-01-10'),
      idCardImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'],
      certificates: ['https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400'],
      galleryImages: [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
        'https://images.unsplash.com/photo-1528127269322-539801943592?w=500'
      ]
    },
    {
      userId: guideUsers[1]._id, // Huong - Da Nang & Hoi An
      bio: 'Passionate about Central Vietnam culture, lantern making traditions in Hoi An ancient town, and hidden beach viewpoints along the Son Tra peninsula.',
      languages: ['English', 'Vietnamese', 'Korean'],
      hourlyRate: 22,
      dailyRate: 130,
      ratingAvg: 4.8,
      totalReviews: 22,
      totalTours: 38,
      areas: ['Da Nang', 'Hoi An', 'Hue'],
      yearsExperience: 4,
      isApproved: true,
      approvedAt: new Date('2025-02-15'),
      idCardImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'],
      certificates: ['https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400']
    },
    {
      userId: guideUsers[2]._id, // Nam - Ho Chi Minh City
      bio: 'Saigon insider with deep knowledge of history, rooftop speakeasies, street coffee culture, and Mekong Delta river lifestyle.',
      languages: ['English', 'Vietnamese', 'Japanese'],
      hourlyRate: 30,
      dailyRate: 180,
      ratingAvg: 5.0,
      totalReviews: 35,
      totalTours: 68,
      areas: ['Ho Chi Minh City', 'Mekong Delta', 'Vung Tau'],
      yearsExperience: 6,
      isApproved: true,
      approvedAt: new Date('2024-11-20'),
      idCardImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400']
    },
    {
      userId: guideUsers[3]._id, // Hoang Anh - Ninh Binh
      bio: 'Local born in Trang An. Expert boatman and cyclist who knows every secluded cave, limestone peak, and lotus field away from tourist crowds.',
      languages: ['English', 'Vietnamese'],
      hourlyRate: 20,
      dailyRate: 120,
      ratingAvg: 4.7,
      totalReviews: 18,
      totalTours: 29,
      areas: ['Ninh Binh', 'Hanoi'],
      yearsExperience: 3,
      isApproved: true,
      approvedAt: new Date('2025-03-01')
    },
    {
      userId: guideUsers[4]._id, // Thao - Hue
      bio: 'Historian graduate specialized in the Nguyen Dynasty Imperial Citadel, royal cuisine recipes, and traditional perfumed river folklore.',
      languages: ['English', 'Vietnamese', 'German'],
      hourlyRate: 22,
      dailyRate: 135,
      ratingAvg: 4.9,
      totalReviews: 20,
      totalTours: 34,
      areas: ['Hue', 'Da Nang'],
      yearsExperience: 4,
      isApproved: true,
      approvedAt: new Date('2025-02-01')
    },
    {
      userId: guideUsers[5]._id, // Tuan - Sa Pa
      bio: 'Trekking enthusiast and ethnic culture researcher. Leading scenic mountain climbs to Fansipan, Muong Hoa valley terraces, and local homestays.',
      languages: ['English', 'Vietnamese', 'Hmong'],
      hourlyRate: 28,
      dailyRate: 160,
      ratingAvg: 4.8,
      totalReviews: 24,
      totalTours: 44,
      areas: ['Sa Pa', 'Ha Giang'],
      yearsExperience: 5,
      isApproved: true,
      approvedAt: new Date('2025-01-05')
    },
    // Pending Guide 1 (For testing Admin GuideApproval page)
    {
      userId: guideUsers[6]._id, // Bao - Nha Trang
      bio: 'Certified diving instructor and marine enthusiast. Seeking approval to guide island hopping and coastal eco-tours in Nha Trang bay.',
      languages: ['English', 'Vietnamese', 'Russian'],
      hourlyRate: 18,
      dailyRate: 110,
      ratingAvg: 0,
      totalReviews: 0,
      totalTours: 0,
      areas: ['Nha Trang', 'Cam Ranh'],
      yearsExperience: 2,
      isApproved: false,
      idCardImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'],
      certificates: ['https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400']
    },
    // Pending Guide 2 (For testing Admin GuideApproval page)
    {
      userId: guideUsers[7]._id, // Mai Chi - Phu Quoc
      bio: 'Island native passionate about pepper farms, sunset sailing, night squid fishing, and seafood culinary discovery tours.',
      languages: ['English', 'Vietnamese'],
      hourlyRate: 24,
      dailyRate: 140,
      ratingAvg: 0,
      totalReviews: 0,
      totalTours: 0,
      areas: ['Phu Quoc'],
      yearsExperience: 3,
      isApproved: false,
      idCardImages: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'],
      certificates: ['https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400']
    }
  ];

  const guideProfiles = await GuideProfile.insertMany(guideProfilesData);
  const [minhGuide, huongGuide, namGuide, anhGuide, thaoGuide, tuanGuide] = guideProfiles;

  // 6. Create Wallets for Approved Guides
  await Wallet.insertMany([
    { guideId: minhGuide._id, balance: 420.00, totalEarned: 3850.00 },
    { guideId: huongGuide._id, balance: 280.50, totalEarned: 2450.00 },
    { guideId: namGuide._id, balance: 650.00, totalEarned: 5200.00 },
    { guideId: anhGuide._id, balance: 190.00, totalEarned: 1650.00 },
    { guideId: thaoGuide._id, balance: 240.00, totalEarned: 2100.00 },
    { guideId: tuanGuide._id, balance: 390.00, totalEarned: 3120.00 }
  ]);

  // 7. Create Withdrawal Requests (for testing Admin Payout tab)
  await WithdrawalRequest.insertMany([
    {
      guideId: minhGuide._id,
      amount: 150.00,
      bankName: 'Vietcombank',
      accountNumber: '0011004567890',
      accountHolder: 'NGUYEN VAN MINH',
      status: 'pending',
      createdAt: new Date('2026-06-20')
    },
    {
      guideId: huongGuide._id,
      amount: 200.00,
      bankName: 'Techcombank',
      accountNumber: '19034567890123',
      accountHolder: 'LE THI THU HUONG',
      status: 'pending',
      createdAt: new Date('2026-06-22')
    },
    {
      guideId: namGuide._id,
      amount: 350.00,
      bankName: 'MB Bank',
      accountNumber: '0934567890',
      accountHolder: 'TRAN HAI NAM',
      status: 'completed',
      adminNote: 'Transferred via NAPAS 24/7',
      processedAt: new Date('2026-06-15'),
      createdAt: new Date('2026-06-14')
    },
    {
      guideId: tuanGuide._id,
      amount: 400.00,
      bankName: 'BIDV',
      accountNumber: '12345678901234',
      accountHolder: 'DANG ANH TUAN',
      status: 'completed',
      adminNote: 'Transferred batch #TX8821',
      processedAt: new Date('2026-06-10'),
      createdAt: new Date('2026-06-09')
    }
  ]);

  // 8. Create 20+ Iconic Vietnam Locations
  const locationsData = [
    // Hanoi
    {
      name: 'Hồ Hoàn Kiếm (Hoan Kiem Lake)',
      description: 'Iconic emerald lake in the heart of Hanoi featuring Turtle Tower, Ngoc Son Temple, and the red Huc Bridge.',
      category: 'CULTURE',
      city: 'Hanoi',
      district: 'Hoan Kiem',
      address: 'Dinh Tien Hoang, Hang Trong, Hoan Kiem, Ha Noi',
      coordinates: { type: 'Point', coordinates: [105.8542, 21.0285] },
      ratingAvg: 4.8,
      priceRange: 'FREE',
      tags: ['iconic', 'peaceful', 'walking', 'history', 'photography'],
      images: [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        'https://images.unsplash.com/photo-1528127269322-539801943592?w=800'
      ],
      isActive: true,
      viewCount: 1450
    },
    {
      name: 'Phố Cổ Hà Nội (Hanoi Old Quarter)',
      description: '36 historic guild streets preserved since the 11th century, famous for bustling street food and French colonial buildings.',
      category: 'CULTURE',
      city: 'Hanoi',
      district: 'Hoan Kiem',
      address: 'Old Quarter, Hoan Kiem, Ha Noi',
      coordinates: { type: 'Point', coordinates: [105.8490, 21.0340] },
      ratingAvg: 4.7,
      priceRange: 'FREE',
      tags: ['street-food', 'ancient', 'shopping', 'nightlife', 'culture'],
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
      isActive: true,
      viewCount: 1890
    },
    {
      name: 'Văn Miếu - Quốc Tử Giám',
      description: "Vietnam's first national university built in 1070 dedicated to Confucius, featuring stone turtle steles and courtyards.",
      category: 'CULTURE',
      city: 'Hanoi',
      district: 'Dong Da',
      address: '58 Quoc Tu Giam, Dong Da, Ha Noi',
      coordinates: { type: 'Point', coordinates: [105.8354, 21.0269] },
      ratingAvg: 4.6,
      priceRange: 'BUDGET',
      tags: ['history', 'education', 'architecture', 'temple', 'unesco'],
      images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
      isActive: true,
      viewCount: 980
    },
    {
      name: 'Phở Gia Truyền Bát Đàn',
      description: 'Legendary wood-fire beef noodle soup served since the 1960s with rich, clear broth and tender brisket.',
      category: 'FOOD',
      city: 'Hanoi',
      district: 'Hoan Kiem',
      address: '49 Bat Dan, Cua Dong, Hoan Kiem, Ha Noi',
      coordinates: { type: 'Point', coordinates: [105.8465, 21.0336] },
      ratingAvg: 4.6,
      priceRange: 'BUDGET',
      tags: ['pho', 'breakfast', 'authentic', 'traditional', 'must-try'],
      images: ['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800'],
      isActive: true,
      viewCount: 1120
    },
    {
      name: 'Hồ Tây (West Lake Sunset)',
      description: 'Largest freshwater lake in Hanoi, ideal for afternoon sunset cycling, lakeside cafes, and visiting Tran Quoc Pagoda.',
      category: 'NATURE',
      city: 'Hanoi',
      district: 'Tay Ho',
      address: 'Thanh Nien, Yen Phu, Tay Ho, Ha Noi',
      coordinates: { type: 'Point', coordinates: [105.8234, 21.0557] },
      ratingAvg: 4.7,
      priceRange: 'FREE',
      tags: ['sunset', 'cycling', 'coffee', 'peaceful', 'lake'],
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
      isActive: true,
      viewCount: 840
    },
    // Ha Long
    {
      name: 'Vịnh Hạ Long (Ha Long Bay)',
      description: 'World-renowned UNESCO World Heritage Site with thousands of dramatic limestone karsts rising out of emerald waters.',
      category: 'NATURE',
      city: 'Ha Long',
      district: 'Ha Long City',
      address: 'Bai Chay, Ha Long, Quang Ninh',
      coordinates: { type: 'Point', coordinates: [107.1839, 20.9101] },
      ratingAvg: 4.9,
      priceRange: 'EXPENSIVE',
      tags: ['unesco', 'boat-cruise', 'kayaking', 'caves', 'scenic'],
      images: ['https://images.unsplash.com/photo-1528127269322-539801943592?w=800'],
      isActive: true,
      viewCount: 2300
    },
    // Ninh Binh
    {
      name: 'Quần thể danh thắng Tràng An',
      description: 'UNESCO Dual World Heritage Site featuring boat cave tours along pristine rivers surrounded by towering karst cliffs.',
      category: 'NATURE',
      city: 'Ninh Binh',
      district: 'Hoa Lu',
      address: 'Trang An, Hoa Lu, Ninh Binh',
      coordinates: { type: 'Point', coordinates: [105.9125, 20.2506] },
      ratingAvg: 4.9,
      priceRange: 'MODERATE',
      tags: ['unesco', 'boat-tour', 'caves', 'nature', 'landscape'],
      images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'],
      isActive: true,
      viewCount: 1650
    },
    {
      name: 'Hang Múa (Mua Cave Viewpoint)',
      description: 'Climb 500 stone steps to reach the dragon peak for a 360-degree panoramic view of Tam Coc river valley.',
      category: 'NATURE',
      city: 'Ninh Binh',
      district: 'Hoa Lu',
      address: 'Khe Ha, Ninh Xuan, Hoa Lu, Ninh Binh',
      coordinates: { type: 'Point', coordinates: [105.9382, 20.2317] },
      ratingAvg: 4.8,
      priceRange: 'BUDGET',
      tags: ['hiking', 'viewpoint', 'dragon', 'photography', 'panorama'],
      images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'],
      isActive: true,
      viewCount: 1200
    },
    // Da Nang & Hoi An
    {
      name: 'Bãi biển Mỹ Khê (My Khe Beach)',
      description: 'Famed pristine white sand beach stretching along Da Nang with gentle waves, seafood shacks, and water sports.',
      category: 'NATURE',
      city: 'Da Nang',
      district: 'Son Tra',
      address: 'Vo Nguyen Giap, Son Tra, Da Nang',
      coordinates: { type: 'Point', coordinates: [108.2468, 16.0544] },
      ratingAvg: 4.7,
      priceRange: 'FREE',
      tags: ['beach', 'swimming', 'seafood', 'relaxation', 'water-sports'],
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
      isActive: true,
      viewCount: 1540
    },
    {
      name: 'Cầu Rồng (Dragon Bridge)',
      description: 'Spectacular dragon-shaped bridge spanning the Han River that breathes real fire and water every Saturday and Sunday evening.',
      category: 'ENTERTAINMENT',
      city: 'Da Nang',
      district: 'Hai Chau',
      address: 'Nguyen Van Linh, Hai Chau, Da Nang',
      coordinates: { type: 'Point', coordinates: [108.2272, 16.0610] },
      ratingAvg: 4.7,
      priceRange: 'FREE',
      tags: ['fire-show', 'nightlife', 'bridge', 'landmark', 'city-lights'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      isActive: true,
      viewCount: 1320
    },
    {
      name: 'Phố Cổ Hội An (Hoi An Ancient Town)',
      description: 'Charming UNESCO-listed ancient trading port with glowing silk lanterns, wooden shophouses, tailor shops, and riverside dining.',
      category: 'CULTURE',
      city: 'Hoi An',
      district: 'Hoi An',
      address: 'Old Town, Hoi An, Quang Nam',
      coordinates: { type: 'Point', coordinates: [108.3380, 15.8801] },
      ratingAvg: 4.9,
      priceRange: 'MODERATE',
      tags: ['lanterns', 'unesco', 'ancient-town', 'cycling', 'romance'],
      images: ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800'],
      isActive: true,
      viewCount: 2600
    },
    {
      name: 'Cơm Gà Bà Buội (Ba Buoi Chicken Rice)',
      description: 'Famous heritage Hoi An chicken rice cooked with turmeric, shredded free-range chicken, and fresh local herbs.',
      category: 'FOOD',
      city: 'Hoi An',
      district: 'Hoi An',
      address: '22 Phan Chu Trinh, Hoi An, Quang Nam',
      coordinates: { type: 'Point', coordinates: [108.3288, 15.8775] },
      ratingAvg: 4.5,
      priceRange: 'BUDGET',
      tags: ['chicken-rice', 'heritage', 'local-food', 'lunch', 'must-eat'],
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'],
      isActive: true,
      viewCount: 890
    },
    // Hue
    {
      name: 'Đại Nội Huế (Imperial City of Hue)',
      description: 'Walled royal palace citadel of the Nguyen Emperors featuring ornate gates, temples, gardens, and imperial pavilions.',
      category: 'CULTURE',
      city: 'Hue',
      district: 'Hue City',
      address: 'Thuong Thanh, Hue, Thua Thien Hue',
      coordinates: { type: 'Point', coordinates: [107.5786, 16.4697] },
      ratingAvg: 4.8,
      priceRange: 'MODERATE',
      tags: ['palace', 'dynasty', 'history', 'architecture', 'unesco'],
      images: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800'],
      isActive: true,
      viewCount: 1420
    },
    {
      name: 'Chùa Thiên Mụ (Thien Mu Pagoda)',
      description: 'Historic seven-story octagonal pagoda standing peacefully on the banks of the Perfume River since 1601.',
      category: 'RELIGIOUS',
      city: 'Hue',
      district: 'Huong Long',
      address: 'Kim Long, Huong Long, Hue',
      coordinates: { type: 'Point', coordinates: [107.5451, 16.4528] },
      ratingAvg: 4.6,
      priceRange: 'FREE',
      tags: ['pagoda', 'river-view', 'peaceful', 'spiritual', 'iconic'],
      images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800'],
      isActive: true,
      viewCount: 760
    },
    // Ho Chi Minh City
    {
      name: 'Chợ Bến Thành (Ben Thanh Market)',
      description: 'Historic central marketplace filled with vibrant stalls offering textiles, handmade crafts, coffee beans, and local snacks.',
      category: 'SHOPPING',
      city: 'Ho Chi Minh City',
      district: 'District 1',
      address: 'Le Loi, Ben Thanh, District 1, Ho Chi Minh City',
      coordinates: { type: 'Point', coordinates: [106.6982, 10.7725] },
      ratingAvg: 4.4,
      priceRange: 'BUDGET',
      tags: ['market', 'souvenirs', 'coffee', 'bustling', 'shopping'],
      images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800'],
      isActive: true,
      viewCount: 1780
    },
    {
      name: 'Dinh Độc Lập (Independence Palace)',
      description: 'Symbolic landmark of South Vietnam history featuring preserved presidential rooms, war command bunkers, and gardens.',
      category: 'CULTURE',
      city: 'Ho Chi Minh City',
      district: 'District 1',
      address: '135 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City',
      coordinates: { type: 'Point', coordinates: [106.6953, 10.7770] },
      ratingAvg: 4.6,
      priceRange: 'BUDGET',
      tags: ['history', 'landmark', 'architecture', 'bunker', 'museum'],
      images: ['https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'],
      isActive: true,
      viewCount: 1190
    },
    {
      name: 'Phố Đi Bộ Nguyễn Huệ',
      description: 'Bustling pedestrian boulevard lined with heritage buildings, trendy cafe apartments, street performers, and fountains.',
      category: 'ENTERTAINMENT',
      city: 'Ho Chi Minh City',
      district: 'District 1',
      address: 'Nguyen Hue, District 1, Ho Chi Minh City',
      coordinates: { type: 'Point', coordinates: [106.7032, 10.7738] },
      ratingAvg: 4.7,
      priceRange: 'FREE',
      tags: ['nightlife', 'walking', 'coffee', 'city-vibes', 'fountain'],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      isActive: true,
      viewCount: 1620
    },
    // Sa Pa
    {
      name: 'Đỉnh Fansipan (Fansipan Peak)',
      description: 'The Roof of Indochina at 3,143m above sea level offering breathless cloud-ocean panoramas accessible by cable car or trek.',
      category: 'NATURE',
      city: 'Sa Pa',
      district: 'Sa Pa',
      address: 'Fansipan Legend, Sa Pa, Lao Cai',
      coordinates: { type: 'Point', coordinates: [103.7750, 22.3033] },
      ratingAvg: 4.9,
      priceRange: 'EXPENSIVE',
      tags: ['mountain', 'clouds', 'cable-car', 'hiking', 'roof-of-indochina'],
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'],
      isActive: true,
      viewCount: 2100
    },
    {
      name: 'Thung Lũng Mường Hoa (Muong Hoa Valley)',
      description: 'Spectacular stepped rice terraces carved into mountain slopes, dotted with traditional Hmong and Red Dao ethnic villages.',
      category: 'NATURE',
      city: 'Sa Pa',
      district: 'Sa Pa',
      address: 'Muong Hoa, Sa Pa, Lao Cai',
      coordinates: { type: 'Point', coordinates: [103.8741, 22.3167] },
      ratingAvg: 4.8,
      priceRange: 'BUDGET',
      tags: ['rice-terraces', 'trekking', 'ethnic-villages', 'scenery', 'homestay'],
      images: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'],
      isActive: true,
      viewCount: 1450
    }
  ];

  const locations = await Location.insertMany(locationsData);
  const [hoanKiem, oldQuarter, vanMieu, batDan, westLake, haLong, trangAn, muaCave, myKhe, dragonBridge, hoiAnTown, baBuoi, imperialHue] = locations;

  // 9. Create Guide Schedules (Available time slots)
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

  await GuideSchedule.insertMany([
    {
      guideId: minhGuide._id,
      date: tomorrow,
      slots: [
        { startTime: '08:00', endTime: '12:00', status: 'available' },
        { startTime: '13:30', endTime: '17:30', status: 'available' }
      ]
    },
    {
      guideId: huongGuide._id,
      date: tomorrow,
      slots: [
        { startTime: '09:00', endTime: '13:00', status: 'available' },
        { startTime: '15:00', endTime: '19:00', status: 'available' }
      ]
    },
    {
      guideId: namGuide._id,
      date: nextWeek,
      slots: [
        { startTime: '08:30', endTime: '12:30', status: 'available' },
        { startTime: '14:00', endTime: '18:00', status: 'available' }
      ]
    }
  ]);

  // 10. Create Realistic Bookings across 2026 (Completed, Confirmed, Pending, Cancelled)
  const bookingsData = [
    // Completed Bookings (Monthly Financial Spread Jan - Jun)
    {
      touristId: john._id,
      guideId: minhGuide._id,
      locationId: hoanKiem._id,
      bookingDate: new Date('2026-01-15'),
      startTime: '09:00',
      endTime: '13:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 100.00,
      platformFee: 15.00,
      totalAmount: 115.00,
      status: 'COMPLETED',
      specialRequests: 'Interested in photography angles around Turtle Tower.',
      completedAt: new Date('2026-01-15T13:30:00')
    },
    {
      touristId: sarah._id,
      guideId: minhGuide._id,
      locationId: oldQuarter._id,
      bookingDate: new Date('2026-02-18'),
      startTime: '14:00',
      endTime: '18:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 100.00,
      platformFee: 15.00,
      totalAmount: 115.00,
      status: 'COMPLETED',
      specialRequests: 'Vegetarian street food options preferred.',
      completedAt: new Date('2026-02-18T18:30:00')
    },
    {
      touristId: kenji._id,
      guideId: huongGuide._id,
      locationId: hoiAnTown._id,
      bookingDate: new Date('2026-03-10'),
      startTime: '08:30',
      endTime: '16:30',
      totalHours: 8,
      type: 'DAILY',
      basePrice: 130.00,
      platformFee: 19.50,
      totalAmount: 149.50,
      status: 'COMPLETED',
      specialRequests: 'Lantern making workshop visit.',
      completedAt: new Date('2026-03-10T17:00:00')
    },
    {
      touristId: david._id,
      guideId: namGuide._id,
      locationId: locations[14]._id, // Ben Thanh
      bookingDate: new Date('2026-04-12'),
      startTime: '09:00',
      endTime: '17:00',
      totalHours: 8,
      type: 'DAILY',
      basePrice: 180.00,
      platformFee: 27.00,
      totalAmount: 207.00,
      status: 'COMPLETED',
      specialRequests: 'French colonial history and architecture tour.',
      completedAt: new Date('2026-04-12T17:30:00')
    },
    {
      touristId: linh._id,
      guideId: anhGuide._id,
      locationId: trangAn._id,
      bookingDate: new Date('2026-05-05'),
      startTime: '08:00',
      endTime: '12:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 80.00,
      platformFee: 12.00,
      totalAmount: 92.00,
      status: 'COMPLETED',
      specialRequests: 'Boat tour along Route 3 in Trang An.',
      completedAt: new Date('2026-05-05T12:30:00')
    },
    {
      touristId: john._id,
      guideId: thaoGuide._id,
      locationId: imperialHue._id,
      bookingDate: new Date('2026-05-22'),
      startTime: '09:00',
      endTime: '13:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 88.00,
      platformFee: 13.20,
      totalAmount: 101.20,
      status: 'COMPLETED',
      specialRequests: 'Royal citadel history tour.',
      completedAt: new Date('2026-05-22T13:30:00')
    },
    {
      touristId: sarah._id,
      guideId: tuanGuide._id,
      locationId: locations[17]._id, // Fansipan
      bookingDate: new Date('2026-06-08'),
      startTime: '08:00',
      endTime: '16:00',
      totalHours: 8,
      type: 'DAILY',
      basePrice: 160.00,
      platformFee: 24.00,
      totalAmount: 184.00,
      status: 'COMPLETED',
      specialRequests: 'Fansipan summit trekking advice.',
      completedAt: new Date('2026-06-08T16:30:00')
    },
    {
      touristId: kenji._id,
      guideId: minhGuide._id,
      locationId: vanMieu._id,
      bookingDate: new Date('2026-06-15'),
      startTime: '09:00',
      endTime: '12:00',
      totalHours: 3,
      type: 'HOURLY',
      basePrice: 75.00,
      platformFee: 11.25,
      totalAmount: 86.25,
      status: 'COMPLETED',
      specialRequests: 'Temple history and calligraphy.',
      completedAt: new Date('2026-06-15T12:30:00')
    },
    // Confirmed Upcoming Bookings
    {
      touristId: john._id,
      guideId: minhGuide._id,
      locationId: westLake._id,
      bookingDate: tomorrow,
      startTime: '09:00',
      endTime: '13:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 100.00,
      platformFee: 15.00,
      totalAmount: 115.00,
      status: 'CONFIRMED',
      specialRequests: 'Sunset cycling around West Lake.'
    },
    {
      touristId: sarah._id,
      guideId: huongGuide._id,
      locationId: myKhe._id,
      bookingDate: tomorrow,
      startTime: '15:00',
      endTime: '19:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 88.00,
      platformFee: 13.20,
      totalAmount: 101.20,
      status: 'CONFIRMED',
      specialRequests: 'Seafood dinner recommendations after beach walk.'
    },
    // Pending Bookings (Awaiting Guide Action)
    {
      touristId: david._id,
      guideId: minhGuide._id,
      locationId: haLong._id,
      bookingDate: nextWeek,
      startTime: '08:00',
      endTime: '16:00',
      totalHours: 8,
      type: 'DAILY',
      basePrice: 150.00,
      platformFee: 22.50,
      totalAmount: 172.50,
      status: 'PENDING',
      specialRequests: 'Private day cruise arrangement in Ha Long Bay.'
    },
    {
      touristId: linh._id,
      guideId: namGuide._id,
      locationId: locations[16]._id, // Nguyen Hue
      bookingDate: nextWeek,
      startTime: '18:00',
      endTime: '21:00',
      totalHours: 3,
      type: 'HOURLY',
      basePrice: 90.00,
      platformFee: 13.50,
      totalAmount: 103.50,
      status: 'PENDING',
      specialRequests: 'Evening rooftop bar discovery tour.'
    },
    // Cancelled Booking
    {
      touristId: kenji._id,
      guideId: anhGuide._id,
      locationId: muaCave._id,
      bookingDate: new Date('2026-05-18'),
      startTime: '14:00',
      endTime: '18:00',
      totalHours: 4,
      type: 'HOURLY',
      basePrice: 80.00,
      platformFee: 12.00,
      totalAmount: 92.00,
      status: 'CANCELLED',
      cancelledBy: kenji._id,
      cancelReason: 'Flight schedule changed due to bad weather.'
    },
    // Rejected Booking
    {
      touristId: david._id,
      guideId: huongGuide._id,
      locationId: dragonBridge._id,
      bookingDate: new Date('2026-04-20'),
      startTime: '19:00',
      endTime: '22:00',
      totalHours: 3,
      type: 'HOURLY',
      basePrice: 66.00,
      platformFee: 9.90,
      totalAmount: 75.90,
      status: 'REJECTED',
      cancelReason: 'Guide already had a family event scheduled on this evening.'
    }
  ];

  const bookings = await Booking.insertMany(bookingsData);

  // 11. Create Payments for Bookings
  const paymentsData = bookings.map((b, idx) => ({
    bookingId: b._id,
    stripePaymentIntentId: `pi_test_${b._id.toString().slice(-8)}_${idx}`,
    amount: b.totalAmount,
    platformFee: b.platformFee,
    guideAmount: b.basePrice,
    currency: 'usd',
    status: b.status === 'COMPLETED' ? 'RELEASED' : (b.status === 'CONFIRMED' ? 'HELD' : 'PENDING'),
    paidAt: b.status !== 'PENDING' ? new Date(b.createdAt) : undefined,
    releasedAt: b.status === 'COMPLETED' ? b.completedAt : undefined
  }));

  await Payment.insertMany(paymentsData);

  // 12. Create Authentic Reviews for Completed Bookings
  const reviewsData = [
    {
      bookingId: bookings[0]._id,
      touristId: john._id,
      guideId: minhGuide._id,
      rating: 5,
      comment: 'Minh is an incredible guide! He showed me secret alleys in Hanoi and Turtle Tower viewpoints that no typical tourist guide knows about. 10/10 recommended!'
    },
    {
      bookingId: bookings[1]._id,
      touristId: sarah._id,
      guideId: minhGuide._id,
      rating: 5,
      comment: 'Outstanding food tour! Minh tailored the entire street food crawl to my vegetarian diet. The egg coffee spot was fabulous.'
    },
    {
      bookingId: bookings[2]._id,
      touristId: kenji._id,
      guideId: huongGuide._id,
      rating: 5,
      comment: 'Huong was very polite, knowledgeable, and fluent in English. She arranged a private lantern craftsman session for us in Hoi An. Wonderful experience!'
    },
    {
      bookingId: bookings[3]._id,
      touristId: david._id,
      guideId: namGuide._id,
      rating: 5,
      comment: 'Nam knows Saigon like the back of his hand! Great historical perspective on French architecture and the best banh mi in town.'
    },
    {
      bookingId: bookings[4]._id,
      touristId: linh._id,
      guideId: anhGuide._id,
      rating: 4,
      comment: 'Hoàng Anh rất nhiệt tình và chu đáo, chèo thuyền đưa đi các hang động Tràng An rất đẹp và an toàn!'
    },
    {
      bookingId: bookings[5]._id,
      touristId: john._id,
      guideId: thaoGuide._id,
      rating: 5,
      comment: 'Thao brought the Imperial Citadel to life with vivid royal stories. Super friendly and polite guide in Hue!'
    },
    {
      bookingId: bookings[6]._id,
      touristId: sarah._id,
      guideId: tuanGuide._id,
      rating: 5,
      comment: 'Spectacular trekking guide in Sa Pa! Tuấn ensured our safety throughout the mountain trails and introduced us to lovely local homestays.'
    }
  ];

  await Review.insertMany(reviewsData);

  // 13. Create Realistic Chat Messages for Active & Completed Bookings
  const messagesData = [
    {
      bookingId: bookings[8]._id, // Tomorrow's booking between John & Minh
      senderId: john._id,
      receiverId: guideUsers[0]._id,
      text: 'Hi Minh! Looking forward to our West Lake tour tomorrow.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      bookingId: bookings[8]._id,
      senderId: guideUsers[0]._id,
      receiverId: john._id,
      text: 'Hello John! Everything is prepared. I will bring two premium city bikes. See you at 9:00 AM at Tran Quoc Pagoda gate!',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 4)
    },
    {
      bookingId: bookings[8]._id,
      senderId: john._id,
      receiverId: guideUsers[0]._id,
      text: 'Sounds perfect, thanks Minh!',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      bookingId: bookings[9]._id, // Tomorrow's booking between Sarah & Huong
      senderId: sarah._id,
      receiverId: guideUsers[1]._id,
      text: 'Hi Huong, is it easy to park near My Khe beach where we meet?',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 6)
    },
    {
      bookingId: bookings[9]._id,
      senderId: guideUsers[1]._id,
      receiverId: sarah._id,
      text: 'Hi Sarah! Yes, there is ample designated parking right next to the beach cafe. I will be waiting by the palm entrance with a LocalMate badge.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 3)
    }
  ];

  await Message.insertMany(messagesData);

  // 14. Create Notifications for Users
  const notificationsData = [
    {
      userId: john._id,
      title: 'Booking Confirmed! ✅',
      body: 'Guide Nguyễn Văn Minh has confirmed your West Lake tour tomorrow.',
      type: 'booking_confirmed',
      data: { bookingId: bookings[8]._id },
      isRead: false
    },
    {
      userId: guideUsers[0]._id,
      title: 'New Booking Request! 🎉',
      body: 'David Dupont requested a full-day tour in Ha Long Bay.',
      type: 'booking_new',
      data: { bookingId: bookings[10]._id },
      isRead: false
    },
    {
      userId: guideUsers[0]._id,
      title: 'Payout Processed! 💵',
      body: 'Your withdrawal request of $150.00 is being processed.',
      type: 'system',
      isRead: true
    },
    {
      userId: sarah._id,
      title: 'Booking Confirmed! ✅',
      body: 'Guide Lê Thị Thu Hương has confirmed your Da Nang tour.',
      type: 'booking_confirmed',
      data: { bookingId: bookings[9]._id },
      isRead: true
    }
  ];

  await Notification.insertMany(notificationsData);

  // 15. Create Bookmarks (Favorites)
  await Bookmark.insertMany([
    { userId: john._id, targetType: 'guide', targetId: minhGuide._id },
    { userId: john._id, targetType: 'location', targetId: hoanKiem._id },
    { userId: sarah._id, targetType: 'guide', targetId: huongGuide._id },
    { userId: sarah._id, targetType: 'location', targetId: hoiAnTown._id },
    { userId: kenji._id, targetType: 'location', targetId: trangAn._id }
  ]);

  console.log('\n======================================================');
  console.log('🎉 COMPREHENSIVE LOCALMATE SEED DATA CREATED SUCCESSFULLY!');
  console.log('======================================================');
  console.log('👤 Admin Portal:   admin@localmate.com   / admin123');
  console.log('✈️ Tourist Account: tourist@test.com     / password123 (John Smith)');
  console.log('   Other Tourists:  sarah@test.com, kenji@test.com, linh@test.com');
  console.log('🧭 Guide Account:   guide@test.com       / password123 (Nguyễn Văn Minh - Hanoi)');
  console.log('   Other Guides:    huong@test.com (Da Nang), nam@test.com (Saigon), anh@test.com (Ninh Binh)');
  console.log('⏳ Pending Guides:  pending1@test.com, pending2@test.com (For Admin Guide Approval testing)');
  console.log('📍 Locations:       20+ Destinations across Hanoi, Da Nang, Hoi An, HCMC, Sa Pa, Hue, Ha Long');
  console.log('📅 Bookings:        16 Bookings (Completed, Confirmed, Pending, Cancelled)');
  console.log('💰 Payouts:         4 Withdrawal Requests (Pending & Completed for Admin Reports testing)');
  console.log('======================================================\n');

  if (isStandalone) {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
