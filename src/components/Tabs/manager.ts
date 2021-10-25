import { history } from 'umi';
import route, { RouteProps } from '../../../config/routes';
import { setLocationQuery, getQueryByString, getLocationQuery } from './utils';
import {
  ManagerClass,
  IMenu,
  ILayoutMenu,
  FlatRoutes,
  TabRoutes,
  EventName,
} from './interface';

// 拍平数组, 暂时没有考虑路由中带参数的情况, 如 /default/:id, 后面若有这种情况再调整
const handleFlatRoutes = (routers: RouteProps[]) => {
  let routesObj: any = {};
  const flatRoutes = (routers: RouteProps[], parentPath?: string) => {
    routers.forEach((route: RouteProps) => {
      let { path, routes } = route;
      path = path.replace(/\/\:\w+/g, '');
      routesObj[path] = {
        ...route,
        path,
        parentPath,
      };
      if (routes) {
        flatRoutes(routes, path);
      }
    });
  };
  flatRoutes(routers);
  return routesObj;
};

class Manager implements ManagerClass {
  // 拍平的路由配置, 如: {/driver: {path: '/driver', _title: '司机画像', _icon: undefined}, ...}
  flatRoutes: FlatRoutes;

  routes: TabRoutes;
  // 维护两个最近操作过的页面, 触发显示和隐藏事件, 第[0]条数据为上一次打开路由, 第[1]条数据为当前打开的路由
  lastTwoRoutes: string[];
  // 已打开的路由队列
  opendRoutesList: string[];
  // 最大标签打开数量
  MAX_COUNT: number;
  // 卸载组件方法
  unloadFunctionFromLayout: Function;
  // 关闭标签
  closeTabFunctionFromLayout: Function;
  // 缓存当前打开的路由, 等同于 layouts 中的 menu
  cacheMenu: ILayoutMenu[];
  // 如果有onMessage方法需要执行, shouldComponentUpdate 应该返回 可执行的值
  forceUpdateWithMessagePath: string = '';

  constructor() {
    this.flatRoutes = handleFlatRoutes(route);
    this.routes = {};
    this.lastTwoRoutes = [];
    this.opendRoutesList = [];
    this.MAX_COUNT = 15;
    this.unloadFunctionFromLayout = () => {};
    this.closeTabFunctionFromLayout = () => {};
    this.cacheMenu = [];
  }

  // 判断组件是否需要更新, class 组件和函数组件是相反的, 如返回 true, class组件是会更新, 函数组件则不更新
  shouldComponentUpdate = (state: any, type: 'class' | 'function'): boolean => {
    const { path } = state.route;
    const routeName: any = this.lastTwoRoutes.filter(
      (item: string) => item === path,
    )[0];
    if (this.forceUpdateWithMessagePath === path) {
      // 更新后重置forceUpdateWithMessagePath为空, 当有onMessage执行时再赋值为接收页面的路径
      setTimeout(() => {
        this.forceUpdateWithMessagePath = '';
      }, 0);
      return type === 'class' ? true : false;
    }
    if (!routeName) {
      return type === 'class' ? false : true;
    }
    const result =
      this.routes[routeName] && this.routes[routeName].getShowState();
    return type === 'class' ? result : !result;
  };

  shouldClassComponentUpdate = (state: any) => {
    return this.shouldComponentUpdate(state, 'class');
  };

  shouldFunctionComponentUpdate = (state: any) => {
    return this.shouldComponentUpdate(state, 'function');
  };

  static updateOpendRoutesList = (
    list: string[],
    path: string,
    routes: TabRoutes,
    flatRoutes: any,
  ): string[] => {
    // 对于没有component的路由不需要处理, 比如有些路由没有组件, 是直接redircet到其它路由
    // 404(notFound) 或者 没有对应路由不处理
    if (
      (routes[path] && !routes[path].component) ||
      path === '/notFound' ||
      !flatRoutes[path]
    ) {
      return list;
    }
    const index = list.findIndex((value: string) => value === path);
    index === -1
      ? list.push(path)
      : (list[list.length - 1] = list.splice(index, 1)[0]);
    return list;
  };

  // 关闭标签后删除对应值
  static deleteOpendList = (list: string[], path: string) => {
    const index = list.findIndex((value: string) => value === path);
    list.splice(index, 1);
    return list;
  };

  // disableExcuteOnQuery: 关闭标签后会跳转到下一个应该被打开的页面, 这种情况不执行onQuery事件
  open = (path: string, params?: any, disableExcuteOnQuery?: boolean) => {
    const currentPath = this.getCurrentPath();
    if (currentPath !== path) {
      const { redirect } = this.flatRoutes[path];
      if (redirect) {
        history.push(redirect);
      } else {
        let queryString = '';
        if (disableExcuteOnQuery && this.routes[path]) {
          queryString = this.routes[path].queryString;
        } else {
          // 处理带参数跳转的情况
          if (params) {
            queryString = setLocationQuery(params);
          }
        }

        history.push(path + queryString);
        // 执行跳转后的onQuery方法
        if (this.routes[path] && !disableExcuteOnQuery) {
          const { onQuery } = this.routes[path].events;
          onQuery && onQuery(this.getQuery());
        }
      }
    }
  };

  findNextShouldOpenPath = (path: string): string => {
    let shouldOpenPath = '';
    // 找到当前路由后去找兄弟路由, 配合 this.opendRoutesList 找到接下来应该显示哪一个页面
    const { parentPath } = this.routes[path];
    const siblings = Object.keys(this.routes).filter(
      (key: string) =>
        this.routes[key].parentPath === parentPath && key !== path,
    );
    if (siblings.length > 1) {
      for (let i = 0; i < siblings.length; i++) {
        const __path = siblings[i];
        // 从后往前找, 匹配上了就显示对应路由
        for (let j = this.opendRoutesList.length - 1; j >= 0; j--) {
          if (this.opendRoutesList[j] === __path) {
            shouldOpenPath = __path;
            break;
          }
        }
        if (shouldOpenPath) {
          break;
        }
      }
    } else {
      // 如果没有兄弟路由就打开最近打开的一个
      shouldOpenPath = this.opendRoutesList[this.opendRoutesList.length - 1];
    }
    return shouldOpenPath;
  };

  close = (path?: string) => {
    const _path = path || this.getCurrentPath();
    // 关闭标签后要跳转的下一个页面路径
    let shouldOpenPath = '';

    // executeClose: 因为关闭事件有 onClose 和 onConfirmClose 两种, 第一种直接执行,第二种需要用户反馈后再执行
    // onConfirmClose 中的事件必须为一个 Promise
    const executeClose = () => {
      this.opendRoutesList = Manager.deleteOpendList(
        this.opendRoutesList,
        _path,
      );
      shouldOpenPath = this.findNextShouldOpenPath(_path);
      if (shouldOpenPath) {
        this.open(shouldOpenPath, null, true);
        // 执行 layout中的方法, 删除对应标签
        this.closeTabFunctionFromLayout(this.cacheMenu, _path);
      } else {
        // 没有可打开的页面时(this.opendRoutesList为空), 跳转到首页;
        this.open('/home');
      }
      // 延迟删除this.routes, 有些事件需要处理, 不然会出问题
      setTimeout(() => {
        delete this.routes[_path];
      }, 0);
    };

    if (!this.routes[_path]) {
      return;
    }
    // 看当前标签是否有onClose事件
    const { onConfirmClose, onClose } = this.routes[_path].events;
    // 如果有两个事件, 只走 onConfirmClose 事件
    if (onConfirmClose) {
      onConfirmClose().then((res: boolean) => {
        if (res) {
          executeClose();
        }
      });
    } else {
      onClose && onClose();
      executeClose();
    }
  };

  unloadComponent = (paths: string[]) => {
    paths.forEach((key: string) => {
      this.routes[key].unloadComponent();
    });
  };

  // 判断路由层级, -1: 没有该路由; 1: 一级路由; 2: 二级路由;
  checkRouteLevel = (path: string): -1 | 1 | 2 => {
    if (!this.flatRoutes[path]) {
      return -1;
    }
    if (
      route.filter(
        (item: RouteProps) => item.path.replace(/\/\:\w+/g, '') === path,
      ).length > 0
    ) {
      return 1;
    }
    return 2;
  };

  getCurrentPath = () => {
    // 删除后面的参数才是真实路由, 目前还没有有参数的情况
    return location.pathname.replace(/\/\d+/g, '');
  };

  getCurrnetParentPath = () => {
    const currentPath = this.getCurrentPath();
    const { parentPath } = this.flatRoutes[currentPath];
    return parentPath;
  };

  // 是否显示子页面标签栏目, 如 /home 路由
  checkDisableShowSubTabs = () => {
    const topPath = this.getCurrnetParentPath();
    let _disableShowSubTabs: boolean = false;
    for (let i = 0; i < route.length; i++) {
      if (route[i].path === topPath) {
        _disableShowSubTabs = !!route[i]._disableShowSubTabs;
        break;
      }
    }
    return _disableShowSubTabs;
  };

  addEventListener = (event: EventName, fn: Function) => {
    this.routes[this.getCurrentPath()].events[event] = fn;
  };

  updateRoutes = (path: string) => {
    const { _title, redirect, _icon, component, parentPath } =
      this.flatRoutes[path];
    this.routes[path].setRoutesOptions(
      _title || '',
      _icon || '',
      redirect || '',
      component || '',
      parentPath,
    );
    this.routes[path].queryString = getLocationQuery();
    Object.keys(this.routes).forEach((key: string) => {
      if (key === path) {
        this.routes[key].setShowState(true);
      } else {
        this.routes[key].setShowState(false);
      }
    });
    // 如果是二级组件, 就隐藏父组件, 显示子组件, 父子组件在一个容器里, setShowState 是为了显示这个公共容器
    if (parentPath) {
      this.routes[parentPath].setParentShowState(false);
      this.routes[parentPath].setShowState(true);
    } else {
      // 如果是一级组件就显示父容器
      this.routes[path].setParentShowState(true);
    }
  };

  // 更新 lastTwoRoutes 数组
  onRouteChange = (menu: ILayoutMenu[]) => {
    const path = this.getCurrentPath();
    this.cacheMenu = menu;
    this.updateRoutes(path);
    this.opendRoutesList = Manager.updateOpendRoutesList(
      this.opendRoutesList,
      path,
      this.routes,
      this.flatRoutes,
    );
    this.findShouldUnloadPath();
    this.pushNewRouteToLastTwoRoutes(menu, path);
    if (this.lastTwoRoutes.length === 2) {
      const preRoute = this.lastTwoRoutes[0];
      const currentRoute = this.lastTwoRoutes[1];
      const { onHide } = this.routes[preRoute].events;
      const { onShow } = this.routes[currentRoute].events;
      onShow && onShow();
      onHide && onHide();
    }
  };

  pushNewRouteToLastTwoRoutes = (menu: ILayoutMenu[], path: string) => {
    for (let i = 0; i < menu.length; i++) {
      const _menu = menu[i];
      if (_menu.path === path) {
        this.lastTwoRoutes.push(path);
        if (this.lastTwoRoutes.length > 2) {
          this.lastTwoRoutes.shift();
        }
        break;
      }
      if (_menu.routes) {
        this.pushNewRouteToLastTwoRoutes(_menu.routes || [], path);
      }
    }
  };

  bindTabFunction = (closeFn: Function) => {
    this.closeTabFunctionFromLayout = closeFn;
  };

  findShouldUnloadPath = (path?: string) => {
    let overflowList: string[] = [];
    if (path) {
      overflowList = [path];
    }
    const overflowCount = this.opendRoutesList.length - this.MAX_COUNT;
    if (overflowCount > 0) {
      overflowList = this.opendRoutesList.slice(0, overflowCount);
      this.unloadComponent(overflowList);
    }
  };

  postMessage = (path: string, data: any, callback?: Function) => {
    if (!this.routes[path]) {
      return;
    }
    const { onMessage } = this.routes[path].events;
    const { unload } = this.routes[path];
    if (onMessage && !unload) {
      this.forceUpdateWithMessagePath = path;
      onMessage(data);
      callback && callback()
    } else {
      console.warn(
        '消息发送失败, 可能目标页面还没打开, 或者没有绑定 onMessage 事件',
      );
    }
  };

  addRoute = (route: IMenu, path: string) => {
    if (!this.routes[path]) {
      this.routes[path] = route;
    } else {
      this.routes[path].unload = false;
      this.routes[path].setChildren(route.getChildren());
    }
  };

  getQuery = () => {
    return getQueryByString(location.search);
  };

  getParentPath = () => {
    return (
      this.flatRoutes[this.getCurrentPath()].parentPath || this.getCurrentPath()
    );
  };
}

const manager: ManagerClass = window.tabs || new Manager();
export default manager;
