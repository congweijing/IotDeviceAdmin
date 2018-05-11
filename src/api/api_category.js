import * as API from './'

export default {
//新增分类
add: params => {
  return API.POST('/api/v1/devicecategory/add', params)
},

//获取分类列表
findList: params => {
  return API.POST('/api/v1/devicecategory/findList',params)
},

//更新分类名称
update: (id, params) => {
  return API.PUT(`/api/v1/devicecategory/update/${id}`, params)
},

//单个删除分类
remove: id => {
  return API.DELETE(`/api/v1/devicecategory/delete/${id}`)
},

}
