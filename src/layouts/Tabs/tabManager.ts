import { history } from 'umi';
import { RouteProps } from '../../../config/routes';
import NavManager from './navManager';
import {
  setLocationQuery,
  getQueryByString,
  getLocationQuery,
  toLocaleLowerCase,
} from './utils';
import {
  ManagerClass,
  IMenu,
  ILayoutMenu,
  FlatRoutes,
  TabRoutes,
  EventName,
  ReplaceOption,
  InitParams,
} from './interface';

export { RouteProps };

const navManager = new NavManager();

const removeQuery = (path: string) => {
  if (path.indexOf('?') === -1) return path;
  return path.split('?')[0];
};

const removeRoutesQuery = (path: string) => {
  return path.replace(/\/\d+/g, '').replace(/\/\:\w+/g, '');
};

const removeAllQuery = (path: string) => {
  return removeRoutesQuery(removeQuery(path));
};

// 拍平数组
const handleFlatRoutes = (routers: RouteProps[]) => {
  let routesObj: any = {};
  const idMapToPath: any = {};
  const flatRoutes = (routers: RouteProps[], parentPath?: string) => {
    routers.forEach((route: RouteProps) => {
      let { path, routes, id } = route;
      path = removeRoutesQuery(
        toLocaleLowerCase(path.replace(/\/\:\w+/g, '')),
      ).replace(/\?/g, '');
      idMapToPath[id as number] = path;
      routesObj[path] = {
        ...route,
        path: path,
        parentPath: toLocaleLowerCase(parentPath || ''),
      };
      if (routes) {
        flatRoutes(routes, path);
      }
    });
  };
  flatRoutes(routers);
  return { routesObj, idMapToPath };
};

class TabManager implements ManagerClass {
  // 原封不动的路由
  sourceRoutes: RouteProps[];
  // 拍平的路由配置, 如: {/driver: {path: '/driver', name: '司机画像', _icon: undefined}, ...}
  flatRoutes: FlatRoutes;
  // 有权限的路由
  permissionRoutes: FlatRoutes;
  // id 对应的路由映射
  idMapToPath: any;
  // 外层导航显示的数据
  menu: ILayoutMenu[];
  // 打开后会用到的route
  routes: TabRoutes;
  // 维护两个最近操作过的页面, 触发显示和隐藏事件, 第[0]条数据为上一次打开路由, 第[1]条数据为当前打开的路由
  lastTwoRoutes: string[];
  // 已打开的路由队列
  openedRoutesListt: string[];
  // 最大标签打开数量
  MAX_COUNT: number;
  // 缓存当前打开的路由, 等同于 layouts 中的 menu
  cacheMenu: ILayoutMenu[];
  // 如果有onMessage方法需要执行, shouldComponentUpdate 应该返回 可执行的值
  forceUpdateWithMessagePath: string = '';
  // 保存onRouteChange的回调事件
  onRouteChangeCallback: Function[];

  replaceOption: ReplaceOption;

  // 强制更新
  forceUpdate: Function;

  constructor() {
    this.flatRoutes = {};
    this.permissionRoutes = {
      '/notfound': this.flatRoutes['/notfound'],
    };
    this.idMapToPath = {};
    this.sourceRoutes = [];
    this.routes = {};
    this.menu = navManager.menu;
    this.lastTwoRoutes = [];
    this.openedRoutesListt = [];
    this.MAX_COUNT = 15;
    this.cacheMenu = [];
    this.onRouteChangeCallback = [];
    this.forceUpdate = () => {};
    this.replaceOption = {
      willReplace: false,
      topPath: '',
      oldPath: '',
      newPath: '',
    };
    navManager.init(this);
  }

  init = (params: InitParams) => {
    const {route, maxCount} = params
    const { routesObj, idMapToPath } = handleFlatRoutes(route);
    this.flatRoutes = routesObj;
    this.idMapToPath = idMapToPath
    this.sourceRoutes = route
    if(maxCount && typeof maxCount === 'number'){
      this.MAX_COUNT = maxCount
    }
  };

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

  private updateopenedRoutesListt = (path: string): string[] => {
    // 对于没有component的路由不需要处理, 比如有些路由没有组件, 是直接redircet到其它路由 404(notfound) 或者
    // 没有对应路由不处理
    if (
      (this.flatRoutes[path] && !this.flatRoutes[path].component) ||
      path === '/notfound' ||
      !this.flatRoutes[path]
    ) {
      return this.openedRoutesListt;
    }
    const list = this.openedRoutesListt;
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

  private notFoundRoutes = () => {
    history.replace('/notfound');
  };

  private checkRouteExist = (path: string): boolean => {
    path = path.replace(/\/\d+/g, '');
    if (path.indexOf('?') > -1) {
      return !!this.flatRoutes[path.split('?')[0]];
    }
    return !!this.flatRoutes[path];
  };

  private shouldReplace = (path: string) => {
    let result = false;
    Object.keys(this.routes).forEach((key: string) => {
      if (this.routes[key].parentPath === path) {
        result = true;
      }
    });
    return result;
  };

  private setNewLocationState = (path: string, params: any) => {
    if (!this.routes[path]) return;
    const { children } = this.routes[path];
    if (children) {
      children.props.location.state = params;
    }
  };

  // disableExcuteOnQuery: 关闭标签后会跳转到下一个应该被打开的页面, 这种情况不执行onQuery事件
  open = (
    path: string,
    params?: any,
    disableExcuteOnQuery?: boolean,
    withState?: boolean,
  ) => {
    path = toLocaleLowerCase(path);
    // 处理直接url里带参数的情况, 不同于 open(path, {...参数})
    const realPath = removeAllQuery(path);
    if (!this.checkRouteExist(realPath)) {
      this.notFoundRoutes();
      return;
    }
    const currentPath = this.getCurrentPath();
    if (currentPath !== path) {
      const { redirect } = this.flatRoutes[realPath];
      if (redirect) {
        this.open(redirect);
      } else {
        if (this.shouldReplace(path) && !this.replaceOption.willReplace) {
          this.replace(path, params);
        }
        if (withState) {
          history.push(path, params);
          this.setNewLocationState(realPath, params);
        } else {
          let queryString = '';
          if (disableExcuteOnQuery && this.routes[realPath]) {
            queryString = this.routes[realPath].queryString;
          } else {
            // 处理带参数跳转的情况
            if (params) {
              queryString = setLocationQuery(params);
            }
          }
          history.push(path + queryString);
        }
        // 执行跳转后的onQuery方法
        if (this.routes[realPath] && !disableExcuteOnQuery && !withState) {
          const { onQuery } = this.routes[realPath].events;
          onQuery && onQuery(params);
        }

        this.excuteRouteChangeEvents(realPath);
      }
    }
  };

  openWithState = (path: string, state?: any) => {
    this.open(path, state, false, true);
  };

  replace = <T>(path: string, params?: T, widthState?: boolean) => {
    if (!this.checkRouteExist(path)) {
      this.notFoundRoutes();
      return;
    }
    const currentPath = this.getCurrentPath();
    this.replaceOption = {
      willReplace: true,
      topPath: this.getTopPath(path),
      oldPath: currentPath,
      newPath: path,
    };
    this.open(path, params, false, widthState);
    setTimeout(() => {
      this.reSetRoutesByReplace(this.replaceOption.oldPath);
    }, 100);
  };

  replaceWithState = <T>(path: string, state?: T) => {
    this.replace(path, state, true);
  };

  reSetRoutesByReplace = (oldPath: string) => {
    delete this.routes[oldPath];
    this.openedRoutesListt = TabManager.deleteOpendList(
      this.openedRoutesListt,
      oldPath,
    );
    this.replaceOption = {
      willReplace: false,
      topPath: '',
      oldPath: '',
      newPath: '',
    };
  };

  // 更新 lastTwoRoutes 数组
  onLayoutMenuChange = (menu: ILayoutMenu[]) => {
    const path = this.getCurrentPath();
    this.cacheMenu = menu;
    this.updateRoutes(path);
    this.openedRoutesListt = this.updateopenedRoutesListt(path);
    this.findShouldUnloadPath();
    this.pushNewRouteToLastTwoRoutes(menu, path);
    if (this.lastTwoRoutes.length === 2) {
      const preRoute = this.lastTwoRoutes[0];
      const currentRoute = this.lastTwoRoutes[1];
      const onHide = this.routes[preRoute]
        ? this.routes[preRoute]?.events.onHide
        : null;
      const onShow = this.routes[currentRoute]
        ? this.routes[currentRoute].events.onShow
        : null;
      onShow && onShow();
      onHide && onHide();
    }
  };

  excuteRouteChangeEvents = (path: string) => {
    this.onRouteChangeCallback.forEach((fn: Function) => {
      fn(path);
    });
  };

  findNextShouldOpenPath = (path: string): string => {
    let shouldOpenPath = '';
    // 找到当前路由后去找兄弟路由, 配合 this.openedRoutesListt 找到接下来应该显示哪一个页面
    const { parentPath } = this.routes[path];
    const siblings = Object.keys(this.routes).filter(
      (key: string) =>
        this.routes[key].parentPath === parentPath && key !== path,
    );
    if (siblings.length >= 1) {
      for (let i = 0; i < siblings.length; i++) {
        const __path = siblings[i];
        // 从后往前找, 匹配上了就显示对应路由
        for (let j = this.openedRoutesListt.length - 1; j >= 0; j--) {
          if (this.openedRoutesListt[j] === __path) {
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
      shouldOpenPath =
        this.openedRoutesListt[this.openedRoutesListt.length - 1];
    }
    return shouldOpenPath;
  };

  close = (path?: string) => {
    const isCurrentPath = path === this.getCurrentPath();
    const _path = path || this.getCurrentPath();
    // 关闭标签后要跳转的下一个页面路径
    let shouldOpenPath = '';
    // executeClose: 因为关闭事件有 onClose 和 onConfirmClose 两种, 第一种直接执行,第二种需要用户反馈后再执行
    // onConfirmClose 中的事件必须为一个 Promise
    const executeClose = () => {
      this.openedRoutesListt = TabManager.deleteOpendList(
        this.openedRoutesListt,
        _path,
      );
      shouldOpenPath = this.findNextShouldOpenPath(_path);
      // 执行 layout中的方法, 删除对应标签
      navManager.closeTab(_path);
      this.menu = navManager.menu;
      !isCurrentPath && this.forceUpdate(new Date().getTime());
      if (shouldOpenPath) {
        this.open(shouldOpenPath, null, true);
      } else {
        // 没有可打开的页面时(this.openedRoutesListt为空), 跳转到首页;
        this.open('/home');
      }
      // 延迟删除this.routes, 有些事件需要处理, 不然会出问题
      setTimeout(() => {
        delete this.routes[_path];
      }, 100);
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
  checkRouteLevel = (path: string): number => {
    if (!this.flatRoutes[path]) {
      return -1;
    }
    let level = 1;
    let parentPath = this.flatRoutes[path].parentPath;
    while (parentPath) {
      parentPath = this.flatRoutes[parentPath].parentPath;
      level++;
    }
    return level;
  };

  getCurrentPath = () => {
    // 删除后面的参数才是真实路由, 目前还没有有参数的情况
    return toLocaleLowerCase(location.pathname.replace(/\/\d+/g, ''));
  };

  getTopPath = (path?: string) => {
    let result: string | undefined = '';
    if (path && !this.flatRoutes[path]) {
      return '';
    }

    const currentPath = path || this.getCurrentPath();
    const findTopParentPath = (path: string) => {
      if (this.checkRouteExist(path)) {
        const { parentPath } = this.flatRoutes[path];
        if (parentPath) {
          findTopParentPath(parentPath);
        } else {
          result = path;
        }
      }
    };
    findTopParentPath(currentPath);
    return result || '';
  };

  // 是否显示子页面标签栏目, 如 /home 路由
  checkDisableShowSubTabs = () => {
    const topPath = this.getTopPath();
    let _disableShowSubTabs: boolean = false;
    for (let i = 0; i < this.sourceRoutes.length; i++) {
      if (this.sourceRoutes[i].path === topPath) {
        _disableShowSubTabs = !!this.sourceRoutes[i]._disableShowSubTabs;
        break;
      }
    }
    return _disableShowSubTabs;
  };

  addEventListener = (event: EventName, fn: Function) => {
    if (event === 'onRouteChange') {
      this.addRouteChangeEvents(fn);
    } else {
      if (this.routes[this.getCurrentPath()]) {
        this.routes[this.getCurrentPath()].events[event] = fn;
      }
    }
  };

  removeEventListener = (event: EventName, fn: Function) => {
    if (event === 'onRouteChange') {
      const index = this.onRouteChangeCallback.findIndex(
        (item: Function) => item === fn,
      );
      this.onRouteChangeCallback.splice(index, 1);
    } else {
      delete this.routes[this.getCurrentPath()].events[event];
    }
  };

  updateRoutes = (path: string) => {
    const { name, redirect, id, component, parentPath } =
      this.flatRoutes[path];
    const topPath = this.getTopPath(path);
    const level = this.checkRouteLevel(path);
    this.routes[path].setRoutesOptions(
      name || '',
      redirect || '',
      component || '',
      parentPath || '',
      topPath || '',
      id,
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
    if (level !== 1) {
      this.routes[topPath].setParentShowState(false);
      this.routes[topPath].setShowState(true);
    } else {
      // 如果是一级组件就显示父容器
      this.routes[topPath].setParentShowState(true);
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

  findShouldUnloadPath = (path?: string) => {
    let overflowList: string[] = [];
    if (path) {
      overflowList = [path];
    }
    const overflowCount = this.openedRoutesListt.length - this.MAX_COUNT;
    if (overflowCount > 0) {
      overflowList = this.openedRoutesListt.slice(0, overflowCount);
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
      callback && callback();
    } else {
      console.warn(
        '消息发送失败, 可能目标页面还没打开, 或者没有绑定 onMessage事件',
      );
    }
  };

  addRoute = (route: IMenu, path: string) => {
    path = toLocaleLowerCase(path);
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

  getParentPath = (path?: string) => {
    if(path){
      return this.flatRoutes[path].parentPath || path
    }
    return (
      this.flatRoutes[this.getCurrentPath()].parentPath ||
      this.getCurrentPath()
    );
  };

  addRouteChangeEvents = (fn: Function) => {
    this.onRouteChangeCallback.push(fn);
  };

  getRouteProps = (path?: string): any => {
    const _path = path || this.getCurrentPath();
    const { id, name, parentPath, pid } = this.flatRoutes[_path];
    return {
      id,
      name,
      pid,
      parentPath,
    };
  };

  checkPermission = (path: string) => {
    const permission = this.permissionRoutes[path];
    return !!permission;
  };

  goBack = () => {
    const path = this.getCurrentPath();
    const { fromPath } = this.routes[path];
    if (fromPath) {
      this.replace(fromPath);
    } else {
      const { parentPath } = this.flatRoutes[path];
      parentPath && this.replace(parentPath);
    }
  };

  updateTab = (props: any) => {
    navManager.setMenuState(props);
    this.menu = navManager.menu;
  };
}

const manager: ManagerClass = window.tabs || new TabManager();
export default manager;
