import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 3: Guide Approval System (Hệ thống xét duyệt Hướng dẫn viên)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/guides');
  });

  test('TC-GUIDE-01: Hiển thị danh sách hồ sơ Hướng dẫn viên đang chờ duyệt', async ({ page }) => {
    await expect(page.getByText('Guide Application Approvals')).toBeVisible();

    // Kiểm tra các ứng viên trong danh sách chờ
    await expect(page.getByText('Vũ Thị Mai')).toBeVisible();
    await expect(page.getByText('mai.guide@test.com')).toBeVisible();
    await expect(page.getByText('Phạm Đức Anh')).toBeVisible();
    await expect(page.getByText('ducanh@guide.com')).toBeVisible();

    // Kiểm tra hiển thị ngôn ngữ
    await expect(page.getByText('Vietnamese').first()).toBeVisible();
    await expect(page.getByText('English').first()).toBeVisible();
  });

  test('TC-GUIDE-02: Tìm kiếm ứng viên theo tên hoặc email', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search guide by name or email...');
    await searchInput.fill('Vũ Thị Mai');

    // Kết quả phải chỉ còn Vũ Thị Mai, không có Phạm Đức Anh
    await expect(page.getByText('Vũ Thị Mai')).toBeVisible();
    await expect(page.getByText('Phạm Đức Anh')).not.toBeVisible();

    // Xóa ô tìm kiếm để hiển thị lại đầy đủ
    await searchInput.clear();
    await expect(page.getByText('Phạm Đức Anh')).toBeVisible();
  });

  test('TC-GUIDE-03: Mở modal xem chi tiết hồ sơ năng lực & giấy tờ xác minh', async ({ page }) => {
    // Click nút "Review" của ứng viên đầu tiên
    const reviewBtn = page.getByRole('button', { name: 'Review' }).first();
    await reviewBtn.click();

    // Kiểm tra nội dung trong Modal
    await expect(page.getByText('Guide Profile Verification Review')).toBeVisible();
    await expect(page.locator('.ant-modal').getByText('Vũ Thị Mai')).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('.ant-modal-close').first();
    await closeBtn.click();
  });

  test('TC-GUIDE-04: Phê duyệt hồ sơ Hướng dẫn viên (Approve)', async ({ page }) => {
    const approveBtn = page.getByRole('button', { name: 'Approve' }).first();
    await approveBtn.click();

    // Kiểm tra thông báo duyệt thành công
    await expect(page.getByText('Guide approved successfully!')).toBeVisible();
  });

  test('TC-GUIDE-05: Từ chối hồ sơ kèm lý do từ chối (Reject with Reason)', async ({ page }) => {
    const rejectBtn = page.getByRole('button', { name: 'Reject' }).first();
    await rejectBtn.click();

    // Modal nhập lý do từ chối xuất hiện
    await expect(page.getByText('Reject Application')).toBeVisible();

    // Nhập lý do từ chối hợp lệ
    const reasonInput = page.getByPlaceholder(/Identity verification document/);
    await reasonInput.fill('ID card photo is too blurry, please re-upload a clear copy.');

    const confirmRejectBtn = page.getByRole('button', { name: 'Confirm Rejection' });
    await confirmRejectBtn.click();

    // Kiểm tra thông báo thành công
    await expect(page.getByText('Guide application rejected')).toBeVisible();
  });

});
