import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TodoTask = {
  name: string
  isFinished: boolean
  createTime: string
}

type TodoState = {
  taskList: TodoTask[]
  addTask: (name: string) => boolean
  deleteTask: (index: number) => boolean
  toggleTask: (index: number) => void
}

const seedTasks: TodoTask[] = [
  {
    name: '写下你要做的事',
    isFinished: false,
    createTime: new Date().toISOString(),
  },
  {
    name: '已完成的事项',
    isFinished: true,
    createTime: new Date().toISOString(),
  },
]

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      taskList: structuredClone(seedTasks),
      addTask: (name) => {
        const trimmed = name.trim()
        if (!trimmed) return false
        set({
          taskList: [
            ...get().taskList,
            {
              name: trimmed,
              isFinished: false,
              createTime: new Date().toISOString(),
            },
          ],
        })
        return true
      },
      deleteTask: (index) => {
        const list = get().taskList
        if (index < 0 || index >= list.length) return false
        set({ taskList: list.filter((_, i) => i !== index) })
        return true
      },
      toggleTask: (index) => {
        set({
          taskList: get().taskList.map((task, i) =>
            i === index ? { ...task, isFinished: !task.isFinished } : task,
          ),
        })
      },
    }),
    {
      name: 'todo-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
