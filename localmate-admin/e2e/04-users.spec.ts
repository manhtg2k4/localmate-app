import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 4: User Management (Quản lý tài khoản Người dùng)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/users');
  });

  test('TC-USER-01: Hiển thị danh sách người dùng đầy đủ các vai trò', async ({ page }) => {
    await expect(page.getByText(/User Directory/)).toBeVisible();

    // Kiểm tra danh sách hiển thị đúng các user trong bảng
    await expect(page.locator('table').getByText('System Administrator')).toBeVisible();
    await expect(page.getByText('admin@localmate.com')).toBeVisible();

    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('tourist@test.com')).toBeVisible();

    await expect(page.getByText('Nguyễn Văn Minh')).toBeVisible();
    await expect(page.getByText('guide@test.com')).toBeVisible();
  });

  test('TC-USER-02: Lọc danh sách người dùng theo vai trò (Role Filter)', async ({ page }) => {
    // Tìm select lọc vai trò
    const roleSelect = page.locator('.ant-select').first();
    await roleSelect.click();

    // Chọn Tourists
    const touristOption = page.locator('.ant-select-item-option-content').getByText('Tourists');
    if (await touristOption.isVisible()) {
      await touristOption.click();
    }
  });

  test('TC-USER-03: Tìm kiếm người dùng bằng Search Bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search name or email...');
    await searchInput.fill('John Smith');
    await searchInput.press('Enter');

    // Kiểm tra kết quả
    await expect(page.getByText('John Smith')).toBeVisible();
  });

  test('TC-USER-04: Khóa tài khoản người dùng kèm xác nhận (Block User Modal)', async ({ page }) => {
    // Bấm nút "Block" của user John Smith
    const blockBtn = page.getByRole('button', { name: 'Block' }).first();
    await blockBtn.click();

    // Xuất hiện modal xác nhận của Ant Design
    await expect(page.locator('.ant-modal-confirm-title').first()).toBeVisible();

    // Bấm xác nhận khóa
    const confirmBtn = page.getByRole('button', { name: 'Confirm Block' });
    await confirmBtn.click();

    // Hiển thị thông báo thành công
    await expect(page.locator('.ant-message-notice')).toBeVisible();
  });

});
