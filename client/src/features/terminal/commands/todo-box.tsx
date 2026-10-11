import { useTodoStore } from '@/features/terminal/stores/todo-store'

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export function TodoBox() {
  const taskList = useTodoStore((state) => state.taskList)
  const deleteTask = useTodoStore((state) => state.deleteTask)
  const toggleTask = useTodoStore((state) => state.toggleTask)

  if (taskList.length === 0) {
    return <div className="text-white/70">暂无待办，使用 todo add -n 任务名 添加</div>
  }

  return (
    <div className="my-2 max-w-xl space-y-2 rounded border border-white/20 bg-black/40 p-3 text-white">
      {taskList.map((task, index) => (
        <div
          key={`${task.name}-${task.createTime}-${index}`}
          className="flex items-start gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"
        >
          <input
            type="checkbox"
            checked={task.isFinished}
            onChange={() => toggleTask(index)}
            className="mt-1"
          />
          <div className="min-w-0 flex-1">
            <div className={task.isFinished ? 'text-white/50 line-through' : ''}>
              {task.name}
            </div>
            <div className="text-xs text-white/50">
              创建时间：{formatTime(task.createTime)}
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-red-300 hover:text-red-200"
            onClick={() => deleteTask(index)}
          >
            删除
          </button>
        </div>
      ))}
    </div>
  )
}
