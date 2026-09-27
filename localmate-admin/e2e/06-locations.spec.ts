import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 6: Location Management (Quản lý Địa điểm du lịch)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/locations');
  });

  test('TC-LOC-01: Hiển thị danh sách các địa điểm du lịch văn hóa & ẩm thực', async ({ page }) => {
    await expect(page.getByText(/Tourist Destination Catalog/)).toBeVisible();

    // Kiểm tra tên các địa điểm
    await expect(page.getByText('Phố Cổ Hà Nội (Old Quarter)')).toBeVisible();
    await expect(page.getByText('Cầu Rồng Đà Nẵng')).toBeVisible();
    await expect(page.getByText('Chợ Bến Thành')).toBeVisible();
  });

  test('TC-LOC-02: Tìm kiếm địa điểm theo tên hoặc thành phố', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by name or city...');
    await searchInput.fill('Old Quarter');

    // Kết quả phải có Phố Cổ Hà Nội và không có Chợ Bến Thành
    await expect(page.getByText('Phố Cổ Hà Nội (Old Quarter)')).toBeVisible();
    await expect(page.getByText('Chợ Bến Thành')).not.toBeVisible();

    await searchInput.clear();
    await expect(page.getByText('Chợ Bến Thành')).toBeVisible();
  });

  test('TC-LOC-03: Mở modal thêm địa điểm mới và kiểm tra validation form', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: 'Add Location' });
    await addBtn.click();

    // Modal xuất hiện
    await expect(page.getByText('Add New Location')).toBeVisible();

    // Thử bấm Submit (nút OK của modal Ant Design) khi chưa điền các trường bắt buộc
    const okBtn = page.locator('.ant-modal-footer button').last();
    await okBtn.click();

    // Hiển thị validation error
    await expect(page.getByText('Please enter location name')).toBeVisible();

    // Đóng modal
    const closeBtn = page.locator('.ant-modal-close').first();
    await closeBtn.click();
    await expect(page.getByText('Add New Location')).not.toBeVisible();
  });

  test('TC-LOC-04: Mở modal chỉnh sửa địa điểm du lịch (Edit Location)', async ({ page }) => {
    // Click nút Edit của địa điểm đầu tiên
    const editBtn = page.getByRole('button', { name: 'Edit' }).first();
    await editBtn.click();

    // Modal mở với tiêu đề chỉnh sửa
    await expect(page.getByText('Edit Location')).toBeVisible();

    // Kiểm tra tên địa điểm đã được bind vào form
    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveValue('Phố Cổ Hà Nội (Old Quarter)');

    // Đóng modal
    await page.locator('.ant-modal-close').first().click();
  });

  test('TC-LOC-05: Xóa / Vô hiệu hóa địa điểm du lịch kèm Popconfirm xác nhận', async ({ page }) => {
    // Click nút Delete của dòng đầu tiên
    const deleteBtn = page.locator('table tbody tr:first-child .ant-btn-dangerous').first();
    await deleteBtn.click();

    // Popconfirm xuất hiện
    await expect(page.getByText('Are you sure you want to deactivate this destination?')).toBeVisible();
  });

});
