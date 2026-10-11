import { expect, test } from '@playwright/test'

test('admin can create a user from users page', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('邮箱').fill('admin@example.com')
  await page.getByLabel('密码').fill('admin123')
  await page.getByRole('button', { name: '登录' }).click()
  await expect(page.getByRole('heading', { name: '仪表盘' })).toBeVisible()

  await page.getByRole('link', { name: '用户管理' }).first().click()
  await expect(page.getByRole('heading', { name: '用户管理' })).toBeVisible()
  await page.getByRole('button', { name: '新建用户' }).click()

  const email = `newuser-${Date.now()}@example.com`
  await page.getByLabel('姓名').fill('新用户')
  await page.getByLabel('邮箱').fill(email)
  await page.getByLabel('初始密码').fill('pass1234')
  await page.getByRole('button', { name: '保存' }).click()

  await expect(page.getByText(email)).toBeVisible()
})
