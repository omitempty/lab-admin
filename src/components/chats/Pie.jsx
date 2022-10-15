import React from "react";
import ReactECharts from "echarts-for-react";

export default function Pie({ pieList }) {
  const option = {
    title: {
      text: "当前用户报告分类图示",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "发布数量",
        type: "pie",
        radius: "50%",
        data: pieList,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
