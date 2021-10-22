import { MenuProps, IMenu, RoutesEventProps } from './interface';

class Menu implements IMenu {
  key: string;
  path: string;
  show: boolean;
  title: string;
  showParent?: boolean;
  unload: boolean;
  children?: React.ReactElement | null;
  parentPath: string;
  routes?: IMenu[];
  redirect?: string;
  component?: string;
  icon?: string;
  events: RoutesEventProps;
  // 保存地址栏参数, 关闭标签页后跳转到当前页时用
  queryString: string

  constructor(params: MenuProps) {
    const { path, show, children, routes, showParent } = params;
    this.key = path;
    this.path = path;
    this.show = show;
    this.showParent = showParent;
    this.children = children || null;
    this.routes = routes;
    this.title = '';
    this.component = '';
    this.icon = '';
    this.parentPath = '';
    this.unload = false;
    this.queryString = ''
    this.events = {
      onShow: null,
      onHide: null,
      onRefresh: null,
      onMessage: null,
      onClose: null,
      postMessage: null,
      onConfirmClose: null,
      onQuery: null,
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

  setRoutesOptions = (
    title: string,
    redirect: string,
    icon: string,
    component: string,
    parentPath: string,
  ) => {
    this.title = title;
    this.redirect = redirect;
    this.icon = icon;
    this.component = component;
    this.parentPath = parentPath;
  };

  unloadComponent = () => {
    this.unload = true;
    this.children = null;
  };
}

export default Menu;
