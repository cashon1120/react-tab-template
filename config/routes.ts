export interface RouteProps {
  path: string;
  name: string;
  component?: string;
  routes?: RouteProps[];
  exact?: boolean;
  redirect?: string;
  // 禁止在导航里显示子菜单
  _disableShowSubRoutes?: boolean;
  // 禁止显示标签栏
  _disableShowSubTabs?: boolean;
  // 当打开标签数量超过最大数时禁止卸载当前组件
  _disableUnload?: boolean;
  // 默认参数, 如配置了 home/:class/:id, 默认参数就为 [3, 2]
  _defaultParams?: number[] | string[];
  // 父级路径, 不用手动加, 后面代码会自动加上;
  parentPath?: string;
}

const routes: RouteProps[] = [
  {
    path: '/',
    name: '介绍',
    component: '@/pages/home',
  },
  {
    path: '/page1',
    name: '页面',
    component: '@/pages/page1',
  },
  {
    path: '/test',
    name: '标签测试',
    routes: [
      {
        path: '/test/class',
        component: '@/pages/testpages/class',
        name: '测试页',
      },
      {
        path: '/test/function',
        component: '@/pages/testpages/function',
        name: '方法说明',
        routes: [
          {
            path: '/test/function/in',
            component: '@/pages/testpages/function/in',
            name: '标签内新开页',
          }
        ]
      },
    ],
  },
];
export default routes;
