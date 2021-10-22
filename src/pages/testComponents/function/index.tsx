import { useState, useEffect } from 'react';
import { tabs } from '@/components/Tabs';

const Index = () => {
  const [data, setData] = useState(0);
  const [message, setMessage] = useState('');
  const onShow = () => {
    console.log('显示函数组件');
  };

  const onHide = () => {
    console.log('隐藏函数组件');
  };

  const onClose = () => {
    console.log('您关闭了函数组件页面');
  };

  useEffect(() => {
    // 绑定标签切换事件
    tabs.addEventListener('onShow', onShow);
    tabs.addEventListener('onHide', onHide);
    tabs.addEventListener('onClose', onClose);
  }, []);

  return (
    <>
      <div style={{ padding: 25, lineHeight: 2 }}>
        这是一个function组件, 切换会调用 onShow 或 onHide 方法,
        <br />
        但函数组件可能会拿不到最新的数据, 复杂的页面还是用class组件稳妥些
        <div>
          {data} <button onClick={() => setData(data + 1)}>add</button>
        </div>{' '}
        <p />
        <input
          onChange={(e: any) => setMessage(e.target.value)}
          style={{ width: 200 }}
          placeholder="输入内容向class组件发送消息"
        />{' '}
        <button onClick={() => tabs.postMessage('/test/class', message)}>
          发送
        </button>
        <p />
        <p />
        <button onClick={() => tabs.open('/test/class')}>
          跳转到class组件
        </button>{' '}
        <p />
        <button
          onClick={() => tabs.open('/test/class', { id: 2, class: 'werr' })}
        >
          带参数 跳转到class组件
        </button>
      </div>
    </>
  );
};

// 导航时用memo包一层, 减少重复渲染
export default Index;
// export default memo(Index, tabs.shouldFunctionComponentUpdate);
