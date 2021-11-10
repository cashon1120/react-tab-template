import { RouteProps } from '../../../config/routes';

export interface MenuProps {
  key: string;
  path: string;
  show: boolean;
  children?: React.ReactElement | null;
  showParent?: boolean;
  routes?: IMenu[];
  unloaded?: boolean;
  parentPath?: string;
  fromPath?: string;
}

export interface FlatRoutes {
  [path: string]: RouteProps;
}

// 页面可绑定的事件类型, 见tabs.addEventListener
export type EventName =
  | 'onShow'
  | 'onHide'
  | 'onClose'
  | 'onConfirmClose' // onConfirmClose 事件需要在里面返回一个promise
  | 'onMessage'
  | 'postMessage'
  | 'onRouteChange'
  | 'onQuery' // 其它页面带参数跳转回来要执行的方法, 参数会传过去
  | 'onRefresh'; // 还没实现刷新功能, 后期再考虑

export type RoutesEventProps = {
  [key in EventName]: Function | null;
};

interface TabRoutesProps {
  children?: React.ReactElement | null;
  unload?: boolean;
}

export interface TabRoutes {
  [path: string]: IMenu;
}

export interface ReplaceOption {
  willReplace: boolean;
  topPath: string;
  oldPath: string;
  newPath: string;
}

export interface ManagerClass {
  replaceOption: ReplaceOption;
  flatRoutes: FlatRoutes;
  sourceRoutes: RouteProps[];
  permissionRoutes: FlatRoutes;
  routes: TabRoutes;
  menu: ILayoutMenu[];
  updateMenu: (props: any) => void;
  open: (path: string, params?: any, disableExcuteOnQuery?: boolean) => void;
  openWithState: (path: string, state?: any) => void;
  replace: (path: string, params?: any, widthState?: boolean) => void;
  replaceWithState: (path: string, state?: any) => void;
  initRoutes: (route: RouteProps[]) => void;
  close: (path?: string) => void;
  unloadComponent: (path: string[]) => void;
  // 路由切换事件
  onLayoutMenuChange: (menu: ILayoutMenu[]) => void;
  // 添加切换事件: 显示 隐藏 刷新(刷新功能暂未实现)
  addEventListener: (event: EventName, fn: Function) => void;
  // 移除事件
  removeEventListener: (event: EventName, fn: Function) => void;
  // 判断Class组件是否需要更新
  shouldClassComponentUpdate: (state: any) => boolean;
  // 判断Function组件是否需要更新
  shouldFunctionComponentUpdate: (state: any) => boolean;
  // 判断当前路由的层级, 返回 1 | 2
  checkRouteLevel: (path: string) => number;
  // 是否显示标签, 目前只有首页有这需求, 见routes配置里 _disableShowSubTabs
  checkDisableShowSubTabs: () => boolean;
  // 获取当前路由地址
  getCurrentPath: () => string;
  // 获取当前路由的父级地址
  getTopPath: () => string;
  // 当超过最大标签数量时卸载组件
  findShouldUnloadPath: (path: string) => void;
  // 标签之间通信
  postMessage: (toPath: string, data: any, callback?: Function) => void;
  // 给routes添加新的页面
  addRoute: (route: IMenu, path: string) => void;
  // 获取地址栏参数, 返回 {key: value} 格式
  getQuery: () => Object;
  // 判断导航是否显示active效果
  getParentPath: (path: string) => string;
  // 获取当前标签页的权限
  getRouteProps: (path?: string) => {
    id: number;
    name: string;
    pid: number;
    permission: number;
    parentPath: string;
    parentPermission: number;
  };
  checkPermission: (path: string) => boolean;
  goBack: () => void;
  forceUpdate: Function;
}

// 很多属性其实是可以直接获取的, 不需要如getShowState之类的方法, 是为了方便以后扩展, 可能会触发一些事件
export interface IMenu extends TabRoutesProps {
  events: RoutesEventProps;
  parentPath: string;
  fromPath?: string;
  queryString: string;
  redirect?: string;
  component?: string;
  unload?: boolean;
  permission?: number;
  id?: number;
  setChildren: (ele: React.ReactElement | null) => void;
  getPath: () => string;
  getChildren: () => React.ReactElement | null;
  getShowState: () => boolean;
  setShowState: (state: boolean) => void;
  getParentShowState: () => boolean;
  setParentShowState: (state: boolean) => void;
  getRoutes: () => IMenu[] | [];
  setRoutesOptions: (
    title: string,
    redirect: string,
    component: string,
    parentPath: string,
    topPath: string,
    id: number | undefined,
  ) => void;
  getTitle: () => string;
  setTitle: (title: string) => void;
  unloadComponent: () => void;
}

export interface ILayoutMenu {
  path: string;
  routes: ILayoutMenu[];
}
