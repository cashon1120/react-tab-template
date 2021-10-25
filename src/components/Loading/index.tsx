import {Spin} from 'antd'
import styles from './style.less';

const Loading = () => {
  return <div className={styles.wrapper}><Spin size="default" className={styles.wrapper} /></div>
};
export default Loading;
