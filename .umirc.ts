import { defineConfig } from 'umi';
import routes, { RouteProps } from './config/routes';

// 配置路由时是按自己层级配的, umi需要排平的路由配置, 且只需要几个关键的参数, component, redirect, path
const handleFlatRoutes = (routers: RouteProps[], res: RouteProps[] = []) => {
  routers.forEach((route: RouteProps) => {
    const { path, component, routes, redirect } = route;
    const newRoute: any = {
      path,
    };
    component ? (newRoute.component = component) : null;
    redirect ? (newRoute.redirect = redirect) : null;
    res.push(newRoute);
    if (routes) {
      handleFlatRoutes(routes, res);
    }
  });
  return res;
};

const flatRoutes = handleFlatRoutes(routes);

export default defineConfig({
  title: '多标签框架',
  metas: [
    { charset: 'utf-8' } as any,
    { 'http-equiv': 'Expires', content: '0' },
    { 'http-equiv': 'Pragma', content: 'no-cache' },
    { 'http-equiv': 'Cache-control', content: 'no-cache' },
    { 'http-equiv': 'Cache', content: 'no-cache' },
  ],

  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  dynamicImport: {
    loading: '@/components/Loading',
  },
  routes: [
    // 可在这里配置一个登录页
    { path: '/login', component: '@/pages/login' },
    // 404页面
    { path: '/notfound', component: '@/pages/404'},
    {
      component: '@/layouts',
      path: '/',
      routes: flatRoutes,
    },
  ],
});
