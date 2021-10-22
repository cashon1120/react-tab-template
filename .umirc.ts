import { defineConfig } from 'umi';
import routes, { RouteProps } from './config/routes';

const handleFlatRoutes = (routers: RouteProps[], res: RouteProps[] = []) => {
  routers.forEach((route: RouteProps) => {
    const { path, component, routes, redirect } = route;
    const newRoute: RouteProps = {
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
  headScripts: [
    { src: '/servers.js', type: 'text/javascript' },
    `history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
    });`,
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
    // { path: '/login', component: '@/pages/login' },
    {
      component: '@/layouts',
      routes: flatRoutes,
    },
  ],
});
