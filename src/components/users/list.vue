<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>

        <el-table-column prop="_id" label="ID" width="120" sortable>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="userSex" label="性别" width="120" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="userTel" label="联系方式" width="120"  sortable>
        </el-table-column>
        <el-table-column prop="userAddr" label="地址" min-width="160" sortable>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="该用户所租用的产品：">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="showOrderDialog(scope.$index,scope.row)">订单</el-button>
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delUser(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteUser" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="editForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="editForm.userSex" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式" prop="userTel">
            <el-input v-model="editForm.userTel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="userAddr">
            <el-input v-model="editForm.userAddr" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="addForm.userName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userSex">
            <el-select v-model="addForm.userSex" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系方式" prop="userTel">
            <el-input v-model="addForm.userTel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="userAddr">
            <el-input v-model="addForm.userAddr" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <!--穿梭框-->
      <el-dialog v-bind:title="orderForm.userName" :visible.sync ="orderVisible" :close-on-click-modal="false">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入设备名称"
          :titles="['可选设备', '已选设备']"
          v-model="rightData"
          :data="leftData">
        </el-transfer>


        <div slot="footer" class="dialog-footer">
          <el-button @click.native="orderVisible = false">取消</el-button>
          <el-button type="primary" @click.native="orderSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_user';
  import API1 from '../../api/api_devices'

  export default{
    data(){
      const generateleftData = _ => {
        const data = [];
        const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
        const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
        cities.forEach((city, index) => {
          data.push({
          label: city,
          key: city,
          pinyin: pinyin[index]
        });
      });
        return data;
      };
      return {
        filters: {
          name: ''
        },
        users:[],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列

        options:[
          {label:"男",value:0},
          {label:"女",value:1}
        ],
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          userSex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ],
          userTel: [
            {required: true, message: '请输入联系方式', trigger: 'blur'}
          ],
          userAddr: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ]
        },
        editForm: {
          userName:"",
          userSex:0,
          userTel:"15345644564",
          userAddr:"北京市"
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          userSex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ],
          userTel: [
            {required: true, message: '请输入联系方式', trigger: 'blur'}
          ],
          userAddr: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ]
        },
        addForm: {
          userName:"",
          userSex:0,
          userTel:"",
          userAddr:""
        },
        //穿梭框相关数据
        orderVisible:false, //穿梭框是否显示
        leftData: [],
        rightData: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        orderForm:{},
        oldOrder:[]
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.userSex == 1 ? '女' : row.userSex == 0 ? '男' : '未知';
      },
//      获取用户订单对应的设备信息
      getUserOrder(orderArray){
        let ids = orderArray.toString();
        let param = {ids:ids};
        let that = this;
        API1.findListByIds(param).then(function (result) {
//          that.loading = false;
          console.log(result.devices);
          if(result.devices){
            let devices = result.devices;
            devices.forEach(function(item){
              var data = {
                key : item._id,
                label : item.deviceName
              };
              that.rightData.push(data);
            })
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      //获取设备列表 status为0
      getFreeDeviceList(){
        let that = this;
        let params = {};
        API1.findListByStatus(params).then(function (result) {
          that.loading = false;
          console.log(result.devices);
          if(result.devices){
            let devices = result.devices;
            devices.forEach(function(item){
              var data = {
                key : item._id,
                label : item.deviceName
              };
              that.leftData.push(data);
            })
          }

        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      search(){
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.users) {
            that.total = result.total;
            that.users = result.users;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delUser: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
        API.remove(row._id).then(function (result) {
          that.loading = false;
          if (result && parseInt(result.errcode) === 0) {
            that.$message.success({showClose: true, message: '删除成功', duration: 1500});
            that.search();
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            API.update(para._id, para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                that.$refs['editForm'].resetFields();
                that.editFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          userName:"",
          userSex:0,
          userTel:"",
          userAddr:""
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            let para = Object.assign({}, this.addForm);
            API.add(para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '新增成功', duration: 2000});
                that.$refs['addForm'].resetFields();
                that.addFormVisible = false;
                that.search();
              } else {
                that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });

          }
        });
      },
      //显示oderDialog
      showOrderDialog:function(index, row){
        this.orderVisible = true;
        this.orderForm = Object.assign({}, row);
        this.oldOrder = Object.assign({}, row).userOrder;
        console.log(this.oldOrder);
        this.getUserOrder(this.oldOrder);
        this.getFreeDeviceList();
      },
//      提交新的订单
      orderSubmit:function(){
        let that = this;
        console.log(that.rightData);
        console.log(that.oldOrder);

        let ids = {"idsa":"","idsb":""};
        ids.idsa = that.oldOrder.filter( x => that.rightData.indexOf(x) == -1).toString(); //用户删除的订单，状态status改为0
        ids.idsb = that.rightData.filter( x => that.oldOrder.indexOf(x) == -1).toString(); //用户新增的订单，状态status改为1
        console.log(ids);
//        let ids = this.rightData.toString();
//        let param = {ids:ids};
//        API1.updateBatch(ids).then(function (result) {
//          that.loading = false;
//          if (result && parseInt(result.errcode) === 0) {
//            that.$message.success({showClose: true, message: '更新成功', duration: 1500});
//            that.search();
//          }
//        }, function (err) {
//          that.loading = false;
//          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
//        }).catch(function (error) {
//          that.loading = false;
//          console.log(error);
//          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
//        });
      },

      //批量删除
      batchDeleteUser: function () {
        let ids = this.sels.map(item => item._id).toString();
        let param = {ids:ids};
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
        API.removeBatch(param).then(function (result) {
          that.loading = false;
          if (result && parseInt(result.errcode) === 0) {
            that.$message.success({showClose: true, message: '删除成功', duration: 1500});
            that.search();
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      }).catch(() => {

        });
      }
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
