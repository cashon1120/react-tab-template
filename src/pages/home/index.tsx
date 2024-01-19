const Index = () => {
  return <div style={{padding: 20}}>
    <h3>主要功能</h3>
    <ul style={{paddingLeft: 30}}>
      <li>实现导航切换和二级页面标签切换不重新加载路由的功能;</li>
      <li>标签页之间可跳转并传参;</li>
      <li>标签与标签之间通信, 不用切换标签;</li>
      <li>模拟浏览器标签打开关闭功能;</li>
      <li>关闭标签时提醒用户;</li>
    </ul>

    <h3 style={{paddingTop:30}}>说明</h3>
    <ul style={{paddingLeft: 30}}>
      <li>框架基于umi, ui引入了antd组件;</li>
      <li>在入口文件: /src/layouts/index.tsx, tabs.init 时注意传入必要的参数 </li>
      <li>路由层级不限, 常规2级, 主导航显示一级路由, 二级路由会以标签形式出现, 但其实切换导航时一级路由也不会重新加载;</li>
      <li>界面支持上下和左右布局, 具体可看Header组件代码, 完全可以自行修改样式;</li>
      <li> 功能在慢慢完善中, 难免有bug...;</li>
      <li style={{fontWeight: "bold"}}>本demo用的静态资源托管，没用nginx，所以刷新页面会出问题；</li>
    </ul>
  </div>
};
export default Index;
