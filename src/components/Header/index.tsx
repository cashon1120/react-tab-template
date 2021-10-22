import routes, { RouteProps } from '../../../config/routes';
import { tabs } from '@/components/Tabs';
import styles from './style.less';

const Header = () => {
  const handleLinkClick = (path: string) => {
    tabs.open(path);
  };

  return (
    <div className={styles.wrapper}>
      <nav>
        {routes.map((route: RouteProps) => (
          <div key={route.path}>
            <a onClick={() => handleLinkClick(route.path)}>{route._title}</a>
            {route.routes && !route._disableShowSubRoutes ? (
              <ul>
                {route.routes.map((subRoute: RouteProps) => (
                  <li key={subRoute.path}>
                    <a onClick={() => handleLinkClick(subRoute.path)}>
                      {subRoute._title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Header;
