import { useState } from 'react';
import { RouteProps } from '../../../config/routes';
import { tabs } from '@/layouts/Tabs';
import styles from './style.less';

const Header = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const handleLinkClick = (path: string) => {
    setShowSubMenu(true);
    setTimeout(() => {
      setShowSubMenu(false);
    }, 100);
    tabs.open(path);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <div>标签页面DEMO</div>
      </div>
      <nav>
        {tabs.sourceRoutes.map((route: RouteProps) =>
          route.name ? (
            <div key={route.path}>
              <div className={styles.firstMenu}>
                <a
                  className={
                    tabs.getParentPath(route.path) === route.path
                      ? styles.active
                      : null
                  }
                  onClick={() => handleLinkClick(route.path)}
                >
                  {route.name}
                  {route.routes &&
                  route.routes.length > 0 &&
                  !route._disableShowSubTabs ? (
                    <i className={styles.navArrow}></i>
                  ) : null}
                </a>
              </div>
              {route.routes &&
              route.routes.length > 0 &&
              !route._disableShowSubRoutes ? (
                <div
                  className={`${styles.subMenu} ${
                    showSubMenu ? styles.hide : null
                  }`}
                >
                  <ul>
                    {route.routes.map((subRoute: RouteProps) => (
                      <li key={subRoute.path}>
                        <a onClick={() => handleLinkClick(subRoute.path)}>
                          {subRoute.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null,
        )}
      </nav>
    </div>
  );
};

export default Header;
