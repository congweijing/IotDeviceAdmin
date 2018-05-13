<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="设备名称" @keyup.enter.native="handleSearch"></el-input>
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
      <el-table :data="devices" highlight-current-row border @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="_id" label="设备ID" width="160" sortable></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="160" sortable></el-table-column>
        <el-table-column prop="deviceCate" label="设备分类" width="160" sortable></el-table-column>
        <el-table-column prop="deviceStatus" label="当前状态" width="160" :formatter="formatStatus"  sortable></el-table-column>
        <el-table-column prop="deviceRemark" label="备注" width="160" sortable></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delDevice(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteDevice" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="设备ID" prop="_d">
            <el-input v-model="editForm._id" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="editForm.deviceName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备分类" prop="deviceCate">
            <el-select v-model="editForm.deviceCate" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="deviceRemark">
            <el-input type="textarea" v-model="editForm.deviceRemark" :rows="8"></el-input>
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
          <el-form-item label="设备ID" prop="deviceId">
            <el-input v-model="addForm.deviceId" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="addForm.deviceName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备分类" prop="deviceCate">
            <el-select v-model="addForm.deviceCate" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="deviceRemark">
            <el-input type="textarea" v-model="addForm.deviceRemark" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_devices';
  import API1 from '../../api/api_category';

  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        devices:[],
        options: [],
        value: '',
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          _id: [
            {required: true, message: '请输入设备ID', trigger: 'blur'}
          ],
          deviceName: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          deviceCate: [
            {required: true, message: '请输入设备分类', trigger: 'blur'}
          ]
        },
        editForm: {
          _id:"",
          deviceName:"",
          deviceCate:"",
          deviceRemark:""
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          deviceId: [
            {required: true, message: '请输入设备ID', trigger: 'blur'}
          ],
          deviceName: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          deviceCate: [
            {required: true, message: '请输入设备分类', trigger: 'blur'}
          ]
        },
        addForm: {
          deviceId:"",
          deviceName:"",
          deviceCate:"",
          deviceRemark:""
        }
      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.deviceStatus == 1 ? '已租' : row.deviceStatus == 0 ? '空闲' : '未知';
      },
      //获取分类列表
      getCategoryList(){
        let that = this;
        that.options = [];
        let params = {};
        that.loading = true;
        API1.findList(params).then(function (result) {
          that.loading = false;
          if(result){
            result.forEach(function(item){
              var option = {
                value : item._id,
                label : item.CateName
              };
              that.options.push(option);
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
          if (result && result.devices) {
            that.total = result.total;
            that.devices = result.devices;
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
      delDevice: function (index, row) {
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
        console.log(this.editForm);
        this.getCategoryList();
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
          deviceId:"",
          deviceName:"",
          deviceCate:"",
          deviceRemark:""
        };
        this.getCategoryList();
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
      //批量删除
      batchDeleteDevice: function () {
        let ids = this.sels.map(item => item._id).toString();
//        let ids = this.sels.map(item => item._id);
        let param = {ids:ids};
        console.log(param);
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
      },


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
  .toolbar{
    margin:10px 0;
  }
</style>
