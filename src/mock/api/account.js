export default [
  {
    path: '/api/upload',
    method: '*',
    handle ({ body }) {
      return {
        'code': 0,
        'url': 'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar'
      }
    }
  },
]
