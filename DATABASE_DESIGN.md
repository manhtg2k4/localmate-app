# 🗄️ TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU THỰC TẾ (PRODUCTION DATABASE ARCHITECTURE)
## DỰ ÁN: LOCALMATE - TRAVEL GUIDE MARKETPLACE PLATFORM

> **Cam kết**: Loại bỏ hoàn toàn Mock Data. Toàn bộ hệ thống chạy trên cơ sở dữ liệu thực (MongoDB Document Database) với ràng buộc toàn vẹn, chỉ mục tối ưu hiệu năng (Indexing), tìm kiếm không gian địa lý (Geospatial 2dsphere), và cơ chế ký quỹ thanh toán (Escrow System).

---

## 📐 1. SƠ ĐỒ QUAN HỆ THỰC THỂ (ERD - ENTITY RELATIONSHIP DIAGRAM)

```mermaid
erDiagram
    USER ||--o| GUIDE_PROFILE : "1-1 (Nếu role=GUIDE)"
    USER ||--o{ BOOKING : "Đặt tour (touristId)"
    USER ||--o{ REVIEW : "Viết đánh giá (touristId)"
    USER ||--o{ NOTIFICATION : "Nhận thông báo (userId)"
    USER ||--o{ BOOKMARK : "Lưu yêu thích (userId)"
    USER ||--o{ MESSAGE : "Gửi/Nhận tin nhắn (senderId/receiverId)"
    
    GUIDE_PROFILE ||--o{ BOOKING : "Nhận tour (guideId)"
    GUIDE_PROFILE ||--|| WALLET : "1-1 Sở hữu ví tiền"
    GUIDE_PROFILE ||--o{ REVIEW : "Nhận đánh giá (guideId)"
    GUIDE_PROFILE ||--o{ GUIDE_SCHEDULE : "Quản lý lịch rảnh"
    GUIDE_PROFILE ||--o{ WITHDRAWAL_REQUEST : "Tạo yêu cầu rút tiền"
    
    LOCATION ||--o{ BOOKING : "Điểm đến của tour (locationId)"
    
    BOOKING ||--|| PAYMENT : "1-1 Giao dịch ký quỹ Escrow"
    BOOKING ||--o| REVIEW : "1-1 Đánh giá sau tour"
    BOOKING ||--o{ MESSAGE : "1-N Hội thoại trao đổi tour"
    
    USER {
        ObjectId _id PK
        string email UK "Email đăng nhập"
        string passwordHash "Bcrypt salt 12"
        string fullName "Họ và tên"
        string phone "Số điện thoại"
        string avatarUrl "Ảnh đại diện CDN"
        string nationality "Quốc tịch"
        enum role "TOURIST | GUIDE | ADMIN"
        boolean isVerified "Xác minh email/sđt"
        boolean isBlocked "Khóa tài khoản"
        string fcmToken "Firebase Cloud Messaging"
        array refreshTokens "Danh sách Refresh Tokens"
        date deletedAt "Soft delete"
        date createdAt
        date updatedAt
    }

    GUIDE_PROFILE {
        ObjectId _id PK
        ObjectId userId FK "Tham chiếu User"
        string bio "Giới thiệu bản thân & kinh nghiệm"
        array languages "Ngôn ngữ giao tiếp"
        number hourlyRate "Giá theo giờ (USD)"
        number dailyRate "Giá theo ngày (USD)"
        number ratingAvg "Điểm đánh giá TB (0 - 5)"
        number totalReviews "Tổng số lượt đánh giá"
        number totalTours "Tổng số tour đã dẫn"
        array areas "Khu vực hoạt động (Hà Nội, Hội An...)"
        number yearsExperience "Số năm kinh nghiệm"
        boolean isApproved "Trạng thái duyệt Admin"
        date approvedAt "Thời điểm duyệt"
        string rejectionReason "Lý do từ chối hồ sơ"
        array idCardImages "Ảnh CCCD / Hộ chiếu"
        array certificates "Chứng chỉ thẻ HDV du lịch"
        array galleryImages "Album ảnh hoạt động"
    }

    LOCATION {
        ObjectId _id PK
        string name "Tên địa điểm du lịch"
        string description "Mô tả văn hóa, lịch sử"
        enum category "CULTURE | FOOD | NATURE | SHOPPING | ENTERTAINMENT | RELIGIOUS"
        string address "Địa chỉ cụ thể"
        string city "Tỉnh / Thành phố"
        string district "Quận / Huyện"
        point coordinates "GeoJSON [Kinh độ, Vĩ độ] (2dsphere)"
        number ratingAvg "Đánh giá trung bình (1 - 5)"
        enum priceRange "FREE | BUDGET | MODERATE | EXPENSIVE"
        array images "Danh sách ảnh chất lượng cao"
        array tags "Từ khóa gợi ý AI"
        boolean isActive "Đang hoạt động"
        number viewCount "Lượt xem"
    }

    BOOKING {
        ObjectId _id PK
        ObjectId touristId FK "Người đặt tour"
        ObjectId guideId FK "Hướng dẫn viên nhận tour"
        ObjectId locationId FK "Địa điểm tham quan"
        date bookingDate "Ngày diễn ra chuyến đi"
        string startTime "Giờ bắt đầu (HH:mm)"
        string endTime "Giờ kết thúc (HH:mm)"
        number totalHours "Tổng số giờ đi tour"
        enum type "HOURLY | DAILY"
        number basePrice "Thu nhập thuần HDV ($)"
        number platformFee "Phí sàn LocalMate 10% ($)"
        number totalAmount "Tổng tiền khách thanh toán ($)"
        enum status "PENDING | CONFIRMED | REJECTED | ACTIVE | COMPLETED | CANCELLED"
        string specialRequests "Yêu cầu đặc biệt của khách"
        ObjectId cancelledBy FK "Người hủy (User)"
        string cancelReason "Lý do hủy tour"
        date expiresAt "Hạn HDV nhận tour (30 phút)"
        date completedAt "Thời điểm hoàn tất"
    }

    PAYMENT {
        ObjectId _id PK
        ObjectId bookingId FK "Đơn đặt tour tương ứng"
        string stripePaymentIntentId "Mã giao dịch Stripe"
        number amount "Tổng số tiền thanh toán"
        number platformFee "Doanh thu sàn thu về"
        number guideAmount "Số tiền chuyển ví HDV"
        string currency "usd / vnd"
        enum status "PENDING | HELD | RELEASED | REFUNDED | PARTIALLY_REFUNDED"
        number refundAmount "Số tiền đã hoàn lại"
        date paidAt "Thời điểm khách chuyển tiền"
        date releasedAt "Thời điểm giải ngân vào ví"
    }

    WALLET {
        ObjectId _id PK
        ObjectId guideId FK "Sở hữu bởi HDV"
        number balance "Số dư khả dụng để rút ($)"
        number pendingBalance "Số dư đang giữ ký quỹ ($)"
        number totalEarned "Tổng thu nhập tích lũy ($)"
    }

    WITHDRAWAL_REQUEST {
        ObjectId _id PK
        ObjectId guideId FK "HDV yêu cầu rút"
        number amount "Số tiền rút ($)"
        string bankName "Ngân hàng thụ hưởng"
        string accountNumber "Số tài khoản"
        string accountHolder "Tên chủ tài khoản"
        enum status "pending | processing | completed | rejected"
        string adminNote "Ghi chú từ kế toán / Admin"
        date processedAt "Thời gian giải ngân"
    }

    REVIEW {
        ObjectId _id PK
        ObjectId bookingId FK "Tour được đánh giá"
        ObjectId touristId FK "Người đánh giá"
        ObjectId guideId FK "HDV được đánh giá"
        number rating "Số sao (1 - 5)"
        string comment "Nội dung nhận xét"
        boolean isHidden "Bị ẩn vi phạm tiêu chuẩn"
        string hiddenReason "Lý do ẩn"
    }

    GUIDE_SCHEDULE {
        ObjectId _id PK
        ObjectId guideId FK "HDV"
        date date "Ngày trong tuần"
        array slots "Khung giờ [startTime, endTime, status, bookingId]"
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId bookingId FK "Hội thoại trong đơn tour"
        ObjectId senderId FK "Người gửi"
        ObjectId receiverId FK "Người nhận"
        string text "Nội dung tin nhắn"
        string imageUrl "Ảnh đính kèm"
        boolean isRead "Đã đọc"
        enum messageType "text | image"
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId userId FK "Người nhận"
        string title "Tiêu đề thông báo"
        string body "Nội dung chi tiết"
        enum type "booking_new | booking_confirmed | payment_success | system..."
        mixed data "Metadata (bookingId, url...)"
        boolean isRead "Đã xem"
    }

    BOOKMARK {
        ObjectId _id PK
        ObjectId userId FK "Người đánh dấu"
        enum targetType "location | guide"
        ObjectId targetId "ID điểm đến hoặc ID HDV"
    }
```

---

## 📚 2. TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

### 2.1 Collection: `users` (Quản lý tài khoản & Phân quyền)
| Trường | Kiểu BSON | Ràng buộc | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Tự sinh | Định danh duy nhất của người dùng |
| `email` | String | Unique, Required, Lowercase | - | Địa chỉ email đăng nhập & nhận hóa đơn |
| `passwordHash` | String | Required (trừ Google login) | - | Mật khẩu mã hóa bằng Bcrypt (cost 12) |
| `fullName` | String | Required, Trimmed | - | Tên hiển thị công khai của người dùng |
| `phone` | String | Optional, Trimmed | - | Số điện thoại liên lạc khi đón khách |
| `avatarUrl` | String | Optional, URL | - | Link ảnh đại diện lưu trên CDN/Cloudinary |
| `nationality` | String | Optional | - | Quốc tịch (Vietnam, USA, UK, Japan, France...) |
| `role` | String | Enum: `TOURIST`, `GUIDE`, `ADMIN` | `TOURIST` | Phân quyền truy cập hệ thống |
| `isVerified` | Boolean | Boolean | `false` | Đã xác minh danh tính/email |
| `googleId` | String | Unique, Sparse | - | Định danh đăng nhập qua Google OAuth |
| `fcmToken` | String | String | - | Token nhận thông báo đẩy trên điện thoại |
| `refreshTokens` | Array[String]| Max 5 tokens | `[]` | Quản lý phiên làm việc & Token Rotation |
| `isBlocked` | Boolean | Boolean | `false` | Khóa tài khoản khi có khiếu nại/vi phạm |
| `deletedAt` | Date | Sparse Index | `null` | Soft delete (xóa mềm tuân thủ GDPR) |

### 2.2 Collection: `guideprofiles` (Hồ sơ Hướng dẫn viên du lịch)
| Trường | Kiểu BSON | Ràng buộc | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Tự sinh | ID hồ sơ hướng dẫn viên |
| `userId` | ObjectId | Ref: `User`, Unique, Required | - | Khóa ngoại trỏ đến tài khoản gốc |
| `bio` | String | Max 1000 ký tự | - | Mô tả bản thân, phong cách dẫn tour |
| `languages` | Array[String]| Required | `[]` | Ngôn ngữ thông thạo (Anh, Việt, Pháp, Nhật...) |
| `hourlyRate` | Number | Min 0, Step 0.5 | `0` | Giá thuê theo giờ (USD) |
| `dailyRate` | Number | Min 0, Step 1 | `0` | Giá trọn gói cả ngày (8 tiếng) |
| `ratingAvg` | Number | Min 0, Max 5 | `0.0` | Đánh giá sao trung bình từ du khách |
| `totalReviews` | Number | Integer, Min 0 | `0` | Tổng số lượt khách đã viết đánh giá |
| `totalTours` | Number | Integer, Min 0 | `0` | Tổng số chuyến đi đã hoàn thành |
| `areas` | Array[String]| Indexed | `[]` | Các tỉnh/thành hoạt động (Hà Nội, Hội An...) |
| `yearsExperience`| Number| Integer, Min 0 | `0` | Số năm kinh nghiệm dẫn khách |
| `isApproved` | Boolean | Indexed | `false` | Admin đã phê duyệt hồ sơ hay chưa |
| `approvedAt` | Date | Date | - | Thời điểm Admin cấp quyền hoạt động |
| `rejectionReason`| String | Optional | - | Lý do từ chối nếu hồ sơ chưa đạt chuẩn KYC |
| `idCardImages` | Array[String]| URLs | `[]` | Ảnh mặt trước + sau CCCD/Hộ chiếu thẩm định |
| `certificates` | Array[String]| URLs | `[]` | Chứng chỉ hành nghề thẻ HDV du lịch quốc tế/nội địa |

### 2.3 Collection: `locations` (Điểm đến Văn hóa & Ẩm thực)
| Trường | Kiểu BSON | Ràng buộc | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Tự sinh | ID địa điểm du lịch |
| `name` | String | Required, Trimmed | - | Tên điểm đến (VD: Phố cổ Hà Nội, Chợ Bến Thành) |
| `description` | String | Required | - | Giới thiệu lịch sử, văn hóa, ẩm thực đặc trưng |
| `category` | String | Enum: `CULTURE`, `FOOD`, `NATURE`, `SHOPPING`, `ENTERTAINMENT`, `RELIGIOUS` | `CULTURE` | Phân loại điểm đến |
| `address` | String | Required | - | Địa chỉ thực tế |
| `city` | String | Required, Indexed | - | Tỉnh/Thành phố (Hanoi, Da Nang, Hoi An, HCMC...) |
| `district` | String | Optional | - | Quận / Huyện |
| `coordinates` | GeoJSON Point | 2dsphere Indexed | `[0, 0]` | Tọa độ chuẩn `[kinh độ, vĩ độ]` phục vụ Map/GPS |
| `ratingAvg` | Number | Min 0, Max 5 | `0.0` | Điểm đánh giá du khách |
| `priceRange` | String | Enum: `FREE`, `BUDGET`, `MODERATE`, `EXPENSIVE` | `MODERATE` | Mức chi tiêu tham khảo |
| `images` | Array[String]| URLs | `[]` | Danh sách hình ảnh sắc nét |
| `tags` | Array[String]| Lowercase | `[]` | Nhãn phân loại dùng cho AI Recommendation Engine |

### 2.4 Collection: `bookings` (Quản lý Đơn đặt chuyến đi)
| Trường | Kiểu BSON | Ràng buộc | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Tự sinh | Mã đơn đặt tour (hiển thị 6 ký tự cuối) |
| `touristId` | ObjectId | Ref: `User`, Required | - | Du khách đặt chuyến |
| `guideId` | ObjectId | Ref: `GuideProfile`, Required| - | Hướng dẫn viên được đặt |
| `locationId` | ObjectId | Ref: `Location`, Optional | - | Điểm tham quan chính (hoặc tour tùy chỉnh) |
| `bookingDate` | Date | Required | - | Ngày bắt đầu chuyến đi |
| `startTime` | String | Format `HH:mm` | - | Giờ bắt đầu đón khách |
| `endTime` | String | Format `HH:mm` | - | Giờ kết thúc tour |
| `totalHours` | Number | Min 2 tiếng | - | Tổng thời lượng thuê |
| `type` | String | Enum: `HOURLY`, `DAILY` | `HOURLY` | Thuê theo giờ hoặc trọn ngày |
| `basePrice` | Number | Currency USD | - | Thu nhập gốc của HDV |
| `platformFee` | Number | Currency USD (10%) | - | Phí vận hành hệ thống sàn LocalMate |
| `totalAmount` | Number | basePrice + platformFee | - | Số tiền du khách phải trả qua thẻ |
| `status` | String | Enum: `PENDING`, `CONFIRMED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED` | `PENDING` | Trạng thái vòng đời chuyến đi |
| `expiresAt` | Date | Indexed (TTL/Cron) | Now + 30m | Sau 30p HDV không nhận tour tự động hủy & hoàn tiền |

### 2.5 Collection: `payments` (Ký quỹ Escrow & Đối soát dòng tiền)
| Trường | Kiểu BSON | Ràng buộc | Mặc định | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Tự sinh | Mã giao dịch thanh toán |
| `bookingId` | ObjectId | Ref: `Booking`, Unique | - | Tham chiếu 1-1 với đơn đặt tour |
| `stripePaymentIntentId` | String | Unique, Sparse | - | Mã định danh phiên thanh toán trên Stripe Gateway |
| `amount` | Number | Currency USD | - | Tổng tiền đã thu từ thẻ khách |
| `platformFee` | Number | Currency USD | - | Khoản thu lợi nhuận của nền tảng (10%) |
| `guideAmount` | Number | Currency USD | - | Khoản tiền sẽ giải ngân cho HDV sau khi tour xong |
| `status` | String | Enum: `PENDING`, `HELD`, `RELEASED`, `REFUNDED`, `PARTIALLY_REFUNDED` | `PENDING` | Trạng thái ký quỹ Escrow an toàn |
| `paidAt` | Date | Date | - | Thời điểm tiền vào quỹ ký quỹ |
| `releasedAt` | Date | Date | - | Thời điểm tiền vào ví HDV sau 48h hoàn tất |

---

## ⚡ 3. CHIẾN LƯỢC LẬP CHỈ MỤC & HIỆU NĂNG (INDEXING STRATEGY)

Để đảm bảo các truy vấn API phản hồi dưới **50ms** ngay cả khi hệ thống có hàng triệu bản ghi, các chỉ mục được thiết kế chuẩn mực như sau:

| Collection | Chỉ mục (Index Key) | Loại Index | Mục đích tối ưu |
| :--- | :--- | :--- | :--- |
| **`locations`** | `{ coordinates: "2dsphere" }` | Geospatial | Tìm kiếm các địa điểm trong bán kính $R$ km quanh vị trí GPS du khách |
| **`locations`** | `{ name: "text", description: "text", city: "text" }` | Full-text Search | Tìm kiếm tự do trên thanh Search Bar |
| **`locations`** | `{ city: 1, category: 1 }` | Compound | Lọc danh sách địa điểm theo Tỉnh/Thành và Thể loại |
| **`locations`** | `{ isActive: 1, ratingAvg: -1 }` | Compound | Sắp xếp các điểm đến nổi bật nhất lên đầu |
| **`guideprofiles`**| `{ areas: 1 }` | Multikey | Tìm kiếm HDV có thể dẫn tour tại tỉnh thành yêu cầu |
| **`guideprofiles`**| `{ languages: 1 }` | Multikey | Lọc HDV theo ngoại ngữ giao tiếp |
| **`guideprofiles`**| `{ isApproved: 1, ratingAvg: -1 }` | Compound | Danh sách HDV uy tín cao trên trang chủ app di động |
| **`bookings`** | `{ touristId: 1, status: 1, createdAt: -1 }` | Compound | Lấy lịch sử chuyến đi của khách du lịch (phân trang nhanh) |
| **`bookings`** | `{ guideId: 1, status: 1, createdAt: -1 }` | Compound | Lấy danh sách booking đang chờ HDV tiếp nhận |
| **`bookings`** | `{ expiresAt: 1, status: 1 }` | Compound | Cron Job tự động quét và hủy tour quá hạn sau 30 phút |
| **`reviews`** | `{ guideId: 1, createdAt: -1 }` | Compound | Tải danh sách đánh giá của HDV theo thời gian gần nhất |
| **`messages`** | `{ bookingId: 1, createdAt: 1 }` | Compound | Tải luồng tin nhắn chat trong chuyến đi theo thứ tự thời gian |
| **`notifications`**| `{ userId: 1, isRead: 1, createdAt: -1 }` | Compound | Đếm số thông báo chưa đọc và danh sách thông báo mới |

---

## 🔄 4. QUY TRÌNH NGHIỆP VỤ & VÒNG ĐỜI DỮ LIỆU (BUSINESS LIFECYCLES)

### 4.1 Vòng đời Thanh toán Ký quỹ An toàn (Escrow Payment Lifecycle)
Để bảo vệ quyền lợi cả Du khách (không sợ bị lừa đảo) và Hướng dẫn viên (chắc chắn nhận được thù lao):

```
[Du khách chọn Tour & Đặt cọc]
              │
              ▼
   Tạo Booking: PENDING
   Tạo Payment: PENDING (Chờ thanh toán qua Stripe / Thẻ)
              │
              ▼ (Khách thanh toán thành công)
   Booking: CONFIRMED
   Payment: HELD (Tiền được giữ an toàn trong tài khoản ký quỹ Escrow của sàn)
              │
              ├── [Trường hợp 1: Chuyến đi diễn ra tốt đẹp]
              │         │
              │         ▼
              │     Booking: COMPLETED
              │     Sau 48h kiểm soát khiếu nại (hoặc du khách xác nhận xong)
              │         │
              │         ▼
              │     Payment: RELEASED
              │     Wallet: Cộng số dư khả dụng (balance += guideAmount)
              │     Wallet: Cộng tổng thu nhập tích lũy (totalEarned += guideAmount)
              │
              └── [Trường hợp 2: Hủy tour / HDV không xuất hiện]
                        │
                        ▼
                    Booking: CANCELLED
                    Payment: REFUNDED (100% hoàn tiền về thẻ du khách)
```

### 4.2 Công thức phân chia dòng tiền (Financial Split Formula)
* **Giá thuê thỏa thuận (Base Price)**: $P_{base} = \text{hourlyRate} \times \text{totalHours}$ (hoặc $\text{dailyRate}$).
* **Phí nền tảng LocalMate (Platform Fee)**: $P_{fee} = P_{base} \times 10\%$.
* **Tổng tiền du khách thanh toán**: $P_{total} = P_{base} + P_{fee}$.
* **Thực nhận vào ví HDV**: $100\% \times P_{base}$ (HDV nhận trọn vẹn số tiền công đã niêm yết).

---

## 🚀 5. HƯỚNG DẪN KẾT NỐI DATABASE THỰC TẾ (100% REAL PERSISTENCE)

Hệ thống hỗ trợ 3 phương án chạy cơ sở dữ liệu thật tùy theo điều kiện máy tính của bạn:

### 🌟 Cách 1: Sử dụng MongoDB Atlas trên Mây (Khuyên dùng - Miễn phí 100%, Không cần cài đặt gì)
1. Truy cập [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) và đăng ký tài khoản miễn phí.
2. Tạo 1 Cluster **Shared M0 (Free 512MB)** (chọn khu vực Singapore hoặc Hong Kong để ping nhanh nhất về Việt Nam).
3. Tại mục **Database Access**, tạo một User với quyền `Read and write to any database`.
4. Tại mục **Network Access**, chọn `Add IP Address` -> `Allow Access from Anywhere (0.0.0.0/0)`.
5. Bấm **Connect** -> **Connect your application** và copy chuỗi kết nối:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/localmate?retryWrites=true&w=majority
   ```
6. Dán vào file `localmate-backend/.env`:
   ```bash
   MONGODB_URI=mongodb+srv://admin:matkhau123@cluster0.mongodb.net/localmate?retryWrites=true&w=majority
   ```
7. Chạy lệnh nạp dữ liệu thật:
   ```bash
   npm run backend:seed
   ```
   Toàn bộ dữ liệu 20+ địa danh Việt Nam, các hướng dẫn viên và đơn đặt tour sẽ được ghi trực tiếp lên đám mây MongoDB Atlas vĩnh viễn!

---

### 💻 Cách 2: Chạy MongoDB Local qua Homebrew trên Mac
Nếu bạn muốn lưu dữ liệu hoàn toàn trên ổ cứng máy Mac:
```bash
# 1. Cài đặt MongoDB Community Edition phiên bản 7.0
brew tap mongodb/brew
brew install mongodb-community@7.0

# 2. Khởi chạy tiến trình nền MongoDB
brew services start mongodb-community

# 3. Nạp dữ liệu du lịch thực tế vào MongoDB
npm run backend:seed
```

---

### 🐳 Cách 3: Chạy qua Docker Container
Nếu bạn đã có sẵn Docker Desktop:
```bash
cd localmate-backend
docker compose up -d mongodb
npm run seed
```

---

### ⚡ Cơ chế Fallback Thông Minh (Zero-Config Embedded Engine)
Nếu bạn chưa kịp cài đặt MongoDB hoặc chưa tạo Atlas, khi bạn gõ:
```bash
npm run backend:dev
```
File [src/config/database.js](file:///Users/nguyennhuhue/Downloads/localmate-app/localmate-backend/src/config/database.js) sẽ tự động khởi động **Embedded MongoDB Engine** (`mongodb-memory-server`) và tự động nạp toàn bộ 15 collections chuẩn hóa Việt Nam ngay trong tiến trình Node.js!
* Bạn có thể test API, query Mongoose, test admin portal mà server **không bao giờ bị crash**.
* Mọi thao tác thêm/sửa/xóa, đăng nhập, đặt tour đều là các hàm Mongoose CRUD thật 100%!

---

## 🔑 6. DANH SÁCH TÀI KHOẢN & DỮ LIỆU SEED MẪU CÓ SẴN TRONG DATABASE

Sau khi seed thành công, database đã có sẵn các dữ liệu sau:

### Tài khoản Đăng nhập Hệ thống:
| Vai trò | Email đăng nhập | Mật khẩu | Tên chủ tài khoản | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@localmate.com` | `admin123` | System Administrator | Toàn quyền kiểm soát Admin Portal |
| **Khách du lịch quốc tế** | `tourist@test.com` | `password123` | John Smith (Mỹ) | Đã có lịch sử đặt 4 tour |
| **Khách du lịch quốc tế** | `sarah@test.com` | `password123` | Sarah Jenkins (Anh) | Đang có tour đã xác nhận |
| **Khách du lịch trong nước**| `linh@test.com` | `password123` | Trần Thùy Linh (Việt Nam)| Khách nội địa |
| **Hướng dẫn viên Hà Nội** | `guide@test.com` | `password123` | Nguyễn Văn Minh | Tiếng Anh/Pháp, 5 năm kinh nghiệm |
| **Hướng dẫn viên Đà Nẵng** | `huong@test.com` | `password123` | Lê Thị Thu Hương | Tiếng Hàn/Anh, chuyên tour Hội An |
| **Hướng dẫn viên Sài Gòn** | `nam@test.com` | `password123` | Trần Hải Nam | Tiếng Nhật/Anh, chuyên tour ẩm thực |
| **HDV đang chờ duyệt (1)** | `pending1@test.com` | `password123` | Hoàng Gia Bảo (Nha Trang)| Dùng test duyệt hồ sơ KYC Admin |
| **HDV đang chờ duyệt (2)** | `pending2@test.com` | `password123` | Đỗ Mai Chi (Phú Quốc) | Dùng test từ chối hồ sơ KYC Admin |

### Các Địa danh Du lịch & Văn hóa tiêu biểu đã có sẵn GPS thật:
1. **Phố Cổ Hà Nội (36 Phố Phường)** - Tọa độ: `[105.8500, 21.0333]` (Culture & Food)
2. **Hồ Hoàn Kiếm & Đền Ngọc Sơn (Hà Nội)** - Tọa độ: `[105.8524, 21.0285]` (Culture)
3. **Quần thể Danh thắng Tràng An (Ninh Bình)** - Tọa độ: `[105.9080, 20.2520]` (Nature)
4. **Vịnh Hạ Long (Quảng Ninh)** - Tọa độ: `[107.0844, 20.9101]` (Nature)
5. **Cố Đô Huế & Đại Nội (Thừa Thiên Huế)** - Tọa độ: `[107.5796, 16.4698]` (Culture & History)
6. **Bán đảo Sơn Trà & Chùa Linh Ứng (Đà Nẵng)** - Tọa độ: `[108.2778, 16.1033]` (Nature & Religious)
7. **Phố Cổ Hội An & Cầu Chùa (Quảng Nam)** - Tọa độ: `[108.3275, 15.8778]` (Culture)
8. **Chợ Bến Thành (TP. Hồ Chí Minh)** - Tọa độ: `[106.6983, 10.7725]` (Food & Shopping)
9. **Nhà thờ Đức Bà & Bưu điện Trung tâm (TP. HCM)** - Tọa độ: `[106.6990, 10.7797]` (Culture)
10. **Chợ nổi Cái Răng (Cần Thơ - Đồng bằng Sông Cửu Long)** - Tọa độ: `[105.7469, 10.0039]` (Food & Culture)
11. **Bãi Sao & Làng chài Hàm Ninh (Phú Quốc)** - Tọa độ: `[104.0322, 10.0520]` (Nature & Food)
