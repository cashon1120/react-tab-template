export interface RouteProps {
  path: string;
  id: number;

  pid?: number;
  component?: string;
  routes?: RouteProps[];
  exact?: boolean;
  children?: RouteProps[];
  redirect?: string;
  parentPath?: string;
  name?: string;
  // 禁止在导航里显示子菜单
  _disableShowSubRoutes?: boolean;
  // 禁止显示标签栏
  _disableShowSubTabs?: boolean;
  // 当打开标签数量超过最大数时禁止卸载当前组件
  _disableUnload?: boolean;
  // 默认参数, 如配置了 home/:class/:id, 默认参数就为 '/3/2'
  _defaultParams?: number[] | string[];
}

const routes: RouteProps[] = [
  {
    path: '/',
    exact: true,
    name: '首页',
    component: '@/pages/home',
    id: 100,
  },
  {
    path: '/page1',
    exact: true,
    name: 'page1',
    component: '@/pages/page1',
    id: 200,
  },
  {
    path: '/test',
    exact: true,
    name: '标签测试',
    id: 300,
    routes: [
      {
        path: '/test/class',
        component: '@/pages/testpages/class',
        name: '测试页',
        id: 3001,
        pid: 400,
      },
      {
        path: '/test/function',
        component: '@/pages/testpages/function',
        name: '方法说明',
        id: 4002,
        pid: 400,
        routes: [
          {
            path: '/test/function/in',
            component: '@/pages/testpages/function/in',
            name: '标签内新开页',
            id: 4002,
            pid: 400,
          }
        ]
      },
    ],
  },

  { path: '/notfound', component: '@/pages/404', id: -1 },
];
export default routes;
