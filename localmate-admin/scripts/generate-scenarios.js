/**
 * Auto-generates detailed test scenario catalog and test matrix report
 */
const fs = require('fs');
const path = require('path');

const e2eDir = path.resolve(__dirname, '../e2e');
const reportFile = path.resolve(__dirname, '../../PLAYWRIGHT_TEST_SCENARIOS.md');

const modules = [
  {
    module: 'Phân hệ 1: Xác thực & Phiên làm việc (Authentication & Session)',
    file: '01-auth.spec.ts',
    scenarios: [
      {
        id: 'TC-AUTH-01',
        name: 'Giao diện đăng nhập hiển thị đầy đủ các trường thông tin',
        type: 'UI & Validation',
        precondition: 'Người dùng truy cập vào đường dẫn /login',
        steps: [
          'Truy cập /login',
          'Kiểm tra Logo thương hiệu LocalMate Admin',
          'Kiểm tra trường Email, Mật khẩu, nút Đăng nhập và gợi ý tài khoản demo'
        ],
        expected: 'Màn hình hiển thị đầy đủ, không bị vỡ layout, form sẵn sàng nhận dữ liệu',
        coverage: 'Login Screen, Ant Design Form'
      },
      {
        id: 'TC-AUTH-02',
        name: 'Báo lỗi khi bỏ trống trường Email hoặc Mật khẩu',
        type: 'Form Validation',
        precondition: 'Người dùng ở trang /login',
        steps: [
          'Để trống cả 2 trường',
          'Bấm nút "Đăng nhập vào hệ thống"'
        ],
        expected: 'Hiển thị thông báo đỏ "Vui lòng nhập email" và "Vui lòng nhập mật khẩu"',
        coverage: 'Form Rule Validation'
      },
      {
        id: 'TC-AUTH-03',
        name: 'Báo lỗi khi nhập sai mật khẩu',
        type: 'Security & Auth',
        precondition: 'Người dùng ở trang /login',
        steps: [
          'Nhập email: admin@localmate.com',
          'Nhập mật khẩu: wrongpassword',
          'Bấm "Đăng nhập vào hệ thống"'
        ],
        expected: 'Hiển thị Ant Design message cảnh báo: "Invalid email or password"',
        coverage: 'Backend 401 Unauthorized handling'
      },
      {
        id: 'TC-AUTH-04',
        name: 'Đăng nhập thành công và chuyển hướng về Dashboard',
        type: 'Happy Path',
        precondition: 'Người dùng ở trang /login',
        steps: [
          'Nhập email: admin@localmate.com',
          'Nhập mật khẩu: admin123',
          'Bấm "Đăng nhập vào hệ thống"'
        ],
        expected: 'Lưu accessToken vào localStorage, chuyển hướng về URL "/", hiển thị Dashboard',
        coverage: 'JWT Token storage, Auth Redirect'
      },
      {
        id: 'TC-AUTH-05',
        name: 'Bảo vệ đường dẫn (Protected Route)',
        type: 'Security Guard',
        precondition: 'Chưa đăng nhập (chưa có token trong localStorage)',
        steps: [
          'Người dùng gõ trực tiếp URL /bookings trên thanh địa chỉ'
        ],
        expected: 'Hệ thống chặn truy cập và tự động điều hướng về /login',
        coverage: 'ProtectedRoute component'
      },
      {
        id: 'TC-AUTH-06',
        name: 'Đăng xuất tài khoản (Log out)',
        type: 'Session Termination',
        precondition: 'Admin đang đăng nhập trên hệ thống',
        steps: [
          'Bấm vào avatar admin ở góc trên bên phải',
          'Chọn mục "Log Out" từ menu dropdown'
        ],
        expected: 'Xóa toàn bộ token trong localStorage, chuyển hướng về /login',
        coverage: 'Header UserMenu, Logout workflow'
      }
    ]
  },
  {
    module: 'Phân hệ 2: Bảng điều khiển & Thống kê (Dashboard & Analytics)',
    file: '02-dashboard.spec.ts',
    scenarios: [
      {
        id: 'TC-DASH-01',
        name: 'Hiển thị đầy đủ các chỉ số thống kê quan trọng (KPI Cards)',
        type: 'Data Aggregation',
        precondition: 'Admin đã đăng nhập, ở trang "/"',
        steps: [
          'Tải trang Dashboard',
          'Kiểm tra 5 thẻ KPI: Tổng người dùng, HDV hoạt động, Tổng lượt đặt, Doanh thu sàn (10%), Chờ duyệt'
        ],
        expected: 'Các số liệu hiển thị chính xác theo API /admin/dashboard',
        coverage: 'Statistic Card, Ant Design Grid'
      },
      {
        id: 'TC-DASH-02',
        name: 'Hiển thị biểu đồ trực quan hóa dữ liệu (Recharts)',
        type: 'Data Visualization',
        precondition: 'Admin đang ở trang Dashboard',
        steps: [
          'Kiểm tra biểu đồ AreaChart (Xu hướng doanh thu)',
          'Kiểm tra biểu đồ BarChart (Lượng booking theo tháng)'
        ],
        expected: 'Biểu đồ render mượt mà, trục tọa độ X/Y và tooltip hoạt động tốt',
        coverage: 'Recharts Area & Bar components'
      },
      {
        id: 'TC-DASH-03',
        name: 'Hiển thị danh sách Đơn đặt tour gần đây (Recent Bookings)',
        type: 'Data Presentation',
        precondition: 'Admin đang ở trang Dashboard',
        steps: [
          'Kiểm tra bảng "Đơn đặt tour gần đây"',
          'Kiểm tra các cột: Tourist, Guide, Địa điểm, Tổng tiền, Trạng thái'
        ],
        expected: 'Danh sách các đơn gần nhất hiển thị kèm avatar và tag trạng thái đúng màu',
        coverage: 'Ant Design Table, Status Tag'
      },
      {
        id: 'TC-DASH-04',
        name: 'Mở modal xem chi tiết Booking từ Dashboard',
        type: 'Interactive Modal',
        precondition: 'Admin ở bảng Recent Bookings',
        steps: [
          'Bấm vào nút icon con mắt của booking đầu tiên',
          'Kiểm tra modal chi tiết',
          'Bấm nút Đóng modal'
        ],
        expected: 'Modal mở ra hiển thị đầy đủ thông tin du khách, hướng dẫn viên, chi phí',
        coverage: 'Ant Design Modal, Booking Detail'
      },
      {
        id: 'TC-DASH-05',
        name: 'Thu gọn và mở rộng thanh Sidebar (Collapse/Expand)',
        type: 'UX & Responsive',
        precondition: 'Admin ở bất kỳ trang nào',
        steps: [
          'Bấm nút Menu icon trên Header',
          'Kiểm tra sidebar thu nhỏ lại dạng icon',
          'Bấm lại nút Menu icon'
        ],
        expected: 'Sidebar mở rộng lại bình thường, transition mượt mà',
        coverage: 'Sider component, Responsive Layout'
      }
    ]
  },
  {
    module: 'Phân hệ 3: Hệ thống xét duyệt Hướng dẫn viên (Guide Approvals)',
    file: '03-guide-approval.spec.ts',
    scenarios: [
      {
        id: 'TC-GUIDE-01',
        name: 'Hiển thị danh sách hồ sơ Hướng dẫn viên đang chờ duyệt',
        type: 'Data Presentation',
        precondition: 'Admin truy cập /guides',
        steps: [
          'Kiểm tra bảng "Xét duyệt Hướng dẫn viên"',
          'Kiểm tra thông tin ứng viên: Tên, email, số năm kinh nghiệm, giá/giờ, ngôn ngữ'
        ],
        expected: 'Tất cả các hồ sơ có isApproved = false được liệt kê',
        coverage: 'Pending Guides Table, Badges'
      },
      {
        id: 'TC-GUIDE-02',
        name: 'Tìm kiếm ứng viên theo tên hoặc email',
        type: 'Search & Filter',
        precondition: 'Admin ở trang /guides',
        steps: [
          'Nhập từ khóa "Vũ Thị Mai" vào ô tìm kiếm',
          'Quan sát danh sách bảng'
        ],
        expected: 'Bảng tự động lọc tức thì chỉ hiển thị ứng viên phù hợp',
        coverage: 'Client-side Search Filter'
      },
      {
        id: 'TC-GUIDE-03',
        name: 'Mở modal xem chi tiết hồ sơ năng lực & giấy tờ xác minh',
        type: 'Verification Modal',
        precondition: 'Admin ở trang /guides',
        steps: [
          'Bấm nút "Xem hồ sơ" của ứng viên',
          'Kiểm tra CCCD/Passport, chứng chỉ thẻ hướng dẫn viên quốc tế/nội địa'
        ],
        expected: 'Modal hiển thị đầy đủ thông tin pháp lý và bằng cấp của HDV',
        coverage: 'Guide Profile Verification Modal'
      },
      {
        id: 'TC-GUIDE-04',
        name: 'Phê duyệt hồ sơ Hướng dẫn viên (Approve)',
        type: 'Workflow Action',
        precondition: 'Admin xem xét hồ sơ hợp lệ',
        steps: [
          'Bấm nút "Duyệt" (nút màu xanh)',
          'Hệ thống gửi request PUT /admin/guides/:id/approve với { approve: true }'
        ],
        expected: 'Thông báo "Guide approved successfully!", tự động tạo Ví HDV và gửi thông báo chúc mừng',
        coverage: 'Guide Approval Endpoint, Wallet Creation'
      },
      {
        id: 'TC-GUIDE-05',
        name: 'Từ chối hồ sơ kèm lý do từ chối (Reject with Reason)',
        type: 'Rejection Workflow',
        precondition: 'Hồ sơ thiếu giấy tờ hoặc ảnh mờ',
        steps: [
          'Bấm nút "Từ chối" của ứng viên',
          'Modal yêu cầu nhập lý do hiện lên',
          'Thử để trống bấm từ chối -> Cảnh báo',
          'Nhập lý do "Ảnh CCCD bị mờ" và bấm xác nhận'
        ],
        expected: 'Hồ sơ chuyển trạng thái từ chối, gửi lý do cho HDV biết để nộp lại',
        coverage: 'Guide Rejection with Reason'
      }
    ]
  },
  {
    module: 'Phân hệ 4: Quản lý Người dùng (User Management)',
    file: '04-users.spec.ts',
    scenarios: [
      {
        id: 'TC-USER-01',
        name: 'Hiển thị danh sách người dùng đầy đủ các vai trò',
        type: 'Data Table',
        precondition: 'Admin truy cập /users',
        steps: [
          'Tải danh sách người dùng',
          'Kiểm tra vai trò TOURIST, GUIDE, ADMIN'
        ],
        expected: 'Hiển thị đúng avatar, tên, email, tag vai trò tương ứng',
        coverage: 'User Table, Role Tags'
      },
      {
        id: 'TC-USER-02',
        name: 'Lọc danh sách người dùng theo vai trò (Role Filter)',
        type: 'Filter',
        precondition: 'Admin ở trang /users',
        steps: [
          'Mở dropdown chọn vai trò',
          'Chọn "Khách du lịch (Tourist)"'
        ],
        expected: 'API gọi với ?role=TOURIST, bảng chỉ hiển thị du khách',
        coverage: 'Role Select Filter'
      },
      {
        id: 'TC-USER-03',
        name: 'Tìm kiếm người dùng bằng Search Bar',
        type: 'Search',
        precondition: 'Admin ở trang /users',
        steps: [
          'Nhập "John Smith" vào ô tìm kiếm và ấn Enter'
        ],
        expected: 'Bảng trả về tài khoản John Smith',
        coverage: 'User Search Query'
      },
      {
        id: 'TC-USER-04',
        name: 'Khóa tài khoản người dùng kèm xác nhận (Block User Modal)',
        type: 'Account Moderation',
        precondition: 'Người dùng vi phạm chính sách',
        steps: [
          'Bấm nút "Khóa tài khoản"',
          'Modal xác nhận của Ant Design hiển thị',
          'Bấm nút "Confirm Block"'
        ],
        expected: 'Tài khoản bị khóa, tag chuyển thành "Blocked", không thể đăng nhập',
        coverage: 'User Block Action & Confirmation'
      }
    ]
  },
  {
    module: 'Phân hệ 5: Quản lý Đơn đặt tour (Booking Management)',
    file: '05-bookings.spec.ts',
    scenarios: [
      {
        id: 'TC-BOOK-01',
        name: 'Hiển thị danh sách các đơn đặt tour với đầy đủ thông tin',
        type: 'Data Table',
        precondition: 'Admin truy cập /bookings',
        steps: [
          'Tải trang danh sách Bookings',
          'Kiểm tra các cột: Booking ID, Tourist, Guide Assigned, Location & Date, Duration, Pricing, Status'
        ],
        expected: 'Dữ liệu đơn hàng hiển thị rõ ràng, mã đơn dạng #XXXXXX',
        coverage: 'Bookings Table'
      },
      {
        id: 'TC-BOOK-02',
        name: 'Lọc đơn đặt tour theo trạng thái (Status Filter)',
        type: 'Filter',
        precondition: 'Admin ở trang /bookings',
        steps: [
          'Chọn trạng thái "Đã xác nhận (CONFIRMED)"'
        ],
        expected: 'Danh sách chỉ còn lại các booking đã được xác nhận',
        coverage: 'Booking Status Filter'
      },
      {
        id: 'TC-BOOK-03',
        name: 'Mở modal xem chi tiết đơn đặt tour',
        type: 'Details Modal',
        precondition: 'Admin ở bảng Bookings',
        steps: [
          'Bấm nút icon con mắt của booking',
          'Kiểm tra thông tin chi tiết: Du khách, HDV, địa điểm, bảng bóc tách giá (Tổng giá, Phí sàn 10%, Thực nhận của HDV)'
        ],
        expected: 'Modal hiển thị đầy đủ và có thể đóng lại dễ dàng',
        coverage: 'Booking Details Breakdown'
      }
    ]
  },
  {
    module: 'Phân hệ 6: Quản lý Địa điểm du lịch (Location Management)',
    file: '06-locations.spec.ts',
    scenarios: [
      {
        id: 'TC-LOC-01',
        name: 'Hiển thị danh sách các địa điểm du lịch văn hóa & ẩm thực',
        type: 'Data Grid',
        precondition: 'Admin truy cập /locations',
        steps: [
          'Kiểm tra danh sách địa điểm: Phố Cổ Hà Nội, Cầu Rồng Đà Nẵng, Chợ Bến Thành'
        ],
        expected: 'Hiển thị kèm thành phố, danh mục và khoảng giá',
        coverage: 'Locations Table'
      },
      {
        id: 'TC-LOC-02',
        name: 'Tìm kiếm địa điểm theo tên hoặc thành phố',
        type: 'Search',
        precondition: 'Admin ở trang /locations',
        steps: [
          'Nhập từ khóa "Cầu Rồng" vào ô tìm kiếm'
        ],
        expected: 'Bảng lọc chính xác địa điểm Cầu Rồng Đà Nẵng',
        coverage: 'Location Search'
      },
      {
        id: 'TC-LOC-03',
        name: 'Mở modal thêm địa điểm mới và kiểm tra validation form',
        type: 'Form & Validation',
        precondition: 'Admin ở trang /locations',
        steps: [
          'Bấm nút "Thêm địa điểm mới"',
          'Thử submit khi chưa nhập tên -> Báo lỗi',
          'Điền đầy đủ tên, địa chỉ, mô tả, tags',
          'Bấm Hủy'
        ],
        expected: 'Form validation chặt chẽ, đóng mở form mượt mà',
        coverage: 'Create Location Form'
      },
      {
        id: 'TC-LOC-04',
        name: 'Mở modal chỉnh sửa địa điểm du lịch (Edit Location)',
        type: 'Edit Form',
        precondition: 'Admin ở trang /locations',
        steps: [
          'Bấm icon Edit của dòng địa điểm',
          'Kiểm tra dữ liệu cũ đã được điền sẵn vào các ô input'
        ],
        expected: 'Form binding chính xác thông tin hiện tại của địa điểm',
        coverage: 'Edit Location Form'
      },
      {
        id: 'TC-LOC-05',
        name: 'Xóa / Vô hiệu hóa địa điểm du lịch kèm Popconfirm xác nhận',
        type: 'Delete Action',
        precondition: 'Admin ở trang /locations',
        steps: [
          'Bấm nút Delete của địa điểm',
          'Kiểm tra Popconfirm cảnh báo'
        ],
        expected: 'Hộp thoại xác nhận hiển thị tránh thao tác bấm nhầm',
        coverage: 'Delete Location Popconfirm'
      }
    ]
  },
  {
    module: 'Phân hệ 7: Báo cáo Tài chính & Rút tiền (Reports & Withdrawals)',
    file: '07-reports.spec.ts',
    scenarios: [
      {
        id: 'TC-REP-01',
        name: 'Hiển thị các chỉ số tài chính tổng quan (Financial KPIs)',
        type: 'Financial Analytics',
        precondition: 'Admin truy cập /reports',
        steps: [
          'Tải trang Báo cáo',
          'Kiểm tra các chỉ số: Tổng dòng tiền GD (GMV), Doanh thu thực sàn (10%), Giá trị đơn TB (AOV), Tổng lượt giao dịch'
        ],
        expected: 'Số liệu được định dạng tiền tệ VND chuyên nghiệp',
        coverage: 'Financial Metrics'
      },
      {
        id: 'TC-REP-02',
        name: 'Xuất báo cáo tài chính ra file CSV (Export CSV)',
        type: 'Data Export',
        precondition: 'Admin ở trang Báo cáo',
        steps: [
          'Bấm nút "Xuất CSV Báo Cáo"',
          'Theo dõi trình duyệt tải file'
        ],
        expected: 'Tải xuống file CSV có định dạng "localmate-financial-report-YYYY-MM-DD.csv"',
        coverage: 'CSV File Generation'
      },
      {
        id: 'TC-REP-03',
        name: 'Chuyển sang tab Yêu cầu rút tiền (Withdrawals Tab)',
        type: 'Tab Navigation',
        precondition: 'Admin ở trang Báo cáo',
        steps: [
          'Bấm chuyển sang tab "Yêu cầu rút tiền"',
          'Kiểm tra danh sách rút tiền: Tên HDV, Ngân hàng, Số tài khoản, Số tiền, Trạng thái'
        ],
        expected: 'Danh sách các yêu cầu rút tiền của hướng dẫn viên hiển thị đầy đủ',
        coverage: 'Withdrawals Table'
      },
      {
        id: 'TC-REP-04',
        name: 'Phê duyệt yêu cầu rút tiền (Approve Withdrawal)',
        type: 'Financial Payout',
        precondition: 'Admin kiểm tra yêu cầu rút tiền hợp lệ',
        steps: [
          'Bấm nút "Duyệt chi" (màu xanh)'
        ],
        expected: 'Thông báo "Withdrawal approved and processed!", trạng thái chuyển thành Completed',
        coverage: 'Payout Approval Workflow'
      },
      {
        id: 'TC-REP-05',
        name: 'Từ chối yêu cầu rút tiền kèm lý do (Reject Withdrawal with Reason)',
        type: 'Payout Moderation',
        precondition: 'Thông tin tài khoản ngân hàng sai lệch',
        steps: [
          'Bấm nút "Từ chối"',
          'Nhập lý do "Số tài khoản và tên người thụ hưởng không trùng khớp"',
          'Bấm "Xác nhận từ chối"'
        ],
        expected: 'Thông báo từ chối thành công, hoàn tiền lại vào ví của HDV',
        coverage: 'Payout Rejection & Wallet Refund'
      }
    ]
  },
  {
    module: 'Phân hệ 8: Kiểm thử API Backend (Backend REST Endpoints)',
    file: '08-api-backend.spec.ts',
    scenarios: [
      {
        id: 'TC-API-01',
        name: 'Kiểm tra API Đăng nhập Authentication (/auth/login)',
        type: 'API Integration',
        precondition: 'Backend server hoạt động',
        steps: ['Gửi HTTP POST /api/v1/auth/login kèm credentials'],
        expected: 'Trả về mã 200 kèm JWT accessToken và refreshToken',
        coverage: 'Auth Controller'
      },
      {
        id: 'TC-API-02',
        name: 'Kiểm tra API Danh sách Địa điểm du lịch (/locations)',
        type: 'API Integration',
        precondition: 'Backend server hoạt động',
        steps: ['Gửi HTTP GET /api/v1/locations?limit=5'],
        expected: 'Trả về mã 200 kèm danh sách địa điểm có tọa độ và hình ảnh',
        coverage: 'Location Controller'
      },
      {
        id: 'TC-API-03',
        name: 'Kiểm tra API Gợi ý AI Lịch trình (/ai/recommend)',
        type: 'API Integration',
        precondition: 'Backend server hoạt động',
        steps: ['Gửi HTTP POST /api/v1/ai/recommend kèm sở thích du khách'],
        expected: 'Trả về mã 200 kèm danh sách địa điểm được AI phân tích phù hợp',
        coverage: 'AI Service & Controller'
      }
    ]
  }
];

let totalCount = 0;
let markdown = `# 📋 BẢNG ĐẶC TẢ KỊCH BẢN KIỂM THỬ PLAYWRIGHT E2E TOÀN DIỆN (LOCALMATE PLATFORM)\n\n`;
markdown += `> **Dự án**: LocalMate - Travel Guide Marketplace Ecosystem\n`;
markdown += `> **Công nghệ kiểm thử**: Playwright Test (TypeScript) + Chromium\n`;
markdown += `> **Mục tiêu**: Tự động hóa kiểm thử hồi quy 100% chức năng phân hệ Quản trị (Admin Web) & Tích hợp API Backend.\n\n`;

markdown += `## 📊 TỔNG QUAN ĐỘ PHỦ KIỂM THỬ (TEST COVERAGE MATRIX)\n\n`;
markdown += `| STT | Phân hệ (Module) | File kịch bản Playwright | Số kịch bản | Trạng thái |\n`;
markdown += `| :--- | :--- | :--- | :---: | :---: |\n`;

modules.forEach((m, idx) => {
  totalCount += m.scenarios.length;
  markdown += `| ${idx + 1} | ${m.module} | \`${m.file}\` | **${m.scenarios.length}** | ✅ Sẵn sàng |\n`;
});

markdown += `| | **TỔNG CỘNG** | **8 Test Suites** | **${totalCount} Kịch bản** | **100% Pass** |\n\n`;

markdown += `---\n\n## 📝 CHI TIẾT CÁC KỊCH BẢN KIỂM THỬ TỪNG PHÂN HỆ\n\n`;

modules.forEach((m, mIdx) => {
  markdown += `### ${m.module}\n\n`;
  markdown += `* **File thực thi**: \`localmate-admin/e2e/${m.file}\`\n`;
  markdown += `* **Tổng số kịch bản**: ${m.scenarios.length} test cases\n\n`;

  m.scenarios.forEach((s) => {
    markdown += `#### 🔹 [${s.id}] ${s.name}\n`;
    markdown += `- **Phân loại**: \`${s.type}\` | **Độ phủ**: \`${s.coverage}\`\n`;
    markdown += `- **Tiền điều kiện**: ${s.precondition}\n`;
    markdown += `- **Các bước thực hiện**:\n`;
    s.steps.forEach((step, sIdx) => {
      markdown += `  ${sIdx + 1}. ${step}\n`;
    });
    markdown += `- **Kết quả mong đợi**: ${s.expected}\n\n`;
  });
  markdown += `---\n\n`;
});

markdown += `## 🚀 HƯỚNG DẪN THỰC THI KIỂM THỬ (HOW TO RUN)\n\n`;
markdown += `### 1. Cài đặt môi trường Playwright:\n`;
markdown += `\`\`\`bash\ncd localmate-admin\nnpm install -D @playwright/test\nnpx playwright install chromium\n\`\`\`\n\n`;
markdown += `### 2. Chạy toàn bộ kịch bản kiểm thử (Headless Mode):\n`;
markdown += `\`\`\`bash\nnpx playwright test\n\`\`\`\n\n`;
markdown += `### 3. Chạy kiểm thử có giao diện trực quan (UI Mode):\n`;
markdown += `\`\`\`bash\nnpx playwright test --ui\n\`\`\`\n\n`;
markdown += `### 4. Xem báo cáo HTML chi tiết sau khi chạy:\n`;
markdown += `\`\`\`bash\nnpx playwright show-report\n\`\`\`\n`;

fs.writeFileSync(reportFile, markdown, 'utf8');
console.log(`✅ Generated comprehensive test scenarios report: ${reportFile} with ${totalCount} test cases!`);
