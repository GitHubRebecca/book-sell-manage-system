<template>
  <div ref="mychart" class="chart" :style="{width:chartWidth,height:chartHeight}"></div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator";
import echarts from "echarts";
@Component({
  components: {}
})
export default class Charts extends Vue {
  @Prop({ type: String, default: "line" }) readonly chartType!: string; // 图表类型 line/bar/pie
  @Prop(Object) chartData!: string | null;

  @Provide() chartWidth: string = "";
  @Provide() chartHeight: string = "";

  created() {
    this.generatorWidthAndHeight();
  }

  generatorWidthAndHeight() {
    // 图表生成宽度和高度
    this.chartWidth = `${document.body.offsetWidth * 0.8}px`;
    this.chartHeight = `${document.body.offsetHeight * 0.6}px`;
  }

  mounted() {
    this.drawChart();
  }

  drawChart() {
    // 1 实例echarts对象
    let chart = echarts.init((this as any).$refs.mychart as HTMLCanvasElement);
    if (chart == undefined) {
      console.log(`echarts init dom is failed`);
      return;
    }
    switch (this.chartType) {
      case "line":
        chart.setOption((this as any).generatorLineOption());
        break;
      case "bar":
        chart.setOption((this as any).generatorBarOption());
        break;
      case "pie":
        chart.setOption((this as any).generatorPieOption());
        break;
      // default:
      //   console.log(`chartType ${this.chartType} is invalid`);
      //   break;
    }
  }

  generatorLineOption() {
    // 绘制折线图
    return {
      title: {
        text: "近一周学习量",
        subtext: "test",
        x: "center"
      },
      xAxis: {
        type: "category",
        data: (this as any).chartData.xAxisData
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: (this as any).chartData.yAxisData,
          type: "line",
          smooth: true
        }
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      }
    };
  }

  generatorBarOption() {
    return {
      title: {
        text: "近一周学习量",
        subtext: "test",
        x: "center"
      },
      xAxis: {
        type: "category",
        data: (this as any).chartData.xAxisData
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: (this as any).chartData.yAxisData,
          type: "bar",
          barWidth: "20%"
        }
      ],
      color: ["#3398DB"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%"
      }
    };
  }

  generatorPieOption() {
    // 处理数据
    let pieData = [];
    for (const index in (this as any).chartData.xAxisData) {
      pieData.push({
        value: (this as any).chartData.yAxisData[index],
        name: (this as any).chartData.xAxisData[index]
      });
    }

    return {
      title: {
        text: "近一周学习量",
        subtext: "test",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: (this as any).chartData.xAxisData
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: pieData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }
}
</script>

<style>
</style>
