import tabs from './manager';
import { ILayoutMenu } from './interface';

import styles from './style.less';
interface IProps {
  data: ILayoutMenu[];
}

const Tab = (props: IProps) => {
  const { data } = props;
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabWrapper}>
        {tabs.checkDisableShowSubTabs()
          ? null
          : data.map((item: ILayoutMenu) => (
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
                <i
                  onClick={() => tabs.close(item.path)}
                  className={styles.close}
                >
                  x
                </i>
              </div>
            ))}
      </div>

      <div className={styles.content}>
        {data.map((item: ILayoutMenu) => (
          <div
            id={item.path}
            key={item.path}
            style={{
              display: tabs.routes[item.path].getShowState() ? 'block' : 'none',
            }}
          >
            {tabs.routes[item.path].getChildren()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab;
