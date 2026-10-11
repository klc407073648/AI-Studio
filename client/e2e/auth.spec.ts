import { expect, test } from '@playwright/test'

test('unauthenticated visit to /users redirects to login', async ({ page }) => {
  await page.goto('/users')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: '登录' })).toBeVisible()
})

test('admin can login and open users page', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('邮箱').fill('admin@example.com')
  await page.getByLabel('密码').fill('admin123')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page.getByRole('heading', { name: '仪表盘' })).toBeVisible()
  await page.getByRole('link', { name: '用户管理' }).first().click()
  await expect(page.getByRole('heading', { name: '用户管理' })).toBeVisible()
  await expect(page.getByText('admin@example.com')).toBeVisible()
})
