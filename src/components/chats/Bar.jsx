import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

export default function Bar({ barList }) {
  const option = {
    title: {
      text: "报告分类图示",
    },
    tooltip: {},
    legend: {
      data: ["数量"],
    },
    xAxis: {
      data: Object.keys(barList),
      axisLabel: {
        rotate: "45",
        interval: 0,
      },
    },
    yAxis: {
      minInterval: 1,
    },
    series: [
      {
        name: "数量",
        type: "bar",
        data: Object.values(barList).map((item) => item.length),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}
