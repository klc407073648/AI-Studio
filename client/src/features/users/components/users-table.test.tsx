import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UsersTable } from '@/features/users/components/users-table'
import type { User } from '@/types/user'

vi.mock('@/features/users/hooks', () => ({
  useUpdateUserMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}))

const users: User[] = [
  {
    id: '1',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

describe('UsersTable', () => {
  it('renders a user row', () => {
    render(<UsersTable users={users} onEdit={vi.fn()} />)
    expect(screen.getByText('系统管理员')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
  })
})
