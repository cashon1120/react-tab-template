import { MenuProps, IMenu, RoutesEventProps } from './interface';

class Menu implements IMenu {
  key: string;
  path: string;
  show: boolean;
  title: string;
  unload: boolean;
  // 保存地址栏参数, 关闭标签页后跳转到当前页时用
  queryString: string;
  showParent?: boolean;
  children?: React.ReactElement | null;
  parentPath: string;
  topPath: string;
  routes?: IMenu[];
  redirect?: string;
  component?: string;
  fromPath?: string;
  events: RoutesEventProps;

  constructor(params: MenuProps) {
    const { path, show, children, routes, showParent, fromPath } = params;
    this.key = path;
    this.path = path;
    this.show = show;
    this.showParent = showParent;
    this.children = children || null;
    this.fromPath = fromPath;
    this.routes = routes;
    this.title = '';
    this.component = '';
    this.parentPath = '';
    this.topPath = '';
    this.unload = false;
    this.queryString = '';
    this.events = {
      onShow: null,
      onHide: null,
      onRefresh: null,
      onMessage: null,
      onClose: null,
      postMessage: null,
      onConfirmClose: null,
      onQuery: null,
      onRouteChange: null,
    };
  }

  setChildren = (ele: React.ReactElement | null) => {
    this.unload = false;
    this.children = ele;
  };

  getPath = () => {
    return this.path;
  };

  getChildren = () => {
    return this.children || null;
  };

  getShowState = () => {
    return !!this.show;
  };

  setShowState = (state: boolean) => {
    this.show = state;
  };

  getParentShowState = () => {
    return !!this.showParent;
  };

  setParentShowState = (state: boolean) => {
    this.showParent = state;
  };

  getRoutes = () => {
    return this.routes || [];
  };

  getTitle = () => {
    return this.title;
  };

  setTitle = (title: string) => {
    this.title = title;
  };

  setRoutesOptions = (
    title: string,
    redirect: string,
    component: string,
    parentPath: string,
    topPath: string,
  ) => {
    this.title = title;
    this.redirect = redirect;
    this.component = component;
    this.parentPath = parentPath;
    this.topPath = topPath;
  };

  unloadComponent = () => {
    this.unload = true;
    this.children = null;
  };
}

export default Menu;
