import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type SpaceItemType = {
  name: string
  link?: string
  dir: string
  type: 'dir' | 'link'
}

export type SpaceType = Record<string, SpaceItemType>

function getFullPath(dir: string, name: string): string {
  if (name.startsWith('/')) return name
  return dir + (dir === '/' ? '' : '/') + name
}

function getParentDir(path: string): string {
  if (path === '/') return '/'
  const parentDir = path.substring(0, path.lastIndexOf('/'))
  return parentDir || '/'
}

function getItemName(path: string): string {
  if (path === '/') return path
  return path.substring(path.lastIndexOf('/') + 1)
}

function getItemDepth(key: string) {
  if (key === '/') return 1
  return key.split('/').length
}

type SpaceState = {
  space: SpaceType
  currentDir: string
  getItem: (key: string) => SpaceItemType | undefined
  listItems: (dir?: string, recursive?: boolean) => SpaceItemType[]
  addItem: (item: SpaceItemType) => boolean
  deleteItem: (key: string, recursive?: boolean) => boolean
  copyItem: (source: string, target: string, recursive?: boolean) => boolean
  moveItem: (source: string, target: string, recursive?: boolean) => boolean
  updateCurrentDir: (newDir: string) => boolean
}

const rootSpace: SpaceType = {
  '/': { name: '/', dir: '/', type: 'dir' },
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      space: structuredClone(rootSpace),
      currentDir: '/',
      getItem: (key) => {
        const fullPath = getFullPath(get().currentDir, key)
        return get().space[fullPath]
      },
      listItems: (dir, recursive = false) => {
        const { space, currentDir } = get()
        const targetDir = dir ? getFullPath(currentDir, dir) : currentDir
        const parentDirDepth = getItemDepth(targetDir)
        const resultList: SpaceItemType[] = []
        for (const key of Object.keys(space)) {
          if (key === targetDir) continue
          if (!key.startsWith(targetDir)) continue
          if (!recursive) {
            if (getItemDepth(key) - 1 === parentDirDepth) {
              resultList.push(space[key]!)
            }
          } else {
            resultList.push(space[key]!)
          }
        }
        return resultList
      },
      addItem: (item) => {
        const { space } = get()
        const fullPath = getFullPath(item.dir, item.name)
        if (!space[item.dir] || space[fullPath]) return false
        set({ space: { ...space, [fullPath]: item } })
        return true
      },
      deleteItem: (key, recursive = false) => {
        const { space, currentDir } = get()
        const fullPath = getFullPath(currentDir, key)
        if (!space[fullPath]) return false
        const next = { ...space }
        const deleteKeys = [fullPath]
        if (recursive) {
          for (const spaceKey of Object.keys(space)) {
            if (spaceKey.startsWith(fullPath)) deleteKeys.push(spaceKey)
          }
        }
        deleteKeys.forEach((deleteKey) => {
          delete next[deleteKey]
        })
        set({ space: next })
        return true
      },
      copyItem: (source, target, recursive = false) => {
        const { space, currentDir, addItem } = get()
        const sourceFullPath = getFullPath(currentDir, source)
        const targetFullPath = getFullPath(currentDir, target)
        const sourceItem = space[sourceFullPath]
        if (!sourceItem) return false
        if (sourceItem.type === 'dir' && !recursive) return false
        if (space[targetFullPath]) return false
        const targetParentDir = getParentDir(targetFullPath)
        if (!space[targetParentDir]) return false
        return addItem({
          ...sourceItem,
          dir: targetParentDir,
          name: getItemName(targetFullPath),
        })
      },
      moveItem: (source, target, recursive = false) => {
        const { copyItem, deleteItem } = get()
        const copied = copyItem(source, target, recursive)
        if (!copied) return false
        return deleteItem(source, recursive)
      },
      updateCurrentDir: (newDir) => {
        const { space, currentDir } = get()
        let fullPath = getFullPath(currentDir, newDir)
        if (newDir === '..') {
          if (currentDir === '/') return false
          fullPath = getParentDir(currentDir)
        }
        if (!space[fullPath]) return false
        set({ currentDir: fullPath })
        return true
      },
    }),
    {
      name: 'space-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
