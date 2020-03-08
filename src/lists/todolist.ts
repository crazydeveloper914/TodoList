import {
  ListAction,
  ListContext,
  ListItem,
  BasicList,
  Neovim,
  workspace,
} from 'coc.nvim'
import { TodoItem, TodoData } from '../types'
import DB from '../util/db'
import moment from 'moment'

export default class TodoList extends BasicList {
  public readonly name = 'todolist'
  public readonly description = 'todolist'
  public readonly defaultAction = 'toggle'
  public actions: ListAction[] = []

  constructor(protected nvim: Neovim, private todoList: DB) {
    super(nvim)

    this.addAction('toggle', async (item: ListItem) => {
      const { todo, uid } = item.data as TodoData
      const { status } = todo
      if (status === 'active') {
        todo.status = 'archived'
      } else if (status === 'archived') {
        todo.status = 'active'
      }
      await this.todoList.update(uid, todo)
    }, { persist: true, reload: true })

    this.addAction('preview', async (item: ListItem, context) => {
      const { todo } = item.data as TodoData
      const lines = Object.keys(todo).map(key => `${key}: ${todo[key]}`)
      await this.preview({
        bufname: 'todolist',
        sketch: true,
        filetype: 'yaml',
        lines,
      }, context)
    }, { persist: true, reload: true })

    this.addAction('edit', async (item: ListItem) => {
      const { uid } = item.data as TodoData
      const todo = item.data.todo
      const config = workspace.getConfiguration('todolist')
      const desc = await workspace.requestInput('Input new description', todo.desc)
      if (!desc || desc.trim() === '') return
      todo.desc = desc.trim()

      const remind = await workspace.requestInput('Set a reminder for you?(y/n)')
      if (!remind || remind.trim() === '') return
      if (remind.trim().toLowerCase() === 'y') {
        todo.remind = true
        const dateFormat = config.get<string>('dateFormat')
        let dueDate = moment().format(dateFormat)
        dueDate = await workspace.requestInput('When to remind you', dueDate)
        if (!dueDate || dueDate.trim() === '') return
        const due = moment(dueDate.trim(), dateFormat).toDate().toString()
        todo.due = due
      }
      await this.todoList.update(uid, todo)
    })

    this.addAction('delete', async (item: ListItem) => {
      const { uid } = item.data as TodoData
      await this.todoList.delete(uid)
    }, { persist: true, reload: true })
  }

  private compare(a: TodoItem, b: TodoItem): number {
    const priority = new Map<string, number>()
    priority.set('active', 1)
    priority.set('completed', 2)

    return priority.get(a.status) - priority.get(b.status)
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    const arr = await this.todoList.load()
    let res: ListItem[] = []
    for (const item of arr) {
      let { desc, status } = item.todo
      const icon = {
        active: '[*]',
        archived: '[√]',
      }
      const shortcut = icon[status]
      let label = `${shortcut} ${desc}`
      res.push({
        label,
        filterText: desc + status,
        data: Object.assign({}, item)
      })
    }
    res = res.sort((a, b) => this.compare(a.data.todo, b.data.todo))
    return res
  }

  public doHighlight(): void {
    const { nvim } = this
    nvim.pauseNotification()
    nvim.command('syn match TodoIcon /\\v\\[.\\]/', true)
    nvim.command('syn match TodoDesc /\\v%4v.*$/', true)
    nvim.command('hi def link TodoIcon Constant', true)
    nvim.command('hi def link TodoDesc String', true)
    nvim.resumeNotification().catch(_e => {
      // nop
    })
  }
}
