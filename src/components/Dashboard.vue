<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="boed">
            <div class="tubiao" style="background-color: #0eaea5;">
              <i class="iconfont  icon-users"></i>
            </div>
            <div class="title">用户人数:
              <span >{{userTotal}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="boed">
            <div class="tubiao" style="background-color: #3a8ee6;">
              <i class="iconfont icon-icon_machine-cluster-big"></i>
            </div>
            <div class="title">设备数:<span >{{deviceTotal}}</span></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="boed">
            <div class="tubiao" style="background-color: #e6661f;">
              <i class="iconfont icon-repairfill"></i>
            </div>
            <div class="title">报修待处理:<span >{{noteTotal}}</span></div>
          </div>
        </el-col>
      </el-row>


    <el-col :span="24" class="warp-main">
      <section class="chart-container">
        <el-row>
          <el-col :span="12">
            <div id="chartColumn" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="container" style="width:100%; height:400px;"></div>
          </el-col>
        </el-row>
      </section>

    </el-col>
  </el-row>
</template>


<script>
  import echarts from 'echarts'
  import Highcharts from 'highcharts'
  import util from '../common/util'
  import API from '../api/api_devices';
  import API1 from '../api/api_user';
  import API2 from '../api/api_repairs';
  import API3 from '../api/api_test';

  export default {

    data() {
      return {
        ws:null,
        userTotal:0,
        deviceTotal:0,
        noteTotal:0,
        xAxisData:[],
        seriesData:[],
        currentDate: new Date(),
        chartColumn: null,
        options:{
          title: { text: '设备分类数据' },
          tooltip: {},
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: []
          }]
        }
      };
    },
    methods: {
      getUserTotal(){
        let that = this;
        let params = {}
        API1.getUserTotal(params).then(function (result) {
          that.userTotal = result.userTotal;
        }, function (err) {
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      getDeviceTotal(){
        let that = this;
        let params = {}
        API.getDeviceTotal(params).then(function (result) {
          that.deviceTotal = result.total;
          that.xAxisData = result.data.map(item => item.CateName);
          that.seriesData = result.data.map(item => item.count);
          that.options.xAxis.data = that.xAxisData;
          that.options.series[0].data = that.seriesData;
          that.chartColumn.setOption(that.options);
        }, function (err) {
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      getNoteTotal(){
        let that = this;
        let params = {}
        API2.getNoteTotal(params).then(function (result) {
          that.noteTotal = result.NoteTotal;
        }, function (err) {
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },

    },
    mounted: function () {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));
      this.getNoteTotal();
      this.getDeviceTotal();
      this.getUserTotal();
      var _this = this;
      //基于准备好的dom，初始化echarts实例
      this.chartColumn.setOption(this.options);

      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      });
      var chart =Highcharts.chart('container', {
        chart: {
          //type: 'spline',
          type:'line',
          backgroundColor: '#fff',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {
            load: function () {
              // set up the updating of the chart each second
              var series = this.series[0];
//              setInterval(function () {
//                let params = {}
//                API3.getValue(params).then(function (data) {
//                  var x = (new Date()).getTime();// current time
//                  var y = data.value;
//                  series.addPoint([x, y], true, true);
//                }, function (err) {
//                  that.$message.error({showClose: true, message: err.toString(), duration: 2000});
//                }).catch(function (error) {
//                  console.log(error);
//                  that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
//                });
//
//              }, 1000);
              this.ws = new WebSocket("ws://localhost:3001/");
              this.ws.onopen = function(){
                console.log('websocket open');
              }
              this.ws.onclose = function(){
                console.log('websocket close');
              }
              this.ws.onmessage = function(e){
                var data = parseInt(e.data);
                var x = (new Date()).getTime();// current time
                var y = data;
                series.addPoint([x, y], true, true);
//                console.log(data);
              }
            }
          }
        },
        title: {
          text: '实时温度'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: '温度'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
              Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
              Highcharts.numberFormat(this.y, 2);
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: 'Random data',
          data: (function () {
            // generate an array of random data
            var data = [],
              time = (new Date()).getTime(),
              i;

            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: Math.random()*40
              });
            }
            return data;
          }())
        }]
      });

//      this.ws = new WebSocket("ws://localhost:3001/");
//      this.ws.onopen = function(){
//        console.log('websocket open');
//      }
//      this.ws.onclose = function(){
//        console.log('websocket close');
//      }
//      this.ws.onmessage = function(e){
//        var data = parseInt(e.data)
//        console.log(data);
//      }
//      this.ws.send("txt");
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .chart-container {
    width: 100%;
  }
  .chart-container .el-col {
    padding: 30px 20px;
  }


  .warp{margin:5px 0 15px 0}
  .boed{height:100px;border-radius: 8px;background-color: #f2f2f2}
  .tubiao{width:120px; height:100px;float: left;border-radius: 8px;}
  .tubiao i{font-size:50px;padding-left: 30px;padding-top:20px;color: #fdfdfd;display: inline-block;}
  .title{float: left;margin-left:50px;margin-top:30px; font-size: 20px;color: #7a7a7a;}
  .notice{border:1px solid pink;height:30px;margin: 20px 10px;border-radius: 5px;color: #6f7180;text-align: center;line-height: 30px;}
  .boed i:hover{cursor: pointer; display:inline-block; transform:rotate(360deg); -webkit-transform:rotate(360deg); -moz-transform:rotate(360deg); -o-transform:rotate(360deg); -ms-transform:rotate(360deg);}
  .tubiao i{transition: all 0.3s ease-in-out;-webkit-transition: all 0.3s ease-in-out;-o-transition: all 0.3s ease-in-out;-moz-transition: all 0.3s ease-in-out;-ms-transition: all 0.3s ease-in-out;}


</style>
