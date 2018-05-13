
import * as API from './'

export default {


//新增用户
  add: params => {
  return API.POST('/api/v1/users/add', params)
},

//获取用户列表
findList: params => {
  return API.POST('/api/v1/users/findList',params)
},

//更新用户信息
update: (id, params) => {
  return API.PUT(`/api/v1/users/update/${id}`, params)
},

//单个删除用户
remove: id => {
  return API.DELETE(`/api/v1/users/delete/${id}`)
},
//批量删除用户
removeBatch: params => {
  return API.DELETE(`/api/v1/users/batch`,params)
}
}
