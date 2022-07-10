const category = [
  {
    path: '/product/category/list',
    method: '*',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
        pageNum: 1,
        pageSize: 5,
        total: 5,
        rows: [
          {name: '液体', status: 1},
          {name: '调味粉', status: 0},
        ]
      }
    }
  },
]
const item = [
  {
    path: '/product/item/list',
    method: '*',
    handle({body}) {
      return {
        msg: "操作成功",
        code: 200,
        pageNum: 1,
        pageSize: 5,
        total: 5,
        rows: [
          {name: '五粮液',openedShelfLife:'1M',measurement:0,status: 1},
          {name: '奶油',openedShelfLife:'3d',measurement:1,status: 1},
          {name: '红茶',openedShelfLife:'1y',measurement:2,status: 0},
          {name: '鸡精',openedShelfLife:'15d',measurement:4,status: 1},
        ]
      }
    }
  },
]
export default item.concat(category)
