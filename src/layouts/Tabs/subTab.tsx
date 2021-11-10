import tabs from './tabManager';
import { ILayoutMenu } from './interface';
import { CloseOutlined } from '@ant-design/icons';

import styles from './style.less';
interface IProps {
  data: ILayoutMenu[];
}

const Tab = (props: IProps) => {
  const { data } = props;
  return (
    <div
      className={`${styles.wrapper} ${
        !tabs.checkDisableShowSubTabs() ? styles.hasTabWrapper : ''
      }`}
    >
      {!data ? null : (
        <>
          {tabs.checkDisableShowSubTabs() ? null : (
            <div className={styles.tabWrapper}>
              {data.map((item: ILayoutMenu) => (
                <div key={item.path}>
                  <a
                    onClick={() => tabs.open(item.path)}
                    data-path={item.path}
                    className={
                      tabs.getCurrentPath() === item.path ? styles.active : null
                    }
                  >
                    {tabs.routes[item.path]?.getTitle()}
                  </a>
                  <CloseOutlined
                    onClick={() => tabs.close(item.path)}
                    className={styles.close}
                  />
                </div>
              ))}
            </div>
          )}
          <div className={styles.content}>
            {data.map((item: ILayoutMenu) => (
              <div
                id={item.path}
                key={item.path}
                // className={styles.contentWrapper}
                style={{
                  display: tabs.routes[item.path].getShowState()
                    ? 'block'
                    : 'none',
                }}
              >
                {/*可在这里进行权限的判断, 自己写咯*/}
                {tabs.routes[item.path].getChildren()}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tab;
