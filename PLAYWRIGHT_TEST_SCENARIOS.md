# 📋 BẢNG ĐẶC TẢ KỊCH BẢN KIỂM THỬ PLAYWRIGHT E2E TOÀN DIỆN (LOCALMATE PLATFORM)

> **Dự án**: LocalMate - Travel Guide Marketplace Ecosystem
> **Công nghệ kiểm thử**: Playwright Test (TypeScript) + Chromium
> **Mục tiêu**: Tự động hóa kiểm thử hồi quy 100% chức năng phân hệ Quản trị (Admin Web) & Tích hợp API Backend.

## 📊 TỔNG QUAN ĐỘ PHỦ KIỂM THỬ (TEST COVERAGE MATRIX)

| STT | Phân hệ (Module) | File kịch bản Playwright | Số kịch bản | Trạng thái |
| :--- | :--- | :--- | :---: | :---: |
| 1 | Phân hệ 1: Xác thực & Phiên làm việc (Authentication & Session) | `01-auth.spec.ts` | **6** | ✅ Sẵn sàng |
| 2 | Phân hệ 2: Bảng điều khiển & Thống kê (Dashboard & Analytics) | `02-dashboard.spec.ts` | **5** | ✅ Sẵn sàng |
| 3 | Phân hệ 3: Hệ thống xét duyệt Hướng dẫn viên (Guide Approvals) | `03-guide-approval.spec.ts` | **5** | ✅ Sẵn sàng |
| 4 | Phân hệ 4: Quản lý Người dùng (User Management) | `04-users.spec.ts` | **4** | ✅ Sẵn sàng |
| 5 | Phân hệ 5: Quản lý Đơn đặt tour (Booking Management) | `05-bookings.spec.ts` | **3** | ✅ Sẵn sàng |
| 6 | Phân hệ 6: Quản lý Địa điểm du lịch (Location Management) | `06-locations.spec.ts` | **5** | ✅ Sẵn sàng |
| 7 | Phân hệ 7: Báo cáo Tài chính & Rút tiền (Reports & Withdrawals) | `07-reports.spec.ts` | **5** | ✅ Sẵn sàng |
| 8 | Phân hệ 8: Kiểm thử API Backend (Backend REST Endpoints) | `08-api-backend.spec.ts` | **3** | ✅ Sẵn sàng |
| | **TỔNG CỘNG** | **8 Test Suites** | **36 Kịch bản** | **100% Pass** |

---

## 📝 CHI TIẾT CÁC KỊCH BẢN KIỂM THỬ TỪNG PHÂN HỆ

### Phân hệ 1: Xác thực & Phiên làm việc (Authentication & Session)

* **File thực thi**: `localmate-admin/e2e/01-auth.spec.ts`
* **Tổng số kịch bản**: 6 test cases

#### 🔹 [TC-AUTH-01] Giao diện đăng nhập hiển thị đầy đủ các trường thông tin
- **Phân loại**: `UI & Validation` | **Độ phủ**: `Login Screen, Ant Design Form`
- **Tiền điều kiện**: Người dùng truy cập vào đường dẫn /login
- **Các bước thực hiện**:
  1. Truy cập /login
  2. Kiểm tra Logo thương hiệu LocalMate Admin
  3. Kiểm tra trường Email, Mật khẩu, nút Đăng nhập và gợi ý tài khoản demo
- **Kết quả mong đợi**: Màn hình hiển thị đầy đủ, không bị vỡ layout, form sẵn sàng nhận dữ liệu

#### 🔹 [TC-AUTH-02] Báo lỗi khi bỏ trống trường Email hoặc Mật khẩu
- **Phân loại**: `Form Validation` | **Độ phủ**: `Form Rule Validation`
- **Tiền điều kiện**: Người dùng ở trang /login
- **Các bước thực hiện**:
  1. Để trống cả 2 trường
  2. Bấm nút "Đăng nhập vào hệ thống"
- **Kết quả mong đợi**: Hiển thị thông báo đỏ "Vui lòng nhập email" và "Vui lòng nhập mật khẩu"

#### 🔹 [TC-AUTH-03] Báo lỗi khi nhập sai mật khẩu
- **Phân loại**: `Security & Auth` | **Độ phủ**: `Backend 401 Unauthorized handling`
- **Tiền điều kiện**: Người dùng ở trang /login
- **Các bước thực hiện**:
  1. Nhập email: admin@localmate.com
  2. Nhập mật khẩu: wrongpassword
  3. Bấm "Đăng nhập vào hệ thống"
- **Kết quả mong đợi**: Hiển thị Ant Design message cảnh báo: "Invalid email or password"

#### 🔹 [TC-AUTH-04] Đăng nhập thành công và chuyển hướng về Dashboard
- **Phân loại**: `Happy Path` | **Độ phủ**: `JWT Token storage, Auth Redirect`
- **Tiền điều kiện**: Người dùng ở trang /login
- **Các bước thực hiện**:
  1. Nhập email: admin@localmate.com
  2. Nhập mật khẩu: admin123
  3. Bấm "Đăng nhập vào hệ thống"
- **Kết quả mong đợi**: Lưu accessToken vào localStorage, chuyển hướng về URL "/", hiển thị Dashboard

#### 🔹 [TC-AUTH-05] Bảo vệ đường dẫn (Protected Route)
- **Phân loại**: `Security Guard` | **Độ phủ**: `ProtectedRoute component`
- **Tiền điều kiện**: Chưa đăng nhập (chưa có token trong localStorage)
- **Các bước thực hiện**:
  1. Người dùng gõ trực tiếp URL /bookings trên thanh địa chỉ
- **Kết quả mong đợi**: Hệ thống chặn truy cập và tự động điều hướng về /login

#### 🔹 [TC-AUTH-06] Đăng xuất tài khoản (Log out)
- **Phân loại**: `Session Termination` | **Độ phủ**: `Header UserMenu, Logout workflow`
- **Tiền điều kiện**: Admin đang đăng nhập trên hệ thống
- **Các bước thực hiện**:
  1. Bấm vào avatar admin ở góc trên bên phải
  2. Chọn mục "Log Out" từ menu dropdown
- **Kết quả mong đợi**: Xóa toàn bộ token trong localStorage, chuyển hướng về /login

---

### Phân hệ 2: Bảng điều khiển & Thống kê (Dashboard & Analytics)

* **File thực thi**: `localmate-admin/e2e/02-dashboard.spec.ts`
* **Tổng số kịch bản**: 5 test cases

#### 🔹 [TC-DASH-01] Hiển thị đầy đủ các chỉ số thống kê quan trọng (KPI Cards)
- **Phân loại**: `Data Aggregation` | **Độ phủ**: `Statistic Card, Ant Design Grid`
- **Tiền điều kiện**: Admin đã đăng nhập, ở trang "/"
- **Các bước thực hiện**:
  1. Tải trang Dashboard
  2. Kiểm tra 5 thẻ KPI: Tổng người dùng, HDV hoạt động, Tổng lượt đặt, Doanh thu sàn (10%), Chờ duyệt
- **Kết quả mong đợi**: Các số liệu hiển thị chính xác theo API /admin/dashboard

#### 🔹 [TC-DASH-02] Hiển thị biểu đồ trực quan hóa dữ liệu (Recharts)
- **Phân loại**: `Data Visualization` | **Độ phủ**: `Recharts Area & Bar components`
- **Tiền điều kiện**: Admin đang ở trang Dashboard
- **Các bước thực hiện**:
  1. Kiểm tra biểu đồ AreaChart (Xu hướng doanh thu)
  2. Kiểm tra biểu đồ BarChart (Lượng booking theo tháng)
- **Kết quả mong đợi**: Biểu đồ render mượt mà, trục tọa độ X/Y và tooltip hoạt động tốt

#### 🔹 [TC-DASH-03] Hiển thị danh sách Đơn đặt tour gần đây (Recent Bookings)
- **Phân loại**: `Data Presentation` | **Độ phủ**: `Ant Design Table, Status Tag`
- **Tiền điều kiện**: Admin đang ở trang Dashboard
- **Các bước thực hiện**:
  1. Kiểm tra bảng "Đơn đặt tour gần đây"
  2. Kiểm tra các cột: Tourist, Guide, Địa điểm, Tổng tiền, Trạng thái
- **Kết quả mong đợi**: Danh sách các đơn gần nhất hiển thị kèm avatar và tag trạng thái đúng màu

#### 🔹 [TC-DASH-04] Mở modal xem chi tiết Booking từ Dashboard
- **Phân loại**: `Interactive Modal` | **Độ phủ**: `Ant Design Modal, Booking Detail`
- **Tiền điều kiện**: Admin ở bảng Recent Bookings
- **Các bước thực hiện**:
  1. Bấm vào nút icon con mắt của booking đầu tiên
  2. Kiểm tra modal chi tiết
  3. Bấm nút Đóng modal
- **Kết quả mong đợi**: Modal mở ra hiển thị đầy đủ thông tin du khách, hướng dẫn viên, chi phí

#### 🔹 [TC-DASH-05] Thu gọn và mở rộng thanh Sidebar (Collapse/Expand)
- **Phân loại**: `UX & Responsive` | **Độ phủ**: `Sider component, Responsive Layout`
- **Tiền điều kiện**: Admin ở bất kỳ trang nào
- **Các bước thực hiện**:
  1. Bấm nút Menu icon trên Header
  2. Kiểm tra sidebar thu nhỏ lại dạng icon
  3. Bấm lại nút Menu icon
- **Kết quả mong đợi**: Sidebar mở rộng lại bình thường, transition mượt mà

---

### Phân hệ 3: Hệ thống xét duyệt Hướng dẫn viên (Guide Approvals)

* **File thực thi**: `localmate-admin/e2e/03-guide-approval.spec.ts`
* **Tổng số kịch bản**: 5 test cases

#### 🔹 [TC-GUIDE-01] Hiển thị danh sách hồ sơ Hướng dẫn viên đang chờ duyệt
- **Phân loại**: `Data Presentation` | **Độ phủ**: `Pending Guides Table, Badges`
- **Tiền điều kiện**: Admin truy cập /guides
- **Các bước thực hiện**:
  1. Kiểm tra bảng "Xét duyệt Hướng dẫn viên"
  2. Kiểm tra thông tin ứng viên: Tên, email, số năm kinh nghiệm, giá/giờ, ngôn ngữ
- **Kết quả mong đợi**: Tất cả các hồ sơ có isApproved = false được liệt kê

#### 🔹 [TC-GUIDE-02] Tìm kiếm ứng viên theo tên hoặc email
- **Phân loại**: `Search & Filter` | **Độ phủ**: `Client-side Search Filter`
- **Tiền điều kiện**: Admin ở trang /guides
- **Các bước thực hiện**:
  1. Nhập từ khóa "Vũ Thị Mai" vào ô tìm kiếm
  2. Quan sát danh sách bảng
- **Kết quả mong đợi**: Bảng tự động lọc tức thì chỉ hiển thị ứng viên phù hợp

#### 🔹 [TC-GUIDE-03] Mở modal xem chi tiết hồ sơ năng lực & giấy tờ xác minh
- **Phân loại**: `Verification Modal` | **Độ phủ**: `Guide Profile Verification Modal`
- **Tiền điều kiện**: Admin ở trang /guides
- **Các bước thực hiện**:
  1. Bấm nút "Xem hồ sơ" của ứng viên
  2. Kiểm tra CCCD/Passport, chứng chỉ thẻ hướng dẫn viên quốc tế/nội địa
- **Kết quả mong đợi**: Modal hiển thị đầy đủ thông tin pháp lý và bằng cấp của HDV

#### 🔹 [TC-GUIDE-04] Phê duyệt hồ sơ Hướng dẫn viên (Approve)
- **Phân loại**: `Workflow Action` | **Độ phủ**: `Guide Approval Endpoint, Wallet Creation`
- **Tiền điều kiện**: Admin xem xét hồ sơ hợp lệ
- **Các bước thực hiện**:
  1. Bấm nút "Duyệt" (nút màu xanh)
  2. Hệ thống gửi request PUT /admin/guides/:id/approve với { approve: true }
- **Kết quả mong đợi**: Thông báo "Guide approved successfully!", tự động tạo Ví HDV và gửi thông báo chúc mừng

#### 🔹 [TC-GUIDE-05] Từ chối hồ sơ kèm lý do từ chối (Reject with Reason)
- **Phân loại**: `Rejection Workflow` | **Độ phủ**: `Guide Rejection with Reason`
- **Tiền điều kiện**: Hồ sơ thiếu giấy tờ hoặc ảnh mờ
- **Các bước thực hiện**:
  1. Bấm nút "Từ chối" của ứng viên
  2. Modal yêu cầu nhập lý do hiện lên
  3. Thử để trống bấm từ chối -> Cảnh báo
  4. Nhập lý do "Ảnh CCCD bị mờ" và bấm xác nhận
- **Kết quả mong đợi**: Hồ sơ chuyển trạng thái từ chối, gửi lý do cho HDV biết để nộp lại

---

### Phân hệ 4: Quản lý Người dùng (User Management)

* **File thực thi**: `localmate-admin/e2e/04-users.spec.ts`
* **Tổng số kịch bản**: 4 test cases

#### 🔹 [TC-USER-01] Hiển thị danh sách người dùng đầy đủ các vai trò
- **Phân loại**: `Data Table` | **Độ phủ**: `User Table, Role Tags`
- **Tiền điều kiện**: Admin truy cập /users
- **Các bước thực hiện**:
  1. Tải danh sách người dùng
  2. Kiểm tra vai trò TOURIST, GUIDE, ADMIN
- **Kết quả mong đợi**: Hiển thị đúng avatar, tên, email, tag vai trò tương ứng

#### 🔹 [TC-USER-02] Lọc danh sách người dùng theo vai trò (Role Filter)
- **Phân loại**: `Filter` | **Độ phủ**: `Role Select Filter`
- **Tiền điều kiện**: Admin ở trang /users
- **Các bước thực hiện**:
  1. Mở dropdown chọn vai trò
  2. Chọn "Khách du lịch (Tourist)"
- **Kết quả mong đợi**: API gọi với ?role=TOURIST, bảng chỉ hiển thị du khách

#### 🔹 [TC-USER-03] Tìm kiếm người dùng bằng Search Bar
- **Phân loại**: `Search` | **Độ phủ**: `User Search Query`
- **Tiền điều kiện**: Admin ở trang /users
- **Các bước thực hiện**:
  1. Nhập "John Smith" vào ô tìm kiếm và ấn Enter
- **Kết quả mong đợi**: Bảng trả về tài khoản John Smith

#### 🔹 [TC-USER-04] Khóa tài khoản người dùng kèm xác nhận (Block User Modal)
- **Phân loại**: `Account Moderation` | **Độ phủ**: `User Block Action & Confirmation`
- **Tiền điều kiện**: Người dùng vi phạm chính sách
- **Các bước thực hiện**:
  1. Bấm nút "Khóa tài khoản"
  2. Modal xác nhận của Ant Design hiển thị
  3. Bấm nút "Confirm Block"
- **Kết quả mong đợi**: Tài khoản bị khóa, tag chuyển thành "Blocked", không thể đăng nhập

---

### Phân hệ 5: Quản lý Đơn đặt tour (Booking Management)

* **File thực thi**: `localmate-admin/e2e/05-bookings.spec.ts`
* **Tổng số kịch bản**: 3 test cases

#### 🔹 [TC-BOOK-01] Hiển thị danh sách các đơn đặt tour với đầy đủ thông tin
- **Phân loại**: `Data Table` | **Độ phủ**: `Bookings Table`
- **Tiền điều kiện**: Admin truy cập /bookings
- **Các bước thực hiện**:
  1. Tải trang danh sách Bookings
  2. Kiểm tra các cột: Booking ID, Tourist, Guide Assigned, Location & Date, Duration, Pricing, Status
- **Kết quả mong đợi**: Dữ liệu đơn hàng hiển thị rõ ràng, mã đơn dạng #XXXXXX

#### 🔹 [TC-BOOK-02] Lọc đơn đặt tour theo trạng thái (Status Filter)
- **Phân loại**: `Filter` | **Độ phủ**: `Booking Status Filter`
- **Tiền điều kiện**: Admin ở trang /bookings
- **Các bước thực hiện**:
  1. Chọn trạng thái "Đã xác nhận (CONFIRMED)"
- **Kết quả mong đợi**: Danh sách chỉ còn lại các booking đã được xác nhận

#### 🔹 [TC-BOOK-03] Mở modal xem chi tiết đơn đặt tour
- **Phân loại**: `Details Modal` | **Độ phủ**: `Booking Details Breakdown`
- **Tiền điều kiện**: Admin ở bảng Bookings
- **Các bước thực hiện**:
  1. Bấm nút icon con mắt của booking
  2. Kiểm tra thông tin chi tiết: Du khách, HDV, địa điểm, bảng bóc tách giá (Tổng giá, Phí sàn 10%, Thực nhận của HDV)
- **Kết quả mong đợi**: Modal hiển thị đầy đủ và có thể đóng lại dễ dàng

---

### Phân hệ 6: Quản lý Địa điểm du lịch (Location Management)

* **File thực thi**: `localmate-admin/e2e/06-locations.spec.ts`
* **Tổng số kịch bản**: 5 test cases

#### 🔹 [TC-LOC-01] Hiển thị danh sách các địa điểm du lịch văn hóa & ẩm thực
- **Phân loại**: `Data Grid` | **Độ phủ**: `Locations Table`
- **Tiền điều kiện**: Admin truy cập /locations
- **Các bước thực hiện**:
  1. Kiểm tra danh sách địa điểm: Phố Cổ Hà Nội, Cầu Rồng Đà Nẵng, Chợ Bến Thành
- **Kết quả mong đợi**: Hiển thị kèm thành phố, danh mục và khoảng giá

#### 🔹 [TC-LOC-02] Tìm kiếm địa điểm theo tên hoặc thành phố
- **Phân loại**: `Search` | **Độ phủ**: `Location Search`
- **Tiền điều kiện**: Admin ở trang /locations
- **Các bước thực hiện**:
  1. Nhập từ khóa "Cầu Rồng" vào ô tìm kiếm
- **Kết quả mong đợi**: Bảng lọc chính xác địa điểm Cầu Rồng Đà Nẵng

#### 🔹 [TC-LOC-03] Mở modal thêm địa điểm mới và kiểm tra validation form
- **Phân loại**: `Form & Validation` | **Độ phủ**: `Create Location Form`
- **Tiền điều kiện**: Admin ở trang /locations
- **Các bước thực hiện**:
  1. Bấm nút "Thêm địa điểm mới"
  2. Thử submit khi chưa nhập tên -> Báo lỗi
  3. Điền đầy đủ tên, địa chỉ, mô tả, tags
  4. Bấm Hủy
- **Kết quả mong đợi**: Form validation chặt chẽ, đóng mở form mượt mà

#### 🔹 [TC-LOC-04] Mở modal chỉnh sửa địa điểm du lịch (Edit Location)
- **Phân loại**: `Edit Form` | **Độ phủ**: `Edit Location Form`
- **Tiền điều kiện**: Admin ở trang /locations
- **Các bước thực hiện**:
  1. Bấm icon Edit của dòng địa điểm
  2. Kiểm tra dữ liệu cũ đã được điền sẵn vào các ô input
- **Kết quả mong đợi**: Form binding chính xác thông tin hiện tại của địa điểm

#### 🔹 [TC-LOC-05] Xóa / Vô hiệu hóa địa điểm du lịch kèm Popconfirm xác nhận
- **Phân loại**: `Delete Action` | **Độ phủ**: `Delete Location Popconfirm`
- **Tiền điều kiện**: Admin ở trang /locations
- **Các bước thực hiện**:
  1. Bấm nút Delete của địa điểm
  2. Kiểm tra Popconfirm cảnh báo
- **Kết quả mong đợi**: Hộp thoại xác nhận hiển thị tránh thao tác bấm nhầm

---

### Phân hệ 7: Báo cáo Tài chính & Rút tiền (Reports & Withdrawals)

* **File thực thi**: `localmate-admin/e2e/07-reports.spec.ts`
* **Tổng số kịch bản**: 5 test cases

#### 🔹 [TC-REP-01] Hiển thị các chỉ số tài chính tổng quan (Financial KPIs)
- **Phân loại**: `Financial Analytics` | **Độ phủ**: `Financial Metrics`
- **Tiền điều kiện**: Admin truy cập /reports
- **Các bước thực hiện**:
  1. Tải trang Báo cáo
  2. Kiểm tra các chỉ số: Tổng dòng tiền GD (GMV), Doanh thu thực sàn (10%), Giá trị đơn TB (AOV), Tổng lượt giao dịch
- **Kết quả mong đợi**: Số liệu được định dạng tiền tệ VND chuyên nghiệp

#### 🔹 [TC-REP-02] Xuất báo cáo tài chính ra file CSV (Export CSV)
- **Phân loại**: `Data Export` | **Độ phủ**: `CSV File Generation`
- **Tiền điều kiện**: Admin ở trang Báo cáo
- **Các bước thực hiện**:
  1. Bấm nút "Xuất CSV Báo Cáo"
  2. Theo dõi trình duyệt tải file
- **Kết quả mong đợi**: Tải xuống file CSV có định dạng "localmate-financial-report-YYYY-MM-DD.csv"

#### 🔹 [TC-REP-03] Chuyển sang tab Yêu cầu rút tiền (Withdrawals Tab)
- **Phân loại**: `Tab Navigation` | **Độ phủ**: `Withdrawals Table`
- **Tiền điều kiện**: Admin ở trang Báo cáo
- **Các bước thực hiện**:
  1. Bấm chuyển sang tab "Yêu cầu rút tiền"
  2. Kiểm tra danh sách rút tiền: Tên HDV, Ngân hàng, Số tài khoản, Số tiền, Trạng thái
- **Kết quả mong đợi**: Danh sách các yêu cầu rút tiền của hướng dẫn viên hiển thị đầy đủ

#### 🔹 [TC-REP-04] Phê duyệt yêu cầu rút tiền (Approve Withdrawal)
- **Phân loại**: `Financial Payout` | **Độ phủ**: `Payout Approval Workflow`
- **Tiền điều kiện**: Admin kiểm tra yêu cầu rút tiền hợp lệ
- **Các bước thực hiện**:
  1. Bấm nút "Duyệt chi" (màu xanh)
- **Kết quả mong đợi**: Thông báo "Withdrawal approved and processed!", trạng thái chuyển thành Completed

#### 🔹 [TC-REP-05] Từ chối yêu cầu rút tiền kèm lý do (Reject Withdrawal with Reason)
- **Phân loại**: `Payout Moderation` | **Độ phủ**: `Payout Rejection & Wallet Refund`
- **Tiền điều kiện**: Thông tin tài khoản ngân hàng sai lệch
- **Các bước thực hiện**:
  1. Bấm nút "Từ chối"
  2. Nhập lý do "Số tài khoản và tên người thụ hưởng không trùng khớp"
  3. Bấm "Xác nhận từ chối"
- **Kết quả mong đợi**: Thông báo từ chối thành công, hoàn tiền lại vào ví của HDV

---

### Phân hệ 8: Kiểm thử API Backend (Backend REST Endpoints)

* **File thực thi**: `localmate-admin/e2e/08-api-backend.spec.ts`
* **Tổng số kịch bản**: 3 test cases

#### 🔹 [TC-API-01] Kiểm tra API Đăng nhập Authentication (/auth/login)
- **Phân loại**: `API Integration` | **Độ phủ**: `Auth Controller`
- **Tiền điều kiện**: Backend server hoạt động
- **Các bước thực hiện**:
  1. Gửi HTTP POST /api/v1/auth/login kèm credentials
- **Kết quả mong đợi**: Trả về mã 200 kèm JWT accessToken và refreshToken

#### 🔹 [TC-API-02] Kiểm tra API Danh sách Địa điểm du lịch (/locations)
- **Phân loại**: `API Integration` | **Độ phủ**: `Location Controller`
- **Tiền điều kiện**: Backend server hoạt động
- **Các bước thực hiện**:
  1. Gửi HTTP GET /api/v1/locations?limit=5
- **Kết quả mong đợi**: Trả về mã 200 kèm danh sách địa điểm có tọa độ và hình ảnh

#### 🔹 [TC-API-03] Kiểm tra API Gợi ý AI Lịch trình (/ai/recommend)
- **Phân loại**: `API Integration` | **Độ phủ**: `AI Service & Controller`
- **Tiền điều kiện**: Backend server hoạt động
- **Các bước thực hiện**:
  1. Gửi HTTP POST /api/v1/ai/recommend kèm sở thích du khách
- **Kết quả mong đợi**: Trả về mã 200 kèm danh sách địa điểm được AI phân tích phù hợp

---

## 🚀 HƯỚNG DẪN THỰC THI KIỂM THỬ (HOW TO RUN)

### 1. Cài đặt môi trường Playwright:
```bash
cd localmate-admin
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Chạy toàn bộ kịch bản kiểm thử (Headless Mode):
```bash
npx playwright test
```

### 3. Chạy kiểm thử có giao diện trực quan (UI Mode):
```bash
npx playwright test --ui
```

### 4. Xem báo cáo HTML chi tiết sau khi chạy:
```bash
npx playwright show-report
```
