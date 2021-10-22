export interface RouteProps {
  path: string;
  component?: string;
  routes?: RouteProps[];
  exact?: boolean;
  redirect?: string;
  _title?: string;
  _icon?: string;
  // 禁止在导航里显示子菜单
  _disableShowSubRoutes?: boolean;
  // 禁止显示标签栏
  _disableShowSubTabs?: boolean;
  // 当打开标签数量超过最大数时禁止卸载当前组件
  _disableUnload?: boolean;
}

const routes: RouteProps[] = [
  {
    path: '/home',
    exact: true,
    _title: '首页',
    component: '@/pages/home'
  },
  {
    path: '/page1',
    _title: '页面一',
    component: '@/pages/page1',
  },
  {
    path: '/page2',
    _title: '页面二',
    component: '@/pages/page2',
  },

  {
    path: '/test',
    exact: true,
    redirect: '/test/class',
    _title: '组件测试',
    routes: [
      {
        path: '/test/class',
        component: '@/pages/testComponents/class',
        _title: 'class组件',
      },
      {
        path: '/test/function',
        component: '@/pages/testComponents/function',
        _title: '函数组件',
      },
    ],
  },

  { path: '/notFound', component: '@/pages/404' },
];
export default routes;
