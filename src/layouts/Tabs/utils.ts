import { RouteProps } from '../../../config/routes';

export const setLocationQuery = (params: any) => {
  if (typeof params !== 'object') {
    console.warn('传入参数必须为object');
    return '';
  }
  let res: string[] = [];
  Object.keys(params).forEach((key: string) => {
    res.push(`${key}=${params[key]}`);
  });

  return `?${res.join('&')}`;
};

export const getQueryByString = (params: string) => {
  const res: any = {};
  if (params === '') {
    return '';
  }
  const querys = params.replace('?', '').split('&');
  querys.forEach((query: string) => {
    const [key, value] = query.split('=');
    res[key] = Number(value) ? Number(value) : value;
  });
  return res;
};

export const getLocationQuery = () => {
  return location.search;
};

export const toLocaleLowerCase = (str: string) => {
  return str.toLocaleLowerCase();
};

export const removeQuery = (path: string) => {
  if (path.indexOf('?') === -1) return path;
  return path.split('?')[0];
};

export const removeRoutesQuery = (path: string) => {
  return path.replace(/\/\d+/g, '').replace(/\/\:\w+/g, '');
};

export const removeAllQuery = (path: string) => {
  return removeRoutesQuery(removeQuery(path));
};

// 拍平路由
export const handleFlatRoutes = (routers: RouteProps[]) => {
  let routesObj: any = {};
  const flatRoutes = (routers: RouteProps[], parentPath?: string) => {
    routers.forEach((route: RouteProps) => {
      let { path, routes } = route;
      path = removeRoutesQuery(
        toLocaleLowerCase(path.replace(/\/\:\w+/g, '')),
      ).replace(/\?/g, '');
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
  return routesObj
};
