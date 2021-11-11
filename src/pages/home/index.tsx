const Index = () => {
  return <div style={{padding: 20}}>
    <h3>说明</h3>
    <ul style={{paddingLeft: 30}}>
      <li>路由层级不限, 常规2级, 主导航显示一级路由, 二级路由会以标签形式出现, 但其实切换导航时一级路由也不会重新加载;</li>
      <li>界面支持上下和左右布局, 具体可看Header组件代码, 完全可以自行修改样式;</li>
    </ul>
  </div>
};
export default Index;
