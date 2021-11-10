import {tabs} from '@/layouts/Tabs'
import {Button} from 'antd'
const Page1 = () => {
  return (
    <>
      <div>这是在标签内打开的新页面</div>
      <p/>
      <Button onClick={tabs.goBack}>返回</Button>
    </>
  );
}
export default Page1;
