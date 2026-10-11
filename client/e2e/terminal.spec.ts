import { expect, test } from '@playwright/test'

test('admin can open terminal and run help', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('邮箱').fill('admin@example.com')
  await page.getByLabel('密码').fill('admin123')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page.getByRole('heading', { name: '仪表盘' })).toBeVisible()
  await page.getByRole('link', { name: '命令终端' }).first().click()
  await expect(page).toHaveURL(/\/terminal/)

  const input = page.getByLabel('terminal-input')
  await input.fill('help')
  await input.press('Enter')

  await expect(
    page.getByText('使用 [help 命令英文名] 可以查询某命令的具体用法').first(),
  ).toBeVisible()
  await expect(page.getByText('clear', { exact: true }).first()).toBeVisible()
})
