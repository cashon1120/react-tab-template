import {useState, useEffect} from 'react'
import styles from './style.less'
import { DownOutlined } from '@ant-design/icons';
import {RouteProps} from '../../../config/routes';
import {tabs} from '@/layouts/Tabs';

interface IProps {
  route : RouteProps
  layoutType: 'horizontal' | 'vertical'
}

const NavItem = (props : IProps) => {
  const {route, layoutType} = props
  const [showSubNav, setShouSubNav] = useState(false)
  const handleLinkClick = (route : RouteProps) => {
    const {path, component} = route
    if(!component){
      if(layoutType === 'vertical') return
      if(route.routes){
        setShouSubNav(!showSubNav)
      }
      return
    }
    tabs.open(path);
  };

  useEffect(() => {
    if(tabs.getParentPath() === tabs.getParentPath(route.path)){
      setShouSubNav(true)
    }
    tabs.addEventListener('onRouteChange', () => {
      if(tabs.getParentPath() !== tabs.getParentPath(route.path)){
        setShouSubNav(false)
      }
    })
  }, [])


  return <div key={route.path} className={styles.firstMenu}>
    <a
      className={tabs.getParentPath() === route.path
      ? styles.active
      : null}
      onClick={() => handleLinkClick(route)}>
      {route.name}
      {route.routes && route.routes.length > 0 && !route._disableShowSubTabs
        ? <DownOutlined className={`${styles.arrow} ${showSubNav ? styles.up : null}`} /> : null}
    </a>
    {route.routes && route.routes.length > 0 && !route._disableShowSubRoutes
      ? (
        <ul className={showSubNav ? styles.show: styles.hide}>
          {route
            .routes
            .map((subRoute : RouteProps) => (
              <li key={subRoute.path} className={subRoute.path === tabs.getCurrentPath() ? styles.subAcitve: null}>
                <a onClick={() => handleLinkClick(subRoute)}>
                  {subRoute.name}
                </a>
              </li>
            ))}
        </ul>
      )
      : null}
  </div>
}

export default NavItem
