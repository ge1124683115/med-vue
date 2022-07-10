export default [
  {
    path: '/system/index/count',
    method: '*',
    handle({body}) {
      return {
        "msg": "操作成功",
        "code": 200,
        "data": {
          "visitUserWeekNumberBefore": [5, 1, 2, 7, 3, 3, 2],
          "operWeekNumberBefore": [1, 2, 7, 3, 5, 1, 4],
          "operWeekNumberNow": [1, 2, 2, 2, 7, 3, 4],
          "visitUserWeekNumberNow": [0, 1, 0, 0, 0, 0, 0],
          "onlineUserNumber": 12
        }
      }
    }
  },
]
