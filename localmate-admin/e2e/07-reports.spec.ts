import { test, expect } from '@playwright/test';
import { setupMockApiRoutes, injectAdminAuth } from './fixtures/mock-routes';

test.describe('Module 7: Financial Reports & Withdrawals (Báo cáo Tài chính & Rút tiền HDV)', () => {

  test.beforeEach(async ({ page }) => {
    await setupMockApiRoutes(page);
    await injectAdminAuth(page);
    await page.goto('/reports');
  });

  test('TC-REP-01: Hiển thị các chỉ số tài chính tổng quan (Financial KPIs)', async ({ page }) => {
    await expect(page.getByText('Financial Reports & Payout Management')).toBeVisible();

    // Kiểm tra các thẻ số liệu tài chính
    await expect(page.getByText('Total Gross Revenue')).toBeVisible();
    await expect(page.getByText('Platform Commission (15%)')).toBeVisible();
    await expect(page.getByText('Total Tour Bookings')).toBeVisible();
    await expect(page.getByText('Average Order Value')).toBeVisible();
  });

  test('TC-REP-02: Nút Xuất báo cáo CSV hoạt động (Export CSV)', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: 'Export Financial CSV' });
    await expect(exportBtn).toBeVisible();

    // Lắng nghe sự kiện download file
    const downloadPromise = page.waitForEvent('download');
    await exportBtn.click();
    const download = await downloadPromise;

    // Kiểm tra tên file CSV được tạo
    expect(download.suggestedFilename()).toBe('localmate-financial-report.csv');
  });

  test('TC-REP-03: Chuyển sang tab Yêu cầu rút tiền (Withdrawals Tab)', async ({ page }) => {
    // Click vào tab "Guide Withdrawal Requests"
    const withdrawalTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Guide Withdrawal Requests' });
    await withdrawalTab.click();

    // Kiểm tra danh sách hiển thị
    await expect(page.getByText('Trần Văn Nam')).toBeVisible();
    await expect(page.getByText('Vietcombank')).toBeVisible();
    await expect(page.getByText('0011004321987')).toBeVisible();
  });

  test('TC-REP-04: Phê duyệt yêu cầu rút tiền (Approve Withdrawal)', async ({ page }) => {
    // Chuyển sang tab rút tiền
    await page.locator('.ant-tabs-tab').filter({ hasText: 'Guide Withdrawal Requests' }).click();

    // Bấm nút "Approve"
    const approveBtn = page.getByRole('button', { name: 'Approve' }).first();
    await approveBtn.click();

    // Bấm popconfirm xác nhận
    const popconfirmOk = page.locator('.ant-popconfirm .ant-btn-primary');
    if (await popconfirmOk.isVisible()) {
      await popconfirmOk.click();
    }

    // Kiểm tra thông báo duyệt thành công
    await expect(page.locator('.ant-message-notice')).toBeVisible();
  });

  test('TC-REP-05: Từ chối yêu cầu rút tiền kèm lý do (Reject Withdrawal with Reason)', async ({ page }) => {
    // Chuyển sang tab rút tiền
    await page.locator('.ant-tabs-tab').filter({ hasText: 'Guide Withdrawal Requests' }).click();

    // Bấm nút "Reject"
    const rejectBtn = page.getByRole('button', { name: 'Reject' }).first();
    await rejectBtn.click();

    // Xuất hiện modal từ chối
    await expect(page.getByText('Reject Withdrawal Request')).toBeVisible();

    // Nhập lý do từ chối
    const reasonInput = page.getByPlaceholder(/Bank account holder name/);
    await reasonInput.fill('Bank account number and account holder name do not match.');

    // Bấm xác nhận từ chối
    await page.getByRole('button', { name: 'Confirm & Return Balance' }).click();

    // Kiểm tra thông báo
    await expect(page.locator('.ant-message-notice')).toBeVisible();
  });

});
