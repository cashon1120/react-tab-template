### 基于umi的一个标签页网页框架
## 主要实现的功能
* 保留打开过的页面状态(其实就是显示或隐藏)
* 已打开标签之间传参数,通信  

| 名称 | 说明 | 事例 |
| :---         |     :---:      |
| tabs.addEventListener(eventName: string, event: Function)   | 给页面添加事件,eventName, onShow | onHide | onClose | onConfirmClose | onMessage | onRouteChange | onQuery | onRefresh(暂未实现), 所有事件在初次打开时不会执行, onConfirmClose 必须返回Promise, new Promise((resolve) => resolve(result: boolean))     |
| tabs.postMessage(path: string, params: any)    | 向指定标签发送消息, 只有当目标标签已经打开才有用, 不会切换标签, 对应标签页应绑定onMessage事件, tabs.addEventListener("onMessage", this.onMessage) |
| tabs.open(path: string, params?: any) | 打开标签, 如果带有params参数, 会在地址栏带上对应参数 |
| tabs.openWithState(path: string, state?: any) | 打开标签, 如果带有params参数, 可通过props.location.state获取, 当标签已经存在, 再从其它标签通过openWithState跳转过来时, 需配合 tabs.addEventListener 绑定事件去重新获取 |
| tabs.replace(path: string, params?: any) | 在当前标签内打开页面, 其它同tabs.open |
| tabs.replaceWithState(path: string, state?: any) | 打开标签, 如果带有params参数, 会在地址栏带上对应参数 |
| tabs.goBack() | 当在标签内打开时, 返回上一级页面, 但如果是刷新了当前页面, 是没有上一级页面的, 会去找它的父页面 |
| tabs.forceUpdate() | 强制更新标签状态(不是更新所有页面), 有时候会有用... |

详细使用可参考 /src/pages/testComponents 里的代码
