const info = [
  {
    path: '/enterprise/profile',
    method: 'get',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
        data: {
          name: 'minio',
          principal: '小小',
          telephone: '13926096022',
          address: '江苏省苏州市吴中区吴中大道1188号',
          remark: '',
        }
      }
    }
  },
  {
    path: '/enterprise/profile',
    method: 'update',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
      }
    }
  },
]
const branch = [
  {
    path: '/enterprise/store/list',
    method: '*',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
        pageNum: 1,
        pageSize: 5,
        total: 5,
        rows: [
          {name: '万达店',principal:'小小',principalContact:'13926096022',status: 1},
          {name: '万科店',principal:'大大',principalContact:'13926096023',status: 1},
          {name: '永旺店',principal:'大小',principalContact:'13926096024',status: 0},
          {name: '天河店',principal:'小大',principalContact:'13926096025',status: 1},
        ]
      }
    }
  },
]
export default branch.concat(info)
