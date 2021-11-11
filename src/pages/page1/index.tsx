import {Input} from 'antd'
const Page1 = () => {
  return (
    <div style={{padding: 20}}>
      <div>其实导航也是标签页面, 切换导航不会重新加载路由</div>
      <p />
      <Input placeholder="输入文字试试, 切换回来还在" />
    </div>
  );
}
export default Page1;
