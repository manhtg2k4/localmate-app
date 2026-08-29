export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // App general
    appName: 'LocalMate',
    tagline: 'Connect with passionate local guides across Vietnam',

    // Navigation
    navExplore: 'Explore',
    navSaved: 'Favorites',
    navBookings: 'My Tours',
    navProfile: 'Account',
    navDashboard: 'Guide Portal',
    navSchedule: 'Schedule',
    navWallet: 'Wallet',

    // Auth
    welcomeTitle: 'Welcome to LocalMate',
    welcomeSub: 'Experience authentic culture with local experts',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signIn: 'Sign In',
    register: 'Register',
    noAccount: "Don't have an account?",
    registerNow: 'Register Now',
    quickDemoSignIn: 'Quick Demo Sign-In',
    touristDemo: '🧳 Tourist Account',
    guideDemo: '🙋‍♂️ Local Guide Account',
    tapToSignIn: 'Tap to Sign In',
    forgotPassword: 'Forgot Password?',

    // Tourist Home
    currentLocation: '📍 Current Destination',
    whereToExplore: 'Where do you want to explore today?',
    searchPlaceholder: 'Search guides, food tours, historic places...',
    serviceScooter: '🛵 Motorbike Tour',
    serviceFood: '🍜 Street Food Tour',
    serviceCulture: '🏛️ Heritage Tour',
    serviceWalking: '🚶 Walking City Tour',
    serviceAI: '🤖 AI Travel Advisor',
    servicePlaces: '🗺️ Destinations',
    smartAssistant: '🤖 AI Travel Matcher',
    aiTravelAdvisor: 'Personalized Tour Recommendation',
    aiDesc: 'Tell us your travel preferences and get matched with verified local guides instantly.',
    getRecommendations: 'Get Recommendations',
    popularDestinations: 'Must-Visit Destinations',
    featuredGuides: 'Top Rated Local Guides',
    seeAll: 'See all →',
    book: 'Book Tour',
    tours: 'tours led',
    perHour: '/hr',

    // Grab Matching Screen
    searchingGuides: 'Finding Nearby Local Guides...',
    radarSub: 'Connecting you with the best available guide in Hanoi',
    estArrival: 'Est. arrival time',
    cancelSearch: 'Cancel Search',
    matchSuccess: 'Guide Matched!',

    // Favorites
    savedFavorites: 'Saved Favorites ❤️',
    guidesTab: 'Local Guides',
    placesTab: 'Destinations',
    noFavoritesTitle: 'No Saved Items Yet',
    noFavoritesSub: 'Tap the heart icon on any place or guide profile to save them here.',
    explorePlaces: 'Explore Destinations',

    // Guide Dashboard
    guideWelcome: 'Guide Workspace',
    driverStatusOnline: 'Available for Tours 🟢',
    driverStatusOffline: 'Currently Away ⚪',
    todayIncome: 'Total Earnings',
    acceptanceRate: 'Tours Completed',
    driverRating: 'Rating',
    newIncomingOrder: '📩 New Tour Booking Request!',
    acceptOrder: 'Accept Booking',
    declineOrder: 'Decline Request',
    pendingRequests: 'Pending Tour Requests',
    noPendingRequests: '🎉 You are online and ready to accept new tour bookings.',
    earnings: 'Net Earnings',
    reviewRequest: 'View Request Details',
    updateSchedule: 'Update Availability',
    viewWallet: 'Wallet & Payouts',

    // Profile & Settings
    profileTitle: 'My Account Settings',
    appLanguage: 'App Language',
    selectLanguage: 'Select Language',
    english: 'English 🇬🇧',
    vietnamese: 'Tiếng Việt 🇻🇳',
    signOut: 'Sign Out',
    myBookings: 'My Bookings History',
    editProfile: 'Edit Profile Information',
    helpSupport: 'Help & Customer Support',
    termsPrivacy: 'Terms & Privacy Policy',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save Changes',
    back: 'Back',
  },
  vi: {
    // App general
    appName: 'LocalMate',
    tagline: 'Trải nghiệm du lịch chân thực cùng Hướng dẫn viên bản địa',

    // Navigation
    navExplore: 'Khám phá',
    navSaved: 'Yêu thích',
    navBookings: 'Chuyến đi',
    navProfile: 'Tài khoản',
    navDashboard: 'Góc HDV',
    navSchedule: 'Lịch trình',
    navWallet: 'Ví tiền',

    // Auth
    welcomeTitle: 'Chào mừng đến LocalMate',
    welcomeSub: 'Khám phá văn hóa độc đáo cùng Chuyên gia bản địa',
    emailLabel: 'Địa chỉ Email',
    passwordLabel: 'Mật khẩu',
    signIn: 'Đăng nhập',
    register: 'Đăng ký',
    noAccount: 'Chưa có tài khoản?',
    registerNow: 'Đăng ký ngay',
    quickDemoSignIn: 'Đăng nhập nhanh Dùng thử',
    touristDemo: '🧳 Tài khoản Du khách',
    guideDemo: '🙋‍♂️ Tài khoản HDV Bản địa',
    tapToSignIn: 'Nhấn để đăng nhập',
    forgotPassword: 'Quên mật khẩu?',

    // Tourist Home
    currentLocation: '📍 Điểm đến Hiện tại',
    whereToExplore: 'Bạn muốn trải nghiệm đâu hôm nay?',
    searchPlaceholder: 'Tìm HDV bản địa, Food Tour, danh thắng...',
    serviceScooter: '🛵 Tour Xe máy',
    serviceFood: '🍜 Tour Ẩm thực',
    serviceCulture: '🏛️ Tour Văn hóa',
    serviceWalking: '🚶 Tour Đi bộ',
    serviceAI: '🤖 Trợ lý AI',
    servicePlaces: '🗺️ Danh thắng',
    smartAssistant: '🤖 Gợi ý Đặt Tour AI',
    aiTravelAdvisor: 'Ghép cặp HDV Tự động',
    aiDesc: 'Cho AI biết sở thích du lịch để kết nối ngay với HDV bản địa phù hợp nhất.',
    getRecommendations: 'Tư vấn Tour Ngay',
    popularDestinations: 'Địa điểm Nổi bật',
    featuredGuides: 'Hướng dẫn viên Bản địa Đánh giá Cao',
    seeAll: 'Xem tất cả →',
    book: 'Đặt Tour',
    tours: 'chuyến đã dẫn',
    perHour: '/giờ',

    // Grab Matching Screen
    searchingGuides: 'Đang Quét Tìm HDV Bản Địa Gần Bạn...',
    radarSub: 'Hệ thống đang kết nối với HDV xuất sắc nhất tại khu vực',
    estArrival: 'Thời gian đón dự kiến',
    cancelSearch: 'Hủy Tìm Kiếm',
    matchSuccess: 'Đã Kết Nối Thành Công HDV!',

    // Favorites
    savedFavorites: 'Danh sách Yêu thích ❤️',
    guidesTab: 'Hướng dẫn viên',
    placesTab: 'Địa điểm',
    noFavoritesTitle: 'Chưa lưu địa điểm hay HDV nào',
    noFavoritesSub: 'Bấm biểu tượng trái tim ở trang chi tiết địa điểm hoặc HDV để lưu tại đây.',
    explorePlaces: 'Khám phá Địa điểm',

    // Guide Dashboard
    guideWelcome: 'Góc Hướng dẫn viên',
    driverStatusOnline: 'Đang sẵn sàng dẫn tour 🟢',
    driverStatusOffline: 'Đang nghỉ ⚪',
    todayIncome: 'Tổng thu nhập',
    acceptanceRate: 'Số tour thành công',
    driverRating: 'Đánh giá sao',
    newIncomingOrder: '📩 Có Yêu cầu Đặt Tour Mới!',
    acceptOrder: 'Xác nhận Nhận Tour',
    declineOrder: 'Từ chối',
    pendingRequests: 'Yêu cầu Đang chờ Xác nhận',
    noPendingRequests: '🎉 Bạn đang trực tuyến và sẵn sàng nhận tour mới.',
    earnings: 'Thu nhập thực nhận',
    reviewRequest: 'Xem thông tin tour',
    updateSchedule: 'Cập nhật Lịch làm việc',
    viewWallet: 'Quản lý Ví & Rút tiền',

    // Profile & Settings
    profileTitle: 'Cài đặt Tài khoản',
    appLanguage: 'Ngôn ngữ Ứng dụng',
    selectLanguage: 'Chọn Ngôn ngữ',
    english: 'English 🇬🇧',
    vietnamese: 'Tiếng Việt 🇻🇳',
    signOut: 'Đăng xuất',
    myBookings: 'Lịch sử Chuyến đi',
    editProfile: 'Chỉnh sửa Thông tin cá nhân',
    helpSupport: 'Hỗ trợ & Trung tâm Giúp đỡ',
    termsPrivacy: 'Quy định & Chính sách Bảo mật',

    // Common
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    cancel: 'Hủy',
    save: 'Lưu thay đổi',
    back: 'Quay lại',
  }
};
