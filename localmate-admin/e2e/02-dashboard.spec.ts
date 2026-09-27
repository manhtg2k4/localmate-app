import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 2: Dashboard & Overview (Bảng điều khiển & Thống kê)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/');
  });

  test('TC-DASH-01: Hiển thị đầy đủ các chỉ số thống kê quan trọng (KPI Cards)', async ({ page }) => {
    await expect(page.getByText('Welcome back, LocalMate Admin! 👋')).toBeVisible();

    // 1. Thẻ Total Users
    await expect(page.getByText('Total Users')).toBeVisible();
    await expect(page.getByText('128')).toBeVisible();

    // 2. Thẻ Active Guides
    await expect(page.getByText('Active Guides')).toBeVisible();
    await expect(page.getByText('34')).toBeVisible();

    // 3. Thẻ Total Bookings
    await expect(page.getByText('Total Bookings')).toBeVisible();
    await expect(page.getByText('245')).toBeVisible();

    // 4. Thẻ Platform Revenue
    await expect(page.getByText('Platform Revenue')).toBeVisible();

    // 5. Thẻ Pending Approvals
    await expect(page.getByText('Pending Approvals')).toBeVisible();
  });

  test('TC-DASH-02: Hiển thị các biểu đồ trực quan hóa dữ liệu (Recharts)', async ({ page }) => {
    // Biểu đồ doanh thu
    await expect(page.getByText('Revenue & Growth Trend')).toBeVisible();
    const areaChart = page.locator('.recharts-wrapper').first();
    await expect(areaChart).toBeVisible();

    // Biểu đồ lượng đặt theo tháng
    await expect(page.getByText('Bookings Volume')).toBeVisible();
  });

  test('TC-DASH-03: Hiển thị danh sách Đơn đặt tour gần đây (Recent Bookings Table)', async ({ page }) => {
    await expect(page.getByText('Recent Bookings Activity')).toBeVisible();

    // Kiểm tra các cột trong bảng
    await expect(page.getByRole('columnheader', { name: 'Tourist' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Guide' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Booking Date' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total Amount' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();

    // Kiểm tra dữ liệu dòng
    await expect(page.getByText('Sarah Jenkins')).toBeVisible();
    await expect(page.getByText('Kenji Sato')).toBeVisible();
  });

  test('TC-DASH-04: Mở modal xem chi tiết Booking từ Dashboard', async ({ page }) => {
    // Click vào nút Details của dòng đầu tiên
    const detailBtn = page.getByRole('button', { name: 'Details' }).first();
    await detailBtn.click();

    // Modal chi tiết xuất hiện
    await expect(page.getByText(/Booking #/)).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('.ant-modal-close').first();
    await closeBtn.click();
    await expect(page.getByText(/Booking #/)).not.toBeVisible();
  });

  test('TC-DASH-05: Thu gọn và mở rộng thanh Sidebar (Collapse Sidebar)', async ({ page }) => {
    const sider = page.locator('.ant-layout-sider');
    await expect(sider).toBeVisible();

    // Click nút toggle collapse
    const toggleBtn = page.locator('.ant-layout-header button').first();
    await toggleBtn.click();

    // Kiểm tra class collapsed của Ant Design
    await expect(page.locator('.ant-layout-sider-collapsed')).toBeVisible();

    // Click lại để mở rộng
    await toggleBtn.click();
    await expect(page.locator('.ant-layout-sider-collapsed')).not.toBeVisible();
  });

});
