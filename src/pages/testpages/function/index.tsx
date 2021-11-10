import React, { useState, useEffect } from 'react';
import { tabs } from '@/layouts/Tabs';
import { Button, Table } from 'antd';

const columns: any = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 350,
    render: (text: string) => <span style={{ color: '#000' }}>{text}</span>,
  },
  {
    title: '说明',
    dataIndex: 'desc',
  },
  {
    title: '事例',
    dataIndex: 'exam',
  },
];

const Index = (props: any) => {
  const [pathProps, setPathProps] = useState('');
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

  const data = [
    {
      name: 'tabs',
      desc: '整个标签对象',
      exam: '',
    },
    {
      name: 'tabs.addEventListener(eventName: string, event: Function)',
      desc: '给页面添加事件,eventName, onShow | onHide | onClose | onConfirmClose | onMessage | onRouteChange | onQuery | onRefresh(暂未实现), 所有事件在初次打开时不会执行, onConfirmClose 必须返回Promise, new Promise((resolve) => resolve(result: boolean))',
      exam: '在useEffcet或componentDidMount里绑定事件, tabs.addEventListener("onShow", this.onShow);',
    },
    {
      name: 'tabs.postMessage(path: string, params: any)',
      desc: '向指定标签发送消息, 只有当目标标签已经打开才有用, 不会切换标签, 对应标签页应绑定onMessage事件, tabs.addEventListener("onMessage", this.onMessage)',
      exam: (
        <Button
          onClick={() =>
            tabs.postMessage('/test/class', Math.random(), () => {
              alert('消息发送成功');
            })
          }
        >
          先打开class组件 发送一个随机数字
        </Button>
      ),
    },
    {
      name: 'tabs.open(path: string, params?: any)',
      desc: '打开标签, 如果带有params参数, 会在地址栏带上对应参数',
      exam: (
        <Button onClick={() => tabs.open('/test/class', { id: Math.random() })}>
          带参数跳转
        </Button>
      ),
    },
    {
      name: 'tabs.getQuery()',
      desc: '获取地址栏参数',
      exam: '',
    },
    {
      name: 'tabs.openWithState(path: string, state?: any)',
      desc: '打开标签, 如果带有params参数, 可通过props.location.state获取, 当标签已经存在, 再从其它标签通过openWithState跳转过来时, 需配合 tabs.addEventListener 绑定事件去重新获取',
      exam: (
        <Button
          onClick={() =>
            tabs.openWithState('/test/class', { id: Math.random() })
          }
        >
          带state跳转
        </Button>
      ),
    },
    {
      name: 'tabs.replace(path: string, params?: any)',
      desc: '在当前标签内打开页面, 其它同tabs.open',
      exam: (
        <Button
          onClick={() =>
            tabs.replace('/test/function/in', { id: Math.random() })
          }
        >
          标签内打开
        </Button>
      ),
    },
    {
      name: 'tabs.replaceWithState(path: string, state?: any)',
      desc: '在当前标签内打开页面, 其它同tabs.openWithState',
      exam: '',
    },
    {
      name: 'tabs.getRouteProps(path?: string)',
      desc: `返回当前页面(没指定path时)属性, {id: number;
              name: string;
              pid: number;
              permission: number;
              parentPath: string;
              parentPermission: number};`,
      exam: (
        <Button
          onClick={() => setPathProps(JSON.stringify(tabs.getRouteProps()))}
        >
          获取属性
        </Button>
      ),
    },
    {
      name: 'tabs.goBack()',
      desc: '当在标签内打开时, 返回上一级页面, 但如果是刷新了当前页面, 是没有上一级页面的, 会去找它的父页面',
      exam: '',
    },
    {
      name: 'tabs.forceUpdate()',
      desc: '强制更新标签状态(不是更新所有页面), 有时候会有用...',
      exam: '',
    },
  ];

  return (
    <div style={{ padding: 15 }}>
      <Table
        rowKey="name"
        columns={columns}
        size="small"
        dataSource={data}
        bordered
        pagination={false}
      />
      <div style={{ padding: 25, lineHeight: 2 }}>
        {pathProps}
      </div>
    </div>
  );
};

// 用memo包一层, 减少切换导航时重复渲染
export default React.memo(Index, tabs.shouldFunctionComponentUpdate)
