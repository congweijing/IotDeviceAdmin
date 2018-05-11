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
              <span >89</span>
              <!--<span>{{scene}}</span>-->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="boed">
            <div class="tubiao" style="background-color: #3a8ee6;">
              <i class="iconfont icon-icon_machine-cluster-big"></i>
            </div>
            <div class="title">设备数:<span >56</span></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="boed">
            <div class="tubiao" style="background-color: #e6661f;">
              <i class="iconfont icon-repairfill"></i>
            </div>
            <div class="title">报修待处理:<span >5656565</span></div>
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
            <div id="chartBar" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartPie" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="24">
            <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
          </el-col>
        </el-row>
      </section>

    </el-col>
  </el-row>
</template>
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

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        currentDate: new Date(),
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null
      };
    },
    mounted: function () {
      var _this = this;
      //基于准备好的dom，初始化echarts实例
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));
      this.chartBar = echarts.init(document.getElementById('chartBar'));
      this.chartLine = echarts.init(document.getElementById('chartLine'));
      this.chartPie = echarts.init(document.getElementById('chartPie'));

      this.chartColumn.setOption({
        title: { text: '设备分类数据' },
        tooltip: {},
        xAxis: {
          data: ["大棚", "水产", "家庭", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });

      this.chartBar.setOption({
        title: {
          text: 'Bar Chart',
          subtext: '数据来自网络'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      });

      this.chartLine.setOption({
        title: {
          text: 'Line Chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });

      this.chartPie.setOption({
        title: {
          text: 'Pie Chart',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  }
</script>
