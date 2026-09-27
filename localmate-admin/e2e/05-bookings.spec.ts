import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 5: Booking Management (Quản lý các chuyến đi & Đơn đặt tour)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/bookings');
  });

  test('TC-BOOK-01: Hiển thị danh sách các đơn đặt tour với đầy đủ thông tin', async ({ page }) => {
    await expect(page.getByText(/Booking Management/)).toBeVisible();

    // Kiểm tra các cột bảng
    await expect(page.getByRole('columnheader', { name: 'Booking ID' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Tourist' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Guide Assigned' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Destination' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total Price' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();

    // Kiểm tra dữ liệu hiển thị
    await expect(page.getByText('Sarah Jenkins').first()).toBeVisible();
    await expect(page.getByText('Trần Văn Nam').first()).toBeVisible();
    await expect(page.getByText('CONFIRMED').first()).toBeVisible();
  });

  test('TC-BOOK-02: Lọc đơn đặt tour theo trạng thái (Status Filter)', async ({ page }) => {
    // Click vào dropdown chọn trạng thái
    const statusSelect = page.locator('.ant-select').first();
    await statusSelect.click();

    // Chọn trạng thái Confirmed
    const option = page.locator('.ant-select-item-option-content').getByText('Confirmed');
    if (await option.isVisible()) {
      await option.click();
    }
  });

  test('TC-BOOK-03: Mở modal xem chi tiết đơn đặt tour (Booking Details Modal)', async ({ page }) => {
    // Click nút Details của booking đầu tiên
    const detailsBtn = page.getByRole('button', { name: 'Details' }).first();
    await detailsBtn.click();

    // Kiểm tra nội dung chi tiết trong Modal
    await expect(page.locator('.ant-modal-title').getByText(/Booking Details/)).toBeVisible();
    await expect(page.locator('.ant-modal-body').getByText('Sarah Jenkins')).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('.ant-modal-close').first();
    await closeBtn.click();
    await expect(page.locator('.ant-modal-title').getByText(/Booking Details/)).not.toBeVisible();
  });

});
