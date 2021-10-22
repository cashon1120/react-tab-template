class Result {
  errorCode: number = 0;
  result: any;

  constructor(errorCode: number, result: any) {
    this.errorCode = errorCode;
    this.result = result;
  }
}

export default {
  '/common/mapkey': new Result(0, {
    ANMapJSKey: '495c8d9a9bbcea1ab0cad06c2a62edb8',
    ANMapWebKey: '9ceb50de5d785a5018d5d3a259a44027',
    BDMapKey: 'ocL8y2MMyLrKiqscttvgn4wdhkF04KEn',
    BDMapWebKey: 'CS2sClUv42EZGoZOITxOO3rfMfMmsjLA',
    GGMapKey: 'AIzaSyC7Sgm-i8pJPkU-a57rNqGUsi4ugxdqjCM',
    SEMapKey: 'cdymx',
    TMapKey: '93fa91b3c85e7d827dddc988f0b7b9e1',
  }),
  '/user/get': new Result(0, {
    id: 1,
    avatar: '',
    companyId: 1,
    nickName: '小美狗',
    userName: 'admin',
  }),
  'POST /user/login': (req: any, res: any) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body.username == 'admin' && req.body.password == '123456')
      res.json(
        new Result(0, {
          id: 1,
          token: 'bfffd94593eb48fd83da0db9a6aec72b',
          avatar: '',
          companyId: 1,
          nickName: '小美狗',
          userName: 'admin',
        }),
      );
    else res.json(new Result(1, null));
  },
  'POST /module/user/tree/list': new Result(0, [
    {
      id: 100,
      name: '首页',
      pid: 0,
      sort: 1,
      permission: 1,
    },
  ]),
};
