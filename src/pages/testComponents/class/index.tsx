import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { tabs } from '@/components/Tabs';

interface IState {
  data: number;
  show: boolean;
  message: any;
  query: any;
}

class Index extends React.Component<null, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: 0,
      show: true,
      message: '',
      query: '',
    };
  }
  timer: any = null;
  componentDidMount() {
    // 绑定标签切换事件
    tabs.addEventListener('onShow', this.onShow);
    tabs.addEventListener('onHide', this.onHide);
    tabs.addEventListener('onMessage', this.onMessage);
    tabs.addEventListener('onConfirmClose', this.onConfirmClose);
    tabs.addEventListener('onQuery', this.onQuery);
    this.timer = setInterval(this.updateState, 1000);

    // 地址栏有参数, 刷新的时候需要单独处理
    if(tabs.getQuery()){
      this.onQuery(tabs.getQuery())
    }
  }

  // 添加shouldComponentUpdate, 减少重复渲染
  shouldComponentUpdate = (prev: any) => {
    return tabs.shouldClassComponentUpdate(prev);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateState = () => {
    const { show } = this.state;
    if (!show) return;
    this.setState({
      data: this.state.data + 1,
    });
  };

  onQuery = (params: any) => {
    console.log('执行onQuery')
    this.setState({
      query: JSON.stringify(params),
    });
  };

  onShow = () => {
    console.log('显示class组件');
    this.setState({
      show: true,
    });
  };

  onHide = () => {
    this.setState({
      show: false,
    });
  };

  // 注: 如果有shouldComponentUpdate, 当消息传过来时会更新message的值, 但不会进行渲染, 要等切换过来后才会渲染
  onMessage = (data: any) => {
    this.setState({
      message: data,
    });
  };

  onConfirmClose = () => {
    return new Promise((resolve: any) => {
      Modal.confirm({
        title: '确定要关闭当前页面码?',
        icon: <ExclamationCircleOutlined />,
        content: '关吗?关吗?关吗?',
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  };
  render() {
    const { data, message, query } = this.state;
    return (
      <>
        <div style={{ padding: 25, lineHeight: 2 }}>
          这是一个class组件, 切换会调用 onShow 或 onHide 方法,
          <br />
          当后面点过的页面超过3个时会清空状态 <br />
          <div>当前数据(1秒更新一次):{data}</div>
          <input />
          <p />
          消息: {message || '还没有消息'}
          <p />
          地址栏参数: {query || '没有参数'}
          <p />
          <button onClick={() => tabs.open('/test/function')}>
            跳转到function组件
          </button>
        </div>
      </>
    );
  }
}
export default Index;
