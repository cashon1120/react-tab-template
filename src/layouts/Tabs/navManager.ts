import { ILayoutMenu, ManagerClass } from './interface';
import { Menu } from './index';

class NavManager {
  tabs: ManagerClass;
  menu: ILayoutMenu[] = [];
  constructor() {
    this.tabs = {} as ManagerClass;
    this.menu = [];
  }

  init = (tabs: ManagerClass) => {
    this.tabs = tabs;
  };

  updateMenuState = (path: string, level: number, props: any) => {
    if (level === 1) {
      if (
        this.menu.filter((item: ILayoutMenu) => item.path === path).length === 0
      ) {
        this.tabs.addRoute(
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
        this.menu.push({ path, routes: [] });
      } else {
        this.tabs.routes[path].setChildren(props.children);
      }
    } else {
      // 二级或三级导航
      const topPath = this.tabs.getTopPath();
      let topMenu = this.menu.filter(
        (item: ILayoutMenu) => item.path.indexOf(topPath) > -1,
      );
      // 当前还没有一级路由, 先把一张路由加进去, children 暂时为空
      if (topMenu.length === 0) {
        this.menu.push({ path: topPath, routes: [] });
        this.tabs.addRoute(
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
      this.menu.forEach((topMenu: ILayoutMenu) => {
        if (topMenu.path === topPath) {
          this.tabs.routes[topPath].setShowState(true);
          this.tabs.routes[topPath].setParentShowState(false);
          const { routes } = topMenu;
          if (
            routes.filter((subMenu: ILayoutMenu) => subMenu.path === path)
              .length === 0
          ) {
            routes.push({ path, routes: [] });
            this.tabs.addRoute(newSubMenu, path);
          }
          topMenu.routes.forEach((subRoute: ILayoutMenu) => {
            if (subRoute.path === path) {
              this.tabs.routes[path].setShowState(true);
              this.tabs.routes[path].setParentShowState(false);
              // 当超过最大标签数量时组件已经卸载掉, 这里重新赋值
              if (!this.tabs.routes[path].getChildren()) {
                this.tabs.routes[path].setChildren(props.children);
              }
            } else {
              this.tabs.routes[subRoute.path].setShowState(false);
            }
          });
        } else {
          // 隐藏其它页面
          this.tabs.routes[topMenu.path].setShowState(false);
        }
      });
    }

    this.tabs.onLayoutMenuChange(this.menu);
  };

  replaceMenu = (path: string, props: any) => {
    const { topPath, oldPath } = this.tabs.replaceOption;
    this.menu.forEach((item: ILayoutMenu) => {
      if (item.path === topPath) {
        item.routes.forEach((subItem: ILayoutMenu) => {
          if (subItem.path === oldPath) {
            subItem.path = path;
          }
        });
      }
    });
    this.tabs.addRoute(
      new Menu({
        key: path,
        path,
        show: true,
        showParent: true,
        children: props.children,
        routes: [],
        fromPath: oldPath,
      }),
      path,
    );
    this.tabs.onLayoutMenuChange(this.menu);
  };

  setMenuState = (props: any) => {
    const path = this.tabs.getCurrentPath();
    const level = this.tabs.checkRouteLevel(path);
    // level === -1 表示路由不存在
    if (level === -1) {
      this.tabs.open('/notfound');
      return;
    }

    if (this.tabs.replaceOption.willReplace) {
      this.replaceMenu(path, props);
      return;
    }
    this.updateMenuState(path, level, props);
  };

  // 删除
  deleteMenu = (path: string) => {
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
    findMenuToDelete(this.menu);
  };

  // 关闭标签事件, 主要是调用 deleteMenu 删除数组项目
  closeTab = (path: string) => {
    this.deleteMenu(path);
  };
}

export default NavManager;
