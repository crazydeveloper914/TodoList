# coc-todolist

Todolist/task manager extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

![](https://user-images.githubusercontent.com/20282795/61593014-d1be3780-ac0c-11e9-96cc-e3b787a27f46.png)

## Install

```
:CocInstall coc-todolist
```

## Features

- Allow to set a reminder for a todo item
- Auto sync your todolist with gist(require github token once: [click here to generate](https://github.com/settings/tokens/new?scopes=gist&description=coc-todolist%20gist))
- Manage your todolist using CocList

## Configuration

```jsonc
"todolist.enable": {
  "type": "boolean",
  "default": true,
  "description": "whether enable this extension"
},
"todolist.maxsize": {
  "type": "number",
  "default": 5000,
  "description": "maxsize of todolist"
},
"todolist.dateFormat": {
  "type": "string",
  "default": "YYYY-MM-DD HH:mm",
  "description": "dates format"
},
"todolist.autoUpload": {
  "type": "boolean",
  "default": false,
  "description": "upload your todolist every day"
},
"todolist.monitor": {
  "type": "boolean",
  "default": false,
  "description": "monitor the todolist and remind you at the time"
},
"todolist.promptForReminder": {
  "type": "boolean",
  "default": true,
  "description": "whether to ask users to set a reminder for every new todo item"
},
"todolist.floatwin.background": {
  "type": "string",
  "default": "",
  "description": "notification floating window background(e.g. #000000)"
},
"todolist.floatwin.winblend": {
  "type": "number",
  "default": 0,
  "description": "opacity of notification floating window"
},
"todolist.floatwin.width": {
  "type": "number",
  "default": 30,
  "description": "width of notification floating window"
},
"todolist.notify": {
  "type": "string",
  "default": "floating",
  "description": "how to notify you",
  "enum": [
    "floating",
    "virtual",
    "echo",
    "none"
  ]
}
```

## Commands

- `:CocCommand todolist.create`: create a new todo
- `:CocCommand todolist.upload`: upload todolist to gist
- `:CocCommand todolist.download`: download todolist from gist
- `:CocCommand todolist.export`: export todolist as a json/yaml file
- `:CocCommand todolist.clearNotice`: clear all notifications

## CocList

run `:CocList todolist` to open the todolist

- Filter your todo items and perform operations via `<Tab>`
- Use `toggle` to toggle todo status between `active` and `completed`
- Use `edit` to edit the description of a todo item
- Use `preview` to preview a todo item
- Use `delete` to delete a todo item

## F.A.Q

Q: Where is the todolist data stored?

A: Normally the data is saved in `~/.config/coc/extensions/coc-todolist-data/`, but if you set `g:coc_extension_root` to another location, it will change as well

## License

MIT

## More Demos

![](https://user-images.githubusercontent.com/20282795/61623340-08499000-aca9-11e9-9be1-e6d951b075c2.gif)
