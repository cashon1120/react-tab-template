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
  return location.search
}
