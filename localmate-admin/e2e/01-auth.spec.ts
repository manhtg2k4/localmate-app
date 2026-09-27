import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 1: Authentication & Session Management (Xác thực & Phiên làm việc)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
  });

  test('TC-AUTH-01: Giao diện đăng nhập hiển thị đầy đủ các trường thông tin', async ({ page }) => {
    await page.goto('/login');

    // Kiểm tra logo và tiêu đề
    await expect(page.getByText('LocalMate Admin')).toBeVisible();
    await expect(page.getByText('Sign in to manage tours, guides & platform activity')).toBeVisible();

    // Kiểm tra các input
    const emailInput = page.getByPlaceholder('admin@localmate.com');
    const passwordInput = page.getByPlaceholder('••••••••');
    const submitBtn = page.getByRole('button', { name: 'Sign In to Dashboard' });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Kiểm tra tài khoản quick demo
    await expect(page.getByText('Quick Demo Account')).toBeVisible();
  });

  test('TC-AUTH-02: Báo lỗi khi bỏ trống trường Email hoặc Mật khẩu', async ({ page }) => {
    await page.goto('/login');

    // Bấm nút đăng nhập khi chưa nhập gì
    await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    // Kiểm tra thông báo lỗi validation từ Ant Design
    await expect(page.getByText('Please enter your admin email')).toBeVisible();
    await expect(page.getByText('Please enter your password')).toBeVisible();
  });

  test('TC-AUTH-03: Báo lỗi khi nhập sai mật khẩu', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('admin@localmate.com').fill('admin@localmate.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    // Kiểm tra message thông báo lỗi
    await expect(page.locator('.ant-message-notice').first()).toBeVisible();
  });

  test('TC-AUTH-04: Đăng nhập thành công và chuyển hướng về Dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('admin@localmate.com').fill('admin@localmate.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    // Chờ điều hướng đến URL Dashboard
    await page.waitForURL('**/');

    // Kiểm tra thông báo chào mừng trên Dashboard
    await expect(page.getByText('Welcome back, LocalMate Admin! 👋')).toBeVisible();
  });

  test('TC-AUTH-05: Bảo vệ đường dẫn (Protected Route) - Chưa đăng nhập tự động đá về /login', async ({ page }) => {
    // Truy cập trực tiếp vào route được bảo vệ
    await page.goto('/bookings');

    // Phải bị chuyển hướng về /login
    await page.waitForURL('**/login');
    await expect(page.getByRole('button', { name: 'Sign In to Dashboard' })).toBeVisible();
  });

  test('TC-AUTH-06: Đăng xuất tài khoản (Log out)', async ({ page }) => {
    // Giả lập trạng thái đã đăng nhập
    await injectAdminAuth(page);
    await page.goto('/');

    await expect(page.getByText('Welcome back, LocalMate Admin! 👋')).toBeVisible();

    // Mở dropdown avatar của Admin
    const userAvatar = page.locator('.ant-layout-header .ant-avatar').first();
    await userAvatar.click();

    // Bấm nút Log Out trong menu
    const logoutBtn = page.getByText('Log Out');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Kiểm tra đã bị đưa về trang login và localStorage bị xóa token
    await page.waitForURL('**/login');
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();
  });

});
