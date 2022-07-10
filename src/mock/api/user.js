const list = [
  {
    path: '/user/list',
    method: 'get',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
        pageNum: 1,
        pageSize: 5,
        total: 5,
        rows: [
          {loginNo:'admin',name:'管理员',mobile:'15626919256',type:1,state:'启用',updateTime:'2019-11-03 00:08:07'},
          {loginNo:'hamster',name:'仓鼠',mobile:'13926096022',type:2,state:'禁用',updateTime:'2021-12-01 00:08:07'},
        ]
      }
    }
  },
]

export default list
