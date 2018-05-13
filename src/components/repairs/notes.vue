<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>报修管理</el-breadcrumb-item>
        <el-breadcrumb-item>报修记录</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-table :data="notes" style="width: 100%;padding-top: 15px;">
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column prop="done" label="完成"  width="80" align="center" sortable>
          <template slot-scope="scope" >
            <i class="el-icon-success "style="color:green;font-size:22px; " v-if="scope.row.done" ></i>
            <i class="el-icon-success hoverAnimate" style="font-size:22px; "  v-else  @click="changedone(scope.row)"> </i>
          </template>
        </el-table-column>
        <el-table-column prop="deviceId" label="设备ID" width="100" align="center" sortable>
        </el-table-column>
        <el-table-column prop="connectName" label="报修人" width="100" align="center">
        </el-table-column>
        <el-table-column prop="connectTel" label="联系方式" width="120" align="center">
        </el-table-column>
        <el-table-column prop="repairContent" label="报修信息" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="CreateTime" label="登记时间" width="195" align="center" sortable>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="font-size:24px;color:#f56c6c; "@click="delNote(scope.$index,scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <!--<el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>-->
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
      </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_repairs';

  export default{
    data(){
      return {
        total: 10,
        page: 1,
        limit: 10,
        sels: [], //列表选中列
        notes:[]
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.done == 1 ? '男' : row.done == 0 ? '女' : '未知';
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
          limit: 10
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          if (result && result.notes) {
            that.total = result.total;
            that.notes = result.notes;
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
      //完成报修
      changedone:function(row){
        let that = this;

            let para = {"_id":row._id,"done":1}
            API.update(para._id, para).then(function (result) {
              that.loading = false;
              if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
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
      },
      //删除
      delNote: function (index, row) {
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
 .el-icon-delete:hover{
    color:green;
  }
  .hoverAnimate:hover{
    color: #4dff5c;
  }
</style>
