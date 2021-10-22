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
}

interface FlatRoutesProps extends RouteProps {
  parentPath: string;
}
export interface FlatRoutes {
  [path: string]: FlatRoutesProps;
}

// 页面可绑定的事件类型, 见tabs.addEventListener
export type EventName =
  | 'onShow'
  | 'onHide'
  | 'onClose'
  | 'onConfirmClose' // onConfirmClose 事件需要在里面返回一个promise
  | 'onMessage'
  | 'postMessage'
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

export interface ManagerClass {
  routes: TabRoutes;
  open: (path: string, params?: any, disableExcuteOnQuery?: boolean) => void;
  close: (path?: string) => void;
  unloadComponent: (path: string[]) => void;
  // 路由切换事件
  onRouteChange: (menu: ILayoutMenu[]) => void;
  // 添加切换事件: 显示 隐藏 刷新(刷新功能暂未实现)
  addEventListener: (event: EventName, fn: Function) => void;
  // 判断Class组件是否需要更新
  shouldClassComponentUpdate: (state: any) => boolean;
  // 判断Function组件是否需要更新
  shouldFunctionComponentUpdate: (state: any) => boolean;
  // 判断当前路由的层级, 返回 1 | 2
  checkRouteLevel: (path: string) => -1 | 1 | 2;
  // 是否显示标签, 目前只有首页有这需求, 见routes配置里 _disableShowSubTabs
  checkDisableShowSubTabs: () => boolean;
  // 获取当前路由地址
  getCurrentPath: () => string;
  // 获取当前路由的父级地址
  getCurrnetParentPath: () => string;
  // 当超过最大标签数量时卸载组件
  findShouldUnloadPath: (path: string) => void;
  // 绑定卸载和关闭标签方法
  bindTabFunction: (scloseFn: Function) => void;
  // 标签之间通信
  postMessage: (toPath: string, data: any) => void;
  // 给routes添加新的页面
  addRoute: (route: IMenu, path: string) => void;
  // 获取地址栏参数, 返回 {key: value} 格式
  getQuery: () => Object;
}

// 很多属性其实是可以直接获取的, 不需要如getShowState之类的方法, 是为了方便以后扩展, 可能会触发一些事件
export interface IMenu extends TabRoutesProps {
  events: RoutesEventProps;
  parentPath: string;
  queryString: string;
  redirect?: string;
  component?: string;
  unload?: boolean;
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
    icon: string,
    component: string,
    parentPath: string,
  ) => void;
  getTitle: () => string;
  unloadComponent: () => void;
}

export interface ILayoutMenu {
  path: string;
  routes: ILayoutMenu[];
}
