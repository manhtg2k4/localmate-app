import { Page } from '@playwright/test';
import {
  mockAdminUser,
  mockDashboardData,
  mockRecentBookings,
  mockPendingGuides,
  mockUsersList,
  mockLocationsList,
  mockReportsData,
  mockWithdrawalsList
} from './mock-data';

export async function setupMockApiRoutes(page: Page) {
  // 1. Auth Login
  await page.route('**/api/v1/auth/login', async (route) => {
    const postData = route.request().postDataJSON();
    if (postData?.email === 'admin@localmate.com' && postData?.password === 'admin123') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Login successful',
          data: {
            user: mockAdminUser,
            accessToken: 'mock_jwt_access_token_admin',
            refreshToken: 'mock_jwt_refresh_token_admin'
          }
        })
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid email or password'
        })
      });
    }
  });

  // 2. Admin Dashboard Stats
  await page.route('**/api/v1/admin/dashboard', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockDashboardData
      })
    });
  });

  // 3. Admin Bookings
  await page.route('**/api/v1/admin/bookings*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockRecentBookings,
        pagination: { total: mockRecentBookings.length, page: 1, limit: 10, totalPages: 1 }
      })
    });
  });

  // 4. Admin Pending Guides
  await page.route('**/api/v1/admin/guides/pending*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockPendingGuides,
        pagination: { total: mockPendingGuides.length, page: 1, limit: 10, totalPages: 1 }
      })
    });
  });

  // 5. Admin Approve / Reject Guide
  await page.route('**/api/v1/admin/guides/*/approve', async (route) => {
    const data = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: data?.approve ? 'Guide approved successfully' : 'Guide rejected successfully',
        data: { _id: 'g_approved', isApproved: data?.approve }
      })
    });
  });

  // 6. Admin Users List
  await page.route('**/api/v1/admin/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockUsersList,
        pagination: { total: mockUsersList.length, page: 1, limit: 10, totalPages: 1 }
      })
    });
  });

  // 7. Admin Toggle Block User
  await page.route('**/api/v1/admin/users/*/toggle-block', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'User block status updated',
        data: { isBlocked: true }
      })
    });
  });

  // 8. Locations List & CRUD
  await page.route('**/api/v1/locations*', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockLocationsList,
          pagination: { total: mockLocationsList.length, page: 1, limit: 10, totalPages: 1 }
        })
      });
    } else if (method === 'POST') {
      const newLoc = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Location created successfully',
          data: { _id: 'loc_new_' + Date.now(), ...newLoc, isActive: true }
        })
      });
    } else {
      await route.continue();
    }
  });

  // 9. Admin Reports & Financials
  await page.route('**/api/v1/admin/reports*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockReportsData
      })
    });
  });

  // 10. Admin Withdrawals
  await page.route('**/api/v1/admin/withdrawals*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: mockWithdrawalsList,
        pagination: { total: mockWithdrawalsList.length, page: 1, limit: 10, totalPages: 1 }
      })
    });
  });

  // 11. Admin Approve / Reject Withdrawal
  await page.route('**/api/v1/admin/withdrawals/*/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Withdrawal status updated successfully'
      })
    });
  });
}

/**
 * Pre-authenticates the admin session by injecting token and user info into localStorage
 */
export async function injectAdminAuth(page: Page) {
  await page.addInitScript(({ user }) => {
    localStorage.setItem('accessToken', 'mock_jwt_access_token_admin');
    localStorage.setItem('refreshToken', 'mock_jwt_refresh_token_admin');
    localStorage.setItem('user', JSON.stringify(user));
  }, { user: mockAdminUser });
}
