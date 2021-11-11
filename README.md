### 基于umi的一个标签页网页框架
## 主要实现的功能
* 保留打开过的页面状态(其实就是显示或隐藏)
* 已打开标签之间传参数,通信  
[demo](http://120.48.9.247:83/)  

   <table>
        <tr>
            <th>名称</th>
            <th>说明</th>
        </tr>
        <tr>
            <th>tabs</th>
            <th>整个标签对象</th>
        </tr>
        <tr>
            <th>tabs.getQuery()</th>
            <th>获取当前地址栏参数</th>
        </tr>
        <tr>
            <th>tabs.addEventListener(eventName: string, event: Function)</th>
            <th>给页面添加事件,eventName, onShow | onHide | onClose | onConfirmClose | onMessage | onRouteChange | onQuery | onRefresh(暂未实现), 所有事件在初次打开时不会执行, onConfirmClose 必须返回Promise, new Promise((resolve) => resolve(result: boolean))</th>
            <th></th>
        </tr>
        <tr>
            <th>tabs.postMessage(path: string, params: any)</th>
            <th>向指定标签发送消息, 只有当目标标签已经打开才有用, 不会切换标签, 对应标签页应绑定onMessage事件, tabs.addEventListener("onMessage", this.onMessage)</th>
        </tr>
        <tr>
            <th>tabs.open(path: string, params?: any)</th>
            <th>打开标签, 如果带有params参数, 会在地址栏带上对应参数如 homepage?id=4, 可自己写方法获取地址, 也可用tabs.getQuery()获取当前地址栏目参数</th>
        </tr>
        <tr>
            <th>tabs.openWithState(path: string, state?: any)</th>
            <th>打开标签, 如果带有params参数, 可通过props.location.state获取, 当标签已经存在, 再从其它标签通过openWithState跳转过来时, 需配合 tabs.addEventListener 绑定事件去重新获取</th>
        </tr>
        <tr>
            <th>tabs.replace(path: string, params?: any)</th>
            <th>在当前标签内打开页面, 其它同tabs.open</th>
        </tr>
        <tr>
            <th>tabs.replaceWithState(path: string, state?: any)</th>
            <th>在当前标签内打开页面, 其它同tabs.openWithState</th>
        </tr>
        <tr>
            <th>tabs.goBack()</th>
            <th>当在标签内打开时, 返回上一级页面, 但如果是刷新了当前页面, 是没有上一级页面的, 会去找它的父页面</th>
        </tr>
        <tr>
            <th>tabs.forceUpdate()</th>
            <th>强制更新标签状态(不是更新所有页面), 有时候会有用...</th>
        </tr>
        <tr>
            <th>tabs.shouldClassComponentUpdate(nextProps)</th>
            <th>切换标签禁止更新Class组件, 配合shouldComponentUpdate使用</th>
        </tr>
        <tr>
            <th>tabs.shouldFunctionComponentUpdate()</th>
            <th>切换标签时不更新函数组件, 配合React.memo(), 作为第二个参数传入</th>
        </tr>
    </table>

详细使用可参考 /src/pages/testpages 里的代码
