import React, {useState} from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import route from '../../config/routes'
import Header from '@/layouts/Header';
import MainTabs, { tabs } from './Tabs';
import styles from './index.less';

tabs.init({route});

type LayoutType = 'horizontal' | 'vertical'

const defaultLayoutType = localStorage.getItem('layoutType') || 'horizontal'

const LayoutPage: React.FC = (props: any) => {

  const [layoutType, updateLayoutType] = useState<LayoutType>(defaultLayoutType as LayoutType)
  const handleUpdateLayoutType = () => {
    const type = layoutType === 'horizontal' ? 'vertical' : 'horizontal'
    localStorage.setItem('layoutType', type)
    updateLayoutType(type)
    tabs.forceUpdate()
  }

  tabs.updateTab(props);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={`${styles.main} ${styles[layoutType]}`}>
        <Header onLayoutTypeChange={handleUpdateLayoutType} layoutType={layoutType} />
        <div className={styles.contentWrapper}>
            <MainTabs />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LayoutPage
