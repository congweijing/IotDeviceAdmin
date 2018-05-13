
import * as API from './'

export default {


//新增报修记录
add: params => {
  return API.POST('/api/v1/repairs/add', params)
},

//获取记录列表
findList: params => {
  return API.POST('/api/v1/repairs/findList',params)
},

//单个删除记录
remove: id => {
  return API.DELETE(`/api/v1/repairs/delete/${id}`)
},
//更新信息
update: (id, params) => {
  return API.PUT(`/api/v1/repairs/update/${id}`, params)
},
//批量删除设备
removeBatch: params => {
  return API.DELETE(`/api/v1/repairs/batch`,params)
}

}
