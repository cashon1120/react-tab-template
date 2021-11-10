import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import route from '../../config/routes'
import Header from '@/components/Header';
import MainTabs, { tabs } from './Tabs';
import styles from './index.less';

tabs.initRoutes(route);

const LayoutPage: React.FC = (props: any) => {
  tabs.updateMenu(props);
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.main}>
        <div>
          <Header />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <MainTabs />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LayoutPage;
