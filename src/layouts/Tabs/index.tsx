import { useEffect, useState } from 'react';
import tabs, { RouteProps } from './tabManager';
import SubTabs from './subTab';
import { IMenu, ILayoutMenu } from './interface';
import menu from './menuClass';
export { IMenu, ILayoutMenu, tabs, RouteProps };
import styles from './style.less';
export const Menu = menu;

const MainTabs = () => {
  const [updateFlag, setUpdateFlag] = useState('');
  useEffect(() => {
    tabs.forceUpdate = setUpdateFlag;
  }, []);
  return (
    <>
      {tabs.menu.map((item: ILayoutMenu) => (
        <div
          key={item.path}
          id={item.path}
          className={styles.contentWrapper}
          style={{
            display: tabs.routes[item.path].getShowState() ? 'block' : 'none',
          }}
        >
          <div
            className={styles.contentWrapper}
            style={{
              display:
                !tabs.routes[item.path].getParentShowState() &&
                item.routes.length > 0
                  ? 'block'
                  : 'none',
            }}
          >
            <SubTabs data={item.routes || []} />
          </div>
          <div
            className={styles.contentWrapper}
            style={{
              display: tabs.routes[item.path].getParentShowState()
                ? 'block'
                : 'none',
            }}
          >
            {tabs.routes[item.path].getChildren()}
          </div>
        </div>
      ))}
    </>
  );
};

export default MainTabs;
