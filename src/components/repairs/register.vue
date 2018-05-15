<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设备报修</el-breadcrumb-item>
        <el-breadcrumb-item>报修登记</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    </el-col>
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules"  style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="设备ID" prop="deviceId">
          <el-select v-model="addForm.deviceId" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修人姓名" prop="connectName">
          <el-input v-model="addForm.connectName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="connectTel">
          <el-input v-model="addForm.connectTel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="报修信息" prop="repairContent">
          <el-input type="textarea" v-model="addForm.repairContent" :rows="8"  placeholder="请输入报修信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          <el-button @click.native.prevent @click.native="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
  import util from '../../common/util'
  import API from '../../api/api_repairs';
  import API1 from '../../api/api_devices'

  export default {
    data() {
      return {
        addForm: {
          deviceId:"",
          connectName:"",
          connectTel:"",
          repairContent:""
        },
        options: [],
        addLoading: false,
        addFormRules: {
          deviceId: [
            {required: true, message: '请选择设备ID', trigger: 'blur'}
          ],
          connectName: [
            {required: true, message: '请输入联系人姓名', trigger: 'blur'}
          ],
          connectTel: [
            {required: true, message: '请输入联系方式', trigger: 'blur'}
          ],
          repairContent:[
            {required: true, message: '请输入报修信息', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      //获取设备ID和名称列表
      getDeviceList(){
        let that = this;
        that.options = [];
        let params = {};
        that.loading = true;
        API1.findAllList(params).then(function (result) {
          that.loading = false;
          if(result){
            let devices = result.devices;
            devices.forEach(function(item){
              var option = {
                value : item._id,
                label : item.deviceName
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
      //新增
      addSubmit: function () {
        let that = this;




          this.$refs.addForm.validate((valid) => {
            if (valid) {
              that.loading = true;
                this.$confirm('确认提交该记录吗?', '提示', {type: 'warning'}).then(() => {
                        let para = Object.assign({}, this.addForm);
                        API.add(para).then(function (result) {
                          that.loading = false;
                          if (result && parseInt(result.errcode) === 0) {
                            that.$message.success({showClose: true, message: '新增成功', duration: 2000});
                            that.$refs['addForm'].resetFields();
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
                }).catch(() => {});
            }
          });


      },
      //清空表单
      clear(){
        this.addForm = {
          deviceId:"",
          connectName:"",
          connectTel:"",
          repairContent:""
        }
      }


    },
    mounted() {
      this.getDeviceList();
    }
  }

</script>
