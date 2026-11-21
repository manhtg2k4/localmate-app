# 📘 TÀI LIỆU HOÀN THIỆN & BỔ SUNG ĐỒ ÁN TỐT NGHIỆP LOCALMATE
## DỰ ÁN: XÂY DỰNG ỨNG DỤNG DI ĐỘNG KẾT NỐI DU KHÁCH VÀ HƯỚNG DẪN VIÊN ĐỊA PHƯƠNG (LOCALMATE)
* **Sinh viên thực hiện**: Nguyễn Hữu Mạnh – MSV: 2251061833 – Lớp: 64CNTT3
* **Giáo viên hướng dẫn**: Trương Xuân Nam – Khoa Công nghệ thông tin, Trường Đại học Thủy Lợi

---

## 🎯 DANH MỤC NỘI DUNG ĐÃ CẬP NHẬT TRỰC TIẾP VÀO FILE WORD
File tài liệu chính thức: [`tài liệu đồ án/DoAn_LocalMate_NguyenHuuManh.docx`](file:///Users/nguyennhuhue/Downloads/localmate-app/ta%CC%80i%20lie%CC%A3%CC%82u%20%C4%91o%CC%82%CC%80%20a%CC%81n%20/DoAn_LocalMate_NguyenHuuManh.docx) đã được nâng cấp tự động với các chỉnh sửa sau:
1. **Sửa trang bìa**: Thay đổi `BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG` thành `BỘ NÔNG NGHIỆP VÀ PHÁT TRIỂN NÔNG THÔN`.
2. **Gỡ bỏ 100% placeholder**: Xóa toàn bộ 13 vị trí có chữ `[CHÈN ẢNH CHỤP MÀN HÌNH]`.
3. **Sửa tên tiêu đề Hình 5.1**: Chuyển thành `Hình 5.1: Giao diện Đăng nhập và Trang chủ Du khách` (bỏ câu ghi chú nháp trong ngoặc đơn).
4. **Nhúng trực tiếp 8 ảnh giao diện & báo cáo kiểm thử vào Word**:
   - `Hình 4.4a: Biểu đồ tuần tự Đăng ký và Đăng nhập hệ thống` (nguồn `seq_dang_nhap.png`).
   - `Hình 5.1: Giao diện Đăng nhập và Trang chủ Du khách` (nguồn `H5.1_xac_thuc_va_trang_chu.png`).
   - `Hình 5.2: Màn hình tìm kiếm hướng dẫn viên và Gợi ý AI` (nguồn `H5.2_tim_kiem_hdv_va_goi_y_ai.png`).
   - `Hình 5.3: Màn hình tạo đơn và thanh toán` (nguồn `H5.3_tao_don_va_thanh_toan.png`).
   - `Hình 5.4: Màn hình trò chuyện và lịch sử đơn đặt` (nguồn `H5.4_tro_chuyen_va_lich_su_don.png`).
   - `Hình 5.5: Các màn hình của hướng dẫn viên` (nguồn `H5.5_phan_he_huong_dan_vien.png`).
   - `Hình 5.6: Giao diện Web Admin: Dashboard và duyệt hướng dẫn viên` (nguồn `H5.6_admin_dashboard_va_duyet_hdv.png`).
   - `Hình 5.7: Trang báo cáo tài chính của Web Admin` (nguồn `H5.7_admin_bao_cao_va_dia_diem.png`).
   - `Hình 5.8: Báo cáo kết quả kiểm thử tự động Playwright E2E (36/36 kịch bản Pass 100%)` (nguồn `H5.8_playwright_test_report.png`).

---

# PHẦN I: TỪ ĐIỂN CƠ SỞ DỮ LIỆU CHI TIẾT (DATA DICTIONARY - 12 COLLECTIONS)
*(Bổ sung cho Mục 4.5 của Đồ án – Toàn bộ 12 bảng thực tế chạy trên MongoDB)*

### 1. Bảng 4.12: Collection `users` – Quản lý tài khoản người dùng
Lưu trữ thông tin xác thực, phân quyền và dữ liệu cá nhân của mọi tác nhân trong hệ thống (Du khách, Hướng dẫn viên, Quản trị viên).

| Tên trường (Field) | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính (Primary Key). |
| `email` | String | Có | - | Khóa duy nhất (Unique Index), chuẩn hóa chữ thường (lowercase). |
| `passwordHash` | String | Có | - | Mật khẩu băm Bcrypt với Salt Round 12. |
| `fullName` | String | Có | - | Họ và tên hiển thị người dùng (Tối đa 100 ký tự). |
| `phone` | String | Không | null | Số điện thoại liên hệ (Định dạng E.164). |
| `avatarUrl` | String | Không | Default | Đường dẫn ảnh đại diện lưu trữ trên Cloudinary CDN. |
| `nationality` | String | Không | "Vietnam"| Quốc tịch của người dùng (Hỗ trợ lọc gợi ý ngôn ngữ). |
| `role` | String (Enum) | Có | "TOURIST"| Quyền tài khoản: `TOURIST`, `GUIDE`, `ADMIN`. |
| `isVerified` | Boolean | Có | false | Trạng thái xác thực email/số điện thoại. |
| `isBlocked` | Boolean | Có | false | Cờ khóa tài khoản do Quản trị viên thực hiện khi vi phạm. |
| `fcmToken` | String | Không | null | Device Token đăng ký với Firebase Cloud Messaging. |
| `refreshTokens`| Array[String]| Không | [] | Mảng chuỗi Refresh Token hợp lệ (Cơ chế xoay vòng tối đa 5 phiên). |
| `deletedAt` | Date | Không | null | Đánh dấu xóa mềm (Soft Delete). |
| `createdAt` | Date | Có | Date.now | Thời điểm tạo tài khoản. |
| `updatedAt` | Date | Có | Date.now | Thời điểm cập nhật thông tin gần nhất. |

---

### 2. Bảng 4.13: Collection `guide_profiles` – Hồ sơ chi tiết Hướng dẫn viên
Mở rộng từ User (Quan hệ 1-1 khi `role = GUIDE`), quản lý chứng chỉ, đơn giá, khu vực và đánh giá.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `userId` | ObjectId | Có | - | Khóa ngoại (FK) tham chiếu `users._id` (Unique Index). |
| `bio` | String | Không | "" | Tiểu sử giới thiệu kinh nghiệm và phong cách dẫn tour. |
| `languages` | Array[String]| Có | ["Vietnamese"]| Danh sách ngôn ngữ thông thạo (VD: English, French, Japanese). |
| `hourlyRate` | Number | Có | 15.0 | Đơn giá thuê theo giờ (USD), tối thiểu 5 USD. |
| `dailyRate` | Number | Có | 100.0 | Đơn giá thuê trọn ngày 8 tiếng (USD). |
| `ratingAvg` | Number | Có | 0.0 | Điểm đánh giá trung bình từ du khách (0.00 – 5.00). |
| `totalReviews` | Number | Có | 0 | Tổng số lượt nhận xét, đánh giá đã kiểm duyệt. |
| `totalTours` | Number | Có | 0 | Tổng số chuyến đi đã dẫn thành công (`COMPLETED`). |
| `areas` | Array[String]| Có | [] | Khu vực hoạt động chuyên môn (Hà Nội, Hội An, Đà Nẵng...). |
| `yearsExperience`| Number | Không | 1 | Số năm kinh nghiệm làm hướng dẫn viên. |
| `isApproved` | Boolean | Có | false | Trạng thái được Admin phê duyệt để hiển thị công khai. |
| `approvedAt` | Date | Không | null | Thời điểm Admin duyệt hồ sơ. |
| `rejectionReason`| String | Không | null | Lý do từ chối hồ sơ nếu chứng chỉ/thông tin chưa đạt. |
| `idCardImages` | Array[String]| Có | [] | Danh sách URL ảnh CCCD / Hộ chiếu hai mặt (Cloudinary). |
| `certificates` | Array[String]| Không | [] | Ảnh thẻ hướng dẫn viên du lịch nội địa/quốc tế. |
| `galleryImages`| Array[String]| Không | [] | Album ảnh các hoạt động trải nghiệm thực tế. |

---

### 3. Bảng 4.14: Collection `locations` – Địa điểm du lịch & Chỉ mục không gian địa lý
Lưu trữ danh mục thắng cảnh, văn hóa, ẩm thực tích hợp chỉ mục không gian địa lý 2dsphere.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `name` | String | Có | - | Tên địa điểm du lịch (Text Index hỗ trợ tìm kiếm). |
| `description` | String | Không | "" | Mô tả lịch sử, văn hóa, nét đặc sắc. |
| `category` | String (Enum) | Có | "CULTURE"| `CULTURE`, `FOOD`, `NATURE`, `SHOPPING`, `ENTERTAINMENT`, `RELIGIOUS`. |
| `address` | String | Có | - | Địa chỉ chi tiết. |
| `city` | String | Có | - | Tỉnh / Thành phố trực thuộc (Hà Nội, Đà Nẵng, TP.HCM...). |
| `coordinates` | GeoJSON Point | Có | - | Tọa độ `type: "Point"`, `coordinates: [Kinh độ, Vĩ độ]`. Đánh chỉ mục `2dsphere`. |
| `ratingAvg` | Number | Có | 5.0 | Điểm đánh giá trung bình (1.0 – 5.0). |
| `priceRange` | String (Enum) | Có | "BUDGET" | Mức chi phí ước tính: `FREE`, `BUDGET`, `MODERATE`, `EXPENSIVE`. |
| `images` | Array[String]| Có | [] | Danh sách URL ảnh chất lượng cao trên CDN. |
| `tags` | Array[String]| Không | [] | Mảng từ khóa hỗ trợ Prompt gợi ý AI Claude. |
| `isActive` | Boolean | Có | true | Đang mở cửa đón khách tham quan. |
| `viewCount` | Number | Có | 0 | Số lượt xem trên ứng dụng di động. |

---

### 4. Bảng 4.15: Collection `bookings` – Đơn đặt tour
Quản lý toàn bộ chu trình đặt lịch giữa Du khách và Hướng dẫn viên, ràng buộc trạng thái và chi phí.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `touristId` | ObjectId | Có | - | FK tham chiếu `users._id` (Người tạo đơn). |
| `guideId` | ObjectId | Có | - | FK tham chiếu `guide_profiles._id` (HDV nhận đơn). |
| `locationId` | ObjectId | Có | - | FK tham chiếu `locations._id` (Điểm đến). |
| `bookingDate` | Date | Có | - | Ngày bắt đầu chuyến đi. |
| `startTime` | String | Có | "09:00" | Giờ bắt đầu tour (Định dạng HH:mm). |
| `endTime` | String | Có | "13:00" | Giờ kết thúc tour (Định dạng HH:mm). |
| `totalHours` | Number | Có | 4 | Tổng thời lượng chuyến đi (Tối thiểu 2 tiếng nếu tính theo giờ). |
| `type` | String (Enum) | Có | "HOURLY" | Loại hình tour: `HOURLY` (theo giờ) hoặc `DAILY` (trọn ngày). |
| `basePrice` | Number | Có | - | Tiền công thuần của Hướng dẫn viên ($). |
| `platformFee` | Number | Có | - | Phí dịch vụ sàn LocalMate (Mặc định 15%). |
| `totalAmount` | Number | Có | - | Tổng tiền du khách thanh toán (`basePrice + platformFee`). |
| `status` | String (Enum) | Có | "PENDING"| `PENDING`, `CONFIRMED`, `REJECTED`, `ACTIVE`, `COMPLETED`, `CANCELLED`. |
| `specialRequests`| String | Không | "" | Ghi chú yêu cầu riêng của du khách (Ăn kiêng, hỗ trợ trẻ em...). |
| `cancelReason` | String | Không | null | Lý do hủy đơn (Nếu trạng thái là `CANCELLED` hoặc `REJECTED`). |
| `cancelledBy` | ObjectId | Không | null | FK người thực hiện hủy đơn. |
| `expiresAt` | Date | Có | +30 phút | Hạn chót HDV phải xác nhận trước khi Cron tự động hủy. |

---

### 5. Bảng 4.16: Collection `payments` – Giao dịch thanh toán ký quỹ Escrow
Quản lý dòng tiền thanh toán qua Stripe, hỗ trợ giữ tiền an toàn và đối soát tự động.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `bookingId` | ObjectId | Có | - | FK tham chiếu `bookings._id` (Unique Index). |
| `stripePaymentIntentId` | String | Không | - | Mã định danh giao dịch PaymentIntent từ cổng Stripe. |
| `stripeClientSecret` | String | Không | - | Khóa bí mật giao tiếp với Stripe Payment Sheet mobile. |
| `amount` | Number | Có | - | Tổng số tiền thanh toán bằng USD. |
| `currency` | String | Có | "usd" | Đơn vị tiền tệ. |
| `status` | String (Enum) | Có | "PENDING"| `PENDING`, `HELD` (Đã giữ tiền), `RELEASED` (Đã giải ngân), `REFUNDED`, `PARTIALLY_REFUNDED`. |
| `paidAt` | Date | Không | null | Thời điểm thanh toán thành công qua Stripe. |
| `releasedAt` | Date | Không | null | Thời điểm giải ngân tiền vào ví HDV sau khi tour hoàn tất. |
| `refundAmount` | Number | Có | 0.0 | Số tiền đã hoàn lại cho du khách (nếu có). |
| `refundedAt` | Date | Không | null | Thời điểm thực hiện hoàn tiền. |

---

### 6. Bảng 4.17: Collection `wallets` – Ví tiền Hướng dẫn viên
Quản lý số dư tích lũy khả dụng và số dư đang chờ giải ngân từ các tour đang diễn ra.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `guideId` | ObjectId | Có | - | FK tham chiếu `guide_profiles._id` (Unique Index). |
| `balance` | Number | Có | 0.0 | Số dư khả dụng có thể rút về tài khoản ngân hàng ($). |
| `pendingBalance`| Number | Có | 0.0 | Số dư đang giữ ký quỹ Escrow chờ tour hoàn thành ($). |
| `totalEarned` | Number | Có | 0.0 | Tổng thu nhập tích lũy trọn đời của HDV ($). |
| `totalWithdrawn`| Number | Có | 0.0 | Tổng số tiền đã rút thành công về ngân hàng ($). |

---

### 7. Bảng 4.18: Collection `withdrawal_requests` – Yêu cầu rút tiền
Quản lý các lệnh rút tiền từ ví của Hướng dẫn viên gửi lên Ban quản trị xét duyệt.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `guideId` | ObjectId | Có | - | FK tham chiếu `guide_profiles._id`. |
| `amount` | Number | Có | - | Số tiền yêu cầu rút ($), tối thiểu 20 USD. |
| `bankName` | String | Có | - | Tên ngân hàng thụ hưởng (Vietcombank, MB, Techcombank...). |
| `accountNumber`| String | Có | - | Số tài khoản ngân hàng. |
| `accountHolder`| String | Có | - | Tên chủ sở hữu tài khoản (Viết hoa không dấu). |
| `status` | String (Enum) | Có | "PENDING"| `PENDING`, `APPROVED`, `REJECTED`, `TRANSFERRED`. |
| `processedBy` | ObjectId | Không | null | FK Admin xử lý yêu cầu. |
| `processedAt` | Date | Không | null | Thời điểm xử lý chuyển khoản. |
| `adminNote` | String | Không | "" | Ghi chú hoặc mã tham chiếu ủy nhiệm chi. |

---

### 8. Bảng 4.19: Collection `reviews` – Đánh giá & Nhận xét
Lưu trữ đánh giá trải nghiệm thực tế sau mỗi tour đã hoàn thành.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `bookingId` | ObjectId | Có | - | FK tham chiếu `bookings._id` (Chỉ đánh giá khi `COMPLETED`). |
| `touristId` | ObjectId | Có | - | FK tham chiếu `users._id` (Người viết đánh giá). |
| `guideId` | ObjectId | Có | - | FK tham chiếu `guide_profiles._id` (HDV nhận đánh giá). |
| `rating` | Number | Có | - | Số sao đánh giá từ 1 đến 5 (Số nguyên). |
| `comment` | String | Có | - | Nhận xét chi tiết (Tối đa 1000 ký tự). |
| `isVisible` | Boolean | Có | true | Trạng thái hiển thị công khai (Admin có thể ẩn nếu độc hại). |

---

### 9. Bảng 4.20: Collection `messages` – Tin nhắn trò chuyện thời gian thực
Lưu trữ lịch sử hội thoại Socket.IO gắn liền với từng đơn đặt tour.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `bookingId` | ObjectId | Có | - | FK tham chiếu `bookings._id` (Chỉ chat trong phạm vi tour). |
| `senderId` | ObjectId | Có | - | FK tham chiếu `users._id` (Người gửi tin). |
| `receiverId` | ObjectId | Có | - | FK tham chiếu `users._id` (Người nhận tin). |
| `text` | String | Không | "" | Nội dung tin nhắn văn bản. |
| `imageUrl` | String | Không | null | URL ảnh gửi kèm qua Cloudinary CDN. |
| `messageType` | String (Enum) | Có | "text" | `text`, `image`, `system` (Thông báo tự động trong chat). |
| `isRead` | Boolean | Có | false | Trạng thái người nhận đã đọc tin nhắn. |

---

### 10. Bảng 4.21: Collection `notifications` – Thông báo đẩy người dùng
Quản lý lịch sử thông báo hệ thống và sự kiện thời gian thực.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `userId` | ObjectId | Có | - | FK tham chiếu `users._id` (Người nhận thông báo). |
| `title` | String | Có | - | Tiêu đề thông báo ngắn gọn. |
| `body` | String | Có | - | Nội dung chi tiết thông báo. |
| `type` | String (Enum) | Có | "system" | `booking_created`, `booking_confirmed`, `booking_rejected`, `payment_success`, `payout_ready`. |
| `data` | Object | Không | {} | Dữ liệu kèm theo (chứa `bookingId`, `url` điều hướng). |
| `isRead` | Boolean | Có | false | Đã xem thông báo. |

---

### 11. Bảng 4.22: Collection `bookmarks` – Địa điểm & HDV yêu thích
Quản lý danh sách lưu trữ quan tâm cá nhân của du khách.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `userId` | ObjectId | Có | - | FK tham chiếu `users._id`. |
| `targetId` | ObjectId | Có | - | FK tham chiếu `locations._id` hoặc `guide_profiles._id`. |
| `targetType` | String (Enum) | Có | "LOCATION"| `LOCATION` hoặc `GUIDE`. |

---

### 12. Bảng 4.23: Collection `guide_schedules` – Lịch rảnh Hướng dẫn viên
Quản lý lịch bận và khung giờ rảnh để tránh việc bị trùng lặp lịch đặt tour.

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Ràng buộc / Diễn giải |
| :--- | :--- | :---: | :---: | :--- |
| `_id` | ObjectId | Có | Auto | Khóa chính. |
| `guideId` | ObjectId | Có | - | FK tham chiếu `guide_profiles._id`. |
| `date` | Date | Có | - | Ngày đăng ký lịch. |
| `timeSlots` | Array[Object]| Có | [] | Mảng khung giờ `{ startTime: "08:00", endTime: "12:00", isAvailable: true }`. |

---

# PHẦN II: MA TRẬN 36 KỊCH BẢN KIỂM THỬ PLAYWRIGHT E2E TOÀN DIỆN
*(Bổ sung cho Mục 5.7 của Đồ án – Chứng minh tính toàn vẹn và độ tin cậy của mã nguồn)*

### 1. Phân hệ 1: Xác thực & Phiên làm việc (`01-auth.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Kiểm tra hiển thị Form đăng nhập | UI/Layout | Truy cập `/login`, kiểm tra Logo, Email, Password, Nút đăng nhập | Giao diện chuẩn Ant Design, các trường sẵn sàng nhập | **PASS** |
| **TC-AUTH-02** | Validate để trống dữ liệu | Form Rule | Bấm Đăng nhập khi không nhập email/mật khẩu | Xuất hiện cảnh báo đỏ yêu cầu nhập đầy đủ | **PASS** |
| **TC-AUTH-03** | Đăng nhập với mật khẩu không đúng | Security | Nhập `admin@localmate.com` + sai password | Backend trả về 401, hiện thông báo lỗi | **PASS** |
| **TC-AUTH-04** | Đăng nhập thành công với quyền Admin | Happy Path | Nhập tài khoản chuẩn `admin@localmate.com` / `admin123` | Nhận JWT, lưu LocalStorage, chuyển hướng về Dashboard | **PASS** |
| **TC-AUTH-05** | Ngăn chặn truy cập khi chưa đăng nhập | Route Guard| Truy cập trực tiếp URL `/dashboard` hoặc `/reports` | Bị chặn bởi Protected Route, tự động redirect về `/login` | **PASS** |
| **TC-AUTH-06** | Đăng xuất và hủy phiên làm việc | Session | Bấm nút Đăng xuất trên thanh Header | Xóa sạch Access Token, quay trở lại màn hình đăng nhập | **PASS** |

### 2. Phân hệ 2: Bảng điều khiển & Thống kê (`02-dashboard.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-DASH-01** | Hiển thị 4 thẻ KPI tổng quan | Dashboard | Truy cập trang Dashboard | Hiển thị Người dùng, HDV, Đơn đặt, Doanh thu | **PASS** |
| **TC-DASH-02** | Tải biểu đồ doanh thu Recharts | Visualization | Kiểm tra render SVG của biểu đồ doanh thu theo tháng | Biểu đồ trực quan hóa dữ liệu mượt mà, không lỗi console | **PASS** |
| **TC-DASH-03** | Hiển thị bảng đơn đặt tour gần đây | Data Table | Kiểm tra bảng đơn mới phát sinh | Hiển thị mã đơn, tên du khách, tên HDV, trạng thái | **PASS** |
| **TC-DASH-04** | Phân trang bảng danh sách đơn | Pagination | Bấm chuyển sang trang 2 | Tải trang dữ liệu kế tiếp chính xác | **PASS** |
| **TC-DASH-05** | Điều hướng nhanh từ Dashboard | Navigation | Bấm vào thẻ "Hồ sơ chờ duyệt" | Chuyển hướng chính xác sang trang Quản lý duyệt HDV | **PASS** |

### 3. Phân hệ 3: Hệ thống xét duyệt Hướng dẫn viên (`03-guide-approval.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-APPR-01** | Xem danh sách hồ sơ HDV đang chờ duyệt| Query | Mở trang `/guides` tab Chờ duyệt | Hiển thị danh sách hồ sơ với trạng thái `PENDING` | **PASS** |
| **TC-APPR-02** | Xem chi tiết CCCD và Thẻ hướng dẫn viên| Media View | Bấm nút "Xem hồ sơ" | Mở modal hiển thị ảnh CCCD 2 mặt và chứng chỉ từ CDN | **PASS** |
| **TC-APPR-03** | Phê duyệt hồ sơ hướng dẫn viên thành công| Workflow | Bấm nút xanh "Phê duyệt" | Trạng thái chuyển thành `APPROVED`, gửi thông báo cho HDV| **PASS** |
| **TC-APPR-04** | Từ chối hồ sơ kèm lý do cụ thể | Workflow | Bấm nút đỏ "Từ chối", nhập "Ảnh CCCD bị mờ" | Cập nhật `rejectionReason`, chuyển trạng thái `REJECTED` | **PASS** |
| **TC-APPR-05** | Lọc hồ sơ theo thành phố hoạt động | Filter | Chọn bộ lọc thành phố "Hà Nội" | Bảng chỉ hiển thị danh sách các ứng viên tại Hà Nội | **PASS** |

### 4. Phân hệ 4: Quản lý Người dùng (`04-users.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-USER-01** | Hiển thị danh sách toàn bộ người dùng | Read Data | Mở trang `/users` | Hiển thị bảng người dùng đủ cột: Email, Tên, Vai trò, Trạng thái | **PASS** |
| **TC-USER-02** | Tìm kiếm người dùng theo Email/Tên | Search | Gõ từ khóa "Sarah" vào ô tìm kiếm | Bảng lọc tức thời các dòng có tên Sarah Jenkins | **PASS** |
| **TC-USER-03** | Khóa tài khoản người dùng vi phạm | Admin Action| Bấm "Khóa tài khoản" đối với 1 user | Cờ `isBlocked = true`, user lập tức bị từ chối API tiếp theo | **PASS** |
| **TC-USER-04** | Mở khóa tài khoản người dùng | Admin Action| Bấm "Mở khóa" trên user đang bị khóa | Cờ `isBlocked = false`, khôi phục quyền truy cập bình thường | **PASS** |

### 5. Phân hệ 5: Quản lý Đơn đặt tour (`05-bookings.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-BOOK-01** | Lọc đơn tour theo trạng thái | Filter | Lọc theo tab `CONFIRMED` | Chỉ hiển thị các đơn tour đã được xác nhận thanh toán | **PASS** |
| **TC-BOOK-02** | Xem chi tiết giá và phí sàn LocalMate| Billing | Bấm xem chi tiết một đơn tour | Hiển thị tách biệt: Giá thuần HDV, Phí sàn 15%, Tổng tiền | **PASS** |
| **TC-BOOK-03** | Kiểm tra thông tin điểm đến và thời gian | Detail | Mở popup chi tiết | Hiển thị đầy đủ địa điểm đón, thời gian bắt đầu/kết thúc | **PASS** |

### 6. Phân hệ 6: Quản lý Địa điểm du lịch (`06-locations.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-LOC-01** | Hiển thị danh sách địa danh du lịch | Read Data | Mở trang `/locations` | Hiển thị ảnh đại diện, tên, thành phố, danh mục | **PASS** |
| **TC-LOC-02** | Thêm mới địa điểm du lịch kèm tọa độ GPS| Create | Nhập tên, địa chỉ, kinh độ, vĩ độ, upload ảnh | Lưu thành công vào CSDL với chỉ mục 2dsphere | **PASS** |
| **TC-LOC-03** | Cập nhật thông tin địa điểm du lịch | Update | Sửa mô tả và mức giá của địa điểm | Dữ liệu cập nhật ngay lập tức trên bảng quản trị | **PASS** |
| **TC-LOC-04** | Xóa / Ngừng kích hoạt địa điểm | Delete | Bấm nút Xóa địa điểm | Cập nhật `isActive = false`, ẩn khỏi danh sách gợi ý | **PASS** |
| **TC-LOC-05** | Validate tọa độ địa lý không hợp lệ | Validation | Nhập vĩ độ > 90 hoặc kinh độ > 180 | Báo lỗi form không cho phép lưu tọa độ sai | **PASS** |

### 7. Phân hệ 7: Báo cáo Tài chính & Rút tiền (`07-reports.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-REP-01** | Hiển thị tổng quan dòng tiền ký quỹ | Financial | Truy cập trang `/reports` | Hiển thị Doanh thu Escrow, Phí sàn, Tiền đã giải ngân HDV | **PASS** |
| **TC-REP-02** | Xem danh sách yêu cầu rút tiền của HDV | Payout | Kiểm tra bảng lệnh rút tiền | Hiển thị ngân hàng, số tài khoản, số tiền yêu cầu | **PASS** |
| **TC-REP-03** | Phê duyệt chuyển khoản rút tiền | Workflow | Bấm "Duyệt chuyển tiền" cho HDV | Trạng thái lệnh chuyển thành `TRANSFERRED`, trừ ví thành công | **PASS** |
| **TC-REP-04** | Từ chối yêu cầu rút tiền | Workflow | Bấm "Từ chối" kèm lý do sai số tài khoản | Trạng thái chuyển `REJECTED`, hoàn trả tiền về ví HDV | **PASS** |
| **TC-REP-05** | Xuất báo cáo doanh thu ra file CSV | Export | Bấm nút "Xuất file CSV báo cáo" | Trình duyệt tự động tải xuống file `localmate-financial.csv`| **PASS** |

### 8. Phân hệ 8: Kiểm thử API Backend REST Endpoints (`08-api-backend.spec.ts`)
| Mã kịch bản | Tên kịch bản kiểm thử | Phân loại | Các bước kiểm thử chính | Kết quả mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-API-01** | Endpoint kiểm tra sức khỏe hệ thống | Health Check| Gọi `GET /health` | Trả về mã HTTP 200 `{ status: "ok", uptime: ... }` | **PASS** |
| **TC-API-02** | Endpoint tài liệu Swagger API Docs | Docs | Gọi `GET /api-docs` | Tải giao diện Swagger UI với đầy đủ tài liệu API v1 | **PASS** |
| **TC-API-03** | Cơ chế chặn Rate-Limiting khi Spam | Security | Gửi liên tục 120 requests trong 1 phút | Backend trả về mã HTTP 429 "Too Many Requests" | **PASS** |

---

# PHẦN III: HƯỚNG DẪN BẢO VỆ ĐỒ ÁN TRƯỚC HỘI ĐỒNG (TỐI ƯU ĐIỂM SỐ)

Khi đứng trước Hội đồng chấm Đồ án tốt nghiệp (đặc biệt có Thầy Trương Xuân Nam và các giảng viên Khoa CNTT), bạn hãy tự tin nhấn mạnh vào **4 giá trị cốt lõi mang tính thực chiến cao** mà các đồ án khác ít có:

1. **Cơ chế Ký quỹ Escrow giải quyết triệt để vấn đề niềm tin du lịch**:
   - Khách thanh toán qua Stripe, tiền KHÔNG chuyển ngay cho HDV mà được giữ ở trạng thái `HELD`.
   - Chỉ khi tour chuyển sang `COMPLETED` và qua thời gian bảo lưu (Escrow Release Cron Job sau 48h), tiền mới giải ngân vào Ví HDV (`RELEASED`).
   - Chính sách hoàn tiền minh bạch theo khung giờ hủy (`>24h`: 100%, `12-24h`: 50%, `<12h`: 0%).
2. **Hệ thống AI gợi ý hành trình thông minh với Claude 3 Haiku**:
   - Không dùng AI chung chung, Backend truy vấn 50 địa điểm thực tế từ MongoDB với tọa độ 2dsphere, đưa vào prompt có cấu trúc chặt chẽ để Claude sinh lịch trình chuẩn JSON kèm ước tính ngân sách.
   - Có cơ chế Fallback tự động khi mất kết nối API để ứng dụng không bao giờ bị lỗi màn hình trắng.
3. **Kiến trúc đồng bộ thời gian thực Realtime với Socket.IO & Cron Jobs**:
   - Room chat chia theo từng đơn tour `booking:{id}` với xác thực JWT Handshake.
   - Cron Job tự động hủy đơn sau 30 phút nếu HDV không nhận và tự động hoàn tiền 100% cho du khách.
4. **Quy trình kiểm thử tự động hóa chuyên nghiệp với Playwright E2E**:
   - Đạt chuẩn kiểm thử kỹ thuật phần mềm hiện đại với 36 kịch bản tự động hóa trên trình duyệt thực tế, tỷ lệ Pass 100%.
