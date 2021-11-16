import {tabs} from '@/layouts/Tabs'
import {Button} from 'antd'

const Page1 = (props: any) => {
  return (
    <>
      <div>这是在标签内打开的新页面</div>
      <p/>
        通过地址栏传过来的参数: {JSON.stringify(tabs.getQuery())}
      <p/>
      <p/>
        通过state传过来的参数: {JSON.stringify(props.location.state)}
      <p/>
      <Button onClick={() => tabs.goBack()}>返回</Button> <p/>
      标签内打开的页面返回后是会销毁的,不会保留状态
    </>
  );
}
export default Page1;
