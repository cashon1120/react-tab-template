import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Header from '@/components/Header';
import MainTabs, { tabs, Menu, ILayoutMenu } from '@/components/Tabs';

import styles from './index.less';

// 判断当前路由是否为指定的路由, 目前是为了显示首页左侧的导航
const checkCurrentPath = (props: any, path: string) => {
  return props.children.props.location.pathname.indexOf(path) > -1;
};

const LayoutPage: React.FC = (props: any) => {
  const [menu, setMenu] = useState<ILayoutMenu[]>([]);

  const setMenuState = () => {
    const path = tabs.getCurrentPath();
    const level = tabs.checkRouteLevel(path);
    // level === -1 表示路由不存在
    if (level === -1) {
      tabs.open('/notFound');
      return;
    }
    if (level === 1) {
      if (menu.filter((item: ILayoutMenu) => item.path === path).length === 0) {
        tabs.addRoute(
          new Menu({
            key: path,
            path,
            show: true,
            showParent: true,
            children: props.children,
            routes: [],
          }),
          path,
        );
        menu.push({ path, routes: [] });
      } else {
        tabs.routes[path].setChildren(props.children);
      }
    } else {
      // 二级导航
      const topPath = tabs.getCurrnetParentPath();
      let topMenu = menu.filter(
        (item: ILayoutMenu) => item.path.indexOf(topPath) > -1,
      );
      // 当前还没有一级路由, 先把一张路由加进去, children 暂时为空
      if (topMenu.length === 0) {
        menu.push({ path: topPath, routes: [] });
        tabs.addRoute(
          new Menu({
            key: topPath,
            path: topPath,
            show: true,
            showParent: false,
            children: null,
            routes: [],
          }),
          topPath,
        );
      }
      const newSubMenu = new Menu({
        key: path,
        path,
        show: true,
        children: props.children,
      });
      menu.forEach((topMenu: ILayoutMenu) => {
        if (topMenu.path === topPath) {
          tabs.routes[topPath].setShowState(true);
          tabs.routes[topPath].setParentShowState(false);
          const { routes } = topMenu;
          if (
            routes.filter((subMenu: ILayoutMenu) => subMenu.path === path)
              .length === 0
          ) {
            routes.push({ path, routes: [] });
            tabs.addRoute(newSubMenu, path);
          }
          topMenu.routes.forEach((subRoute: ILayoutMenu) => {
            if (subRoute.path === path) {
              tabs.routes[path].setShowState(true);
              tabs.routes[path].setParentShowState(false);
              // 当超过最大标签数量时组件已经卸载掉, 这里重新赋值
              if (!tabs.routes[path].getChildren()) {
                tabs.routes[path].setChildren(props.children);
              }
            } else {
              tabs.routes[subRoute.path].setShowState(false);
            }
          });
        } else {
          // 隐藏其它页面
          tabs.routes[topMenu.path].setShowState(false);
        }
      });
    }
    tabs.onRouteChange(menu);
    setMenu([...menu]);
  };

  // 删除
  const deleteMenu = (cacheMenu: ILayoutMenu[], path: string) => {
    const findMenuToDelete = (menus: ILayoutMenu[]) => {
      menus.forEach((menu: ILayoutMenu, index: number) => {
        let hasFind: boolean = false;
        if (menu.path === path) {
          hasFind = true;
          menus.splice(index, 1);
        }
        if (!hasFind && menu.routes.length > 0) {
          findMenuToDelete(menu.routes);
        }
      });
    };
    findMenuToDelete(cacheMenu);
  };

  // 关闭标签事件, 主要是调用 deleteMenu 删除数组项目
  const closeTab = (cacheMenu: ILayoutMenu[], path: string) => {
    deleteMenu(cacheMenu, path);
    setMenu([...cacheMenu]);
  };

  useEffect(() => {
    // 绑定标签关闭事件
    tabs.bindTabFunction(closeTab);
  }, []);
  useEffect(setMenuState, [props.children]);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.main}>
        <div>
          <Header />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <MainTabs data={menu} />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LayoutPage;
