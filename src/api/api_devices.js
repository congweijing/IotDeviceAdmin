
import * as API from './'

export default {


//新增设备
add: params => {
  return API.POST('/api/v1/devices/add', params)
},

//根据页码获取设备列表
findAllList: params => {
  return API.POST('/api/v1/devices/findAllList',params)
},

//根据页码获取设备列表
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
},
//根据status获取设备列表
findListByStatus: params => {
  return API.POST('/api/v1/devices/findListByStatus',params)
},
//根据ids批量获取设备列表
findListByIds: params => {
  return API.POST('/api/v1/devices/findListByIds',params)
},
//根据ids批量更新设备的status
updateStatusBatch:params => {
  return API.POST(`/api/v1/devices/updateStatusBatch`,params)
},
//获取设备总数以及不同分类下的设备数量
getDeviceTotal: params => {
  return API.POST('/api/v1/devices/getDeviceTotal',params)
}

}
