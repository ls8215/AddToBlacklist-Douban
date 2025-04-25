# 豆瓣一键拉黑脚本

这是一个用户脚本（UserScript），可以在豆瓣网页的每条动态下方添加一个"拉黑"按钮，方便用户快速将不想看到的用户加入黑名单。

## 功能

- 在豆瓣动态（广播）下方自动添加"拉黑"按钮。
- 点击"拉黑"按钮会弹出确认对话框。
- 确认后，脚本会自动发送请求将该用户加入豆瓣黑名单。
- 拉黑成功后，该条动态会从页面上移除。

## 如何使用

你需要一个用户脚本管理器来运行此脚本。推荐使用 Tampermonkey（油猴）。

### 1. 安装用户脚本管理器（以 Tampermonkey 为例）

Tampermonkey 是一个流行的浏览器扩展，可以管理和运行用户脚本。

- **Chrome**: 从 [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 安装。
- **Firefox**: 从 [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) 安装。
- **Edge**: 从 [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) 安装。
- **Safari**: 从 [官网](https://www.tampermonkey.net/) 下载安装。
- **其他浏览器**: 请访问 [Tampermonkey 官网](https://www.tampermonkey.net/) 查找适用于你的浏览器的版本。

安装完成后，浏览器右上角通常会出现 Tampermonkey 的图标。

### 2. 安装脚本

1. 打开浏览器，点击 Tampermonkey 图标，选择"管理面板"（Dashboard）。
2. 在管理面板中，点击标签页上的 `+` 号，创建一个新脚本。
3. 将 `add_to_blacklist_douban.js` 文件中的所有代码复制。
4. 粘贴到 Tampermonkey 编辑器中，替换掉原有的模板代码。
5. 点击编辑器上方的"文件"菜单，选择"保存"。

### 3. 验证安装和使用

安装完成后，访问你的豆瓣首页（`https://www.douban.com/`），刷新页面。你应该能在每条动态的操作区域（如"回应"、"转发"按钮旁边）看到新增的"拉黑"按钮。

## 注意事项

- 拉黑操作需要你已登录豆瓣账号。
- 脚本通过模拟豆瓣网页自身的接口进行拉黑，如果豆瓣接口发生变化，脚本可能会失效。
- 请谨慎使用拉黑功能。
