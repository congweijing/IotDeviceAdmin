
import * as API from './'

export default {


//新增设备
add: params => {
  return API.POST('/api/v1/devices/add', params)
},

//获取设备列表
findList: params => {
  return API.POST('/api/v1/devices/findList',params)
},

//更新设备信息
update: (id, params) => {
  return API.PUT(`/api/v1/devices/update/${id}`, params)
},

//单个删除设备
remove: id => {
  return API.DELETE(`/api/v1/devices/delete/${id}`)
},
//批量删除设备
removeBatch: params => {
  return API.DELETE(`/api/v1/devices/batch`,params)
}

}
