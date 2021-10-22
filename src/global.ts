import { Modal } from 'antd';

window.showMsgModal = (
  msg: string | React.ReactNode,
  callback?: Function,
  title?: string,
  buttonTxt?: string,
) => {
  Modal.info({
    title: title || '系统消息',
    content: msg,
    okText: buttonTxt || '知道了',
    onOk() {
      if (callback != void 0) callback();
    },
  });
};
