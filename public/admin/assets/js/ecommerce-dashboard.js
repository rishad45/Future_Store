(function (factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function () {
  "use strict";

  const docReady = (e) => {
    "loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", e)
      : setTimeout(e, 1);
  };
  const resize = (e) => window.addEventListener("resize", e);
  const camelize = (e) => {
    const t = e.replace(/[-_\s.]+(.)?/g, (e, t) => (t ? t.toUpperCase() : ""));
    return `${t.substr(0, 1).toLowerCase()}${t.substr(1)}`;
  };
  const getData = (e, t) => {
    try {
      return JSON.parse(e.dataset[camelize(t)]);
    } catch (o) {
      return e.dataset[camelize(t)];
    }
  };
  const getColor = (e, t = document.documentElement) =>
    getComputedStyle(t).getPropertyValue(`--phoenix-${e}`).trim();
  const getDates = (e, t, o = 864e5) => {
    const r = (t - e) / o;
    return Array.from(
      { length: r + 1 },
      (t, r) => new Date(e.valueOf() + o * r)
    );
  };
  const getPastDates = (e) => {
    let t;
    switch (e) {
      case "week":
        t = 7;
        break;
      case "month":
        t = 30;
        break;
      case "year":
        t = 365;
        break;
      default:
        t = e;
    }
    const o = new Date(),
      r = o,
      s = new Date(new Date().setDate(o.getDate() - (t - 1)));
    return getDates(s, r);
  };

  const { merge: merge } = window._;
  const echartSetOption = (e, t, o) => {
    e.setOption(merge(o(), t));
  };
  const tooltipFormatter = (e, t = "MMM DD") => {
    let o = "";
    return (
      e.forEach((e) => {
        o += `<div class='ms-1'>\n        <h6 class="text-700"><span class="fas fa-circle me-1 fs--2" style="color:${
          e.borderColor ? e.borderColor : e.color
        }"></span>\n          ${e.seriesName} : ${
          "object" == typeof e.value ? e.value[1] : e.value
        }\n        </h6>\n      </div>`;
      }),
      `<div>\n            <p class='mb-2 text-600'>\n              ${
        window.dayjs(e[0].axisValue).isValid()
          ? window.dayjs(e[0].axisValue).format(t)
          : e[0].axisValue
      }\n            </p>\n            ${o}\n          </div>`
    );
  };

  
  
  const totalSalesChartInit = () => {
    const o = document.querySelector(".echart-total-sales-chart"),
      t = getDates(new Date("9/1/2022"), new Date("9/30/2022"), 864e5),
      e = [
        100, 20, 30, 30, 30, 250, 200, 200, 200, 200, 200, 500, 500, 500,
        600, 700, 800, 900, 1e3, 1100, 850, 600, 600, 600, 400, 200, 200, 300,
        300, 300,
      ],
      a = [
        200, 200, 100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 200, 400,
        600, 600, 600, 800, 1e3, 700, 400, 450, 500, 600, 700, 650, 600, 550,
      ],
      i = (o) => {
        const t = window.dayjs(o[0].axisValue),
          e = window.dayjs(o[0].axisValue).subtract(1, "month"),
          a = o.map((o, a) => ({
            value: o.value,
            date: a > 0 ? e : t,
            color: o.color,
          }));
        let i = "";
        return (
          a.forEach((o, t) => {
            i += `<h6 class="fs--1 text-700 ${
              t > 0 && "mb-0"
            }"><span class="fas fa-circle me-2" style="color:${
              o.color
            }"></span>\n      ${o.date.format("MMM DD")} : ${
              o.value
            }\n    </h6>`;
          }),
          `<div class='ms-1'>\n              ${i}\n            </div>`
        );
      };
    if (o) {
      const r = getData(o, "echarts"),
        l = window.echarts.init(o);
      echartSetOption(l, r, () => ({
        color: [getColor("primary"), getColor("info")],
        tooltip: {
          trigger: "axis",
          padding: 10,
          backgroundColor: getColor("gray-100"),
          borderColor: getColor("gray-300"),
          textStyle: { color: getColor("dark") },
          borderWidth: 1,
          transitionDuration: 0,
          axisPointer: { type: "none" },
          formatter: i,
        },
        xAxis: [
          {
            type: "category",
            data: t,
            axisLabel: {
              formatter: (o) => window.dayjs(o).format("DD MMM"),
              interval: 13,
              showMinLabel: !0,
              showMaxLabel: !1,
              color: getColor("gray-800"),
              align: "left",
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
            axisLine: { show: !0, lineStyle: { color: getColor("gray-200") } },
            axisTick: { show: !1 },
            splitLine: {
              show: !0,
              interval: 0,
              lineStyle: { color: getColor("gray-200") },
            },
            boundaryGap: !1,
          },
          {
            type: "category",
            position: "bottom",
            data: t,
            axisLabel: {
              formatter: (o) => window.dayjs(o).format("DD MMM"),
              interval: 130,
              showMaxLabel: !0,
              showMinLabel: !1,
              color: getColor("gray-800"),
              align: "right",
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            splitLine: { show: !1 },
            boundaryGap: !1,
          },
        ],
        yAxis: {
          position: "right",
          axisPointer: { type: "none" },
          axisTick: "none",
          splitLine: { show: !1 },
          axisLine: { show: !1 },
          axisLabel: { show: !1 },
        },
        series: [
          {
            name: "d",
            type: "line",
            data: e,
            showSymbol: !1,
            symbol: "circle",
          },
          {
            name: "e",
            type: "line",
            data: a,
            lineStyle: { type: "dashed", width: 1, color: getColor("info") },
            showSymbol: !1,
            symbol: "circle",
          },
        ],
        grid: {
          right: 2,
          left: 5,
          bottom: "20px",
          top: "2%",
          containLabel: !1,
        },
        animation: !1,
      })),
        resize(() => {
          l.resize();
        });
    }
  };

  const newCustomersChartsInit = () => {
    const t = document.querySelector(".echarts-new-customers");
    if (t) {
      const o = getData(t, "echarts"),
        e = window.echarts.init(t);
      echartSetOption(e, o, () => ({
        tooltip: {
          trigger: "item",
          padding: [7, 10],
          backgroundColor: getColor("gray-100"),
          borderColor: getColor("gary-300"),
          textStyle: { color: getColor("dark") },
          borderWidth: 1,
          transitionDuration: 0,
        },
        xAxis: [
          {
            type: "category",
            data: getDates(new Date("5/1/2022"), new Date("5/7/2022"), 864e5),
            show: !0,
            boundaryGap: !1,
            axisLine: { show: !0, lineStyle: { color: getColor("gray-200") } },
            axisTick: { show: !1 },
            axisLabel: {
              formatter: (t) => window.dayjs(t).format("DD MMM"),
              showMinLabel: !0,
              showMaxLabel: !1,
              color: getColor("gray-800"),
              align: "left",
              interval: 5,
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
          },
          {
            type: "category",
            position: "bottom",
            show: !0,
            data: getDates(new Date("5/1/2022"), new Date("5/7/2022"), 864e5),
            axisLabel: {
              formatter: (t) => window.dayjs(t).format("DD MMM"),
              interval: 130,
              showMaxLabel: !0,
              showMinLabel: !1,
              color: getColor("gray-800"),
              align: "right",
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
            axisLine: { show: !1 },
            axisTick: { show: !1 },
            splitLine: { show: !1 },
            boundaryGap: !1,
          },
        ],
        yAxis: { show: !1, type: "value", boundaryGap: !1 },
        series: [
          {
            type: "line",
            data: [150, 100, 300, 200, 250, 180, 250],
            showSymbol: !1,
            symbol: "circle",
            lineStyle: { width: 2, color: getColor("gray-200") },
            emphasis: { lineStyle: { color: getColor("gray-200") } },
          },
          {
            type: "line",
            data: [200, 150, 250, 100, 500, 400, 600],
            lineStyle: { width: 2, color: getColor("primary") },
            showSymbol: !1,
            symbol: "circle",
          },
        ],
        grid: { left: 0, right: 0, top: 5, bottom: 20 },
      })),
        resize(() => {
          e.resize();
        });
    }
  };

  const { echarts: echarts$2 } = window,
    topCouponsChartInit = () => {
      const e = document.querySelector(".echart-top-coupons");
      if (e) {
        const o = getData(e, "options"),
          t = echarts$2.init(e);
        echartSetOption(t, o, () => ({
          color: [getColor("primary"), getColor("gray-200"), getColor("info")],
          tooltip: {
            trigger: "item",
            padding: [7, 10],
            backgroundColor: getColor("gray-100"),
            borderColor: getColor("gray-300"),
            textStyle: { color: getColor("dark") },
            borderWidth: 1,
            transitionDuration: 0,
            formatter: (e) => `<strong>${e.data.name}:</strong> ${e.percent}%`,
          },
          legend: { show: !1 },
          series: [
            {
              name: "72%", 
              type: "pie",
              radius: ["100%", "87%"],
              avoidLabelOverlap: !1,
              emphasis: { scale: !1, itemStyle: { color: "inherit" } },
              itemStyle: { borderWidth: 2, borderColor: getColor("white") },
              label: {
                show: !0,
                position: "center",
                formatter: "{a}",
                fontSize: 23,
                color: getColor("dark"),
              },
              data: [
                { value: 72e5, name: "Percentage discount" },
                { value: 18e5, name: "Fixed card discount" },
                { value: 1e6, name: "Fixed product discount" },
              ],
            },
          ],
        })),
          resize(() => {
            t.resize();
          });
      }
    };

  const projectionVsActualChartInit = () => {
    const t = document.querySelector(".echart-projection-actual"),
      o = getPastDates(10),
      e = [
        44485, 20428, 47302, 45180, 31034, 46358, 26581, 36628, 38219, 43256,
      ],
      r = [
        38911, 29452, 31894, 47876, 31302, 27731, 25490, 30355, 27176, 30393, 
      ];
    if (t) {
      const a = getData(t, "echarts"),
        i = echarts.init(t);
      echartSetOption(i, a, () => ({
        color: [getColor("primary"), getColor("gray-300")],
        tooltip: {
          trigger: "axis",
          padding: [7, 10],
          backgroundColor: getColor("gray-100"),
          borderColor: getColor("gray-300"),
          textStyle: { color: getColor("dark") },
          borderWidth: 1,
          transitionDuration: 0,
          axisPointer: { type: "none" },
          formatter: (t) => tooltipFormatter(t),
        },
        legend: {
          data: ["Projected revenue", "Actual revenue"],
          right: "right",
          width: "100%",
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 20,
          top: 3,
          inactiveColor: getColor("gray-500"),
          textStyle: {
            color: getColor("gray-900"),
            fontWeight: 600,
            fontFamily: "Nunito Sans",
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            color: getColor("gray-800"),
            formatter: (t) => window.dayjs(t).format("MMM DD"),
            interval: 3,
            fontFamily: "Nunito Sans",
            fontWeight: 600,
            fontSize: 12.8,
          },
          data: o,
          axisLine: { lineStyle: { color: getColor("gray-300") } },
          axisTick: !1,
        },
        yAxis: {
          axisPointer: { type: "none" },
          axisTick: "none",
          splitLine: {
            interval: 5,
            lineStyle: { color: getColor("gray-200") },
          },
          axisLine: { show: !1 },
          axisLabel: {
            fontFamily: "Nunito Sans",
            fontWeight: 600,
            fontSize: 12.8,
            color: getColor("gray-800"),
            margin: 20,
            verticalAlign: "bottom",
            formatter: (t) => `$${t.toLocaleString()}`,
          },
        },
        series: [
          {
            name: "Projected revenue",
            type: "bar",
            barWidth: "6px",
            data: r,
            barGap: "30%",
            label: { show: !1 },
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: getColor("primary"),
            },
          },
          {
            name: "Actual revenue",
            type: "bar",
            data: e,
            barWidth: "6px",
            barGap: "30%",
            label: { show: !1 },
            z: 10,
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: getColor("info-100"),
            },
          },
        ],
        grid: { right: 0, left: 3, bottom: 0, top: "15%", containLabel: !0 },
        animation: !1,
      })),
        resize(() => {
          i.resize();
        });
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const leaftletPoints = [
    {
      lat: 53.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 52.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 51.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 53.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 54.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 55.958332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 53.908332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 53.008332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 53.158332,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 53.000032,
      long: -1.080278,
      name: "Diana Meyer",
      street: "Slude Strand 27",
      location: "1130 Kobenhavn",
    },
    {
      lat: 52.292001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 52.392001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 51.492001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 51.192001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 52.292001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 54.392001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 51.292001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 52.102001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 52.202001,
      long: -2.22,
      name: "Anke Schroder",
      street: "Industrivej 54",
      location: "4140 Borup",
    },
    {
      lat: 51.063202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.363202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.463202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.563202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.763202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.863202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.963202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.000202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.000202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.163202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 52.263202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 53.463202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 55.163202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.263202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.463202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.563202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.663202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.763202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.863202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 56.963202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 57.973202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 57.163202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.163202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.263202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.363202,
      long: -1.308,
      name: "Tobias Vogel",
      street: "Mollebakken 33",
      location: "3650 Olstykke",
    },
    {
      lat: 51.409,
      long: -2.647,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.68,
      long: -1.49,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 50.259998,
      long: -5.051,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 54.906101,
      long: -1.38113,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.383331,
      long: -1.466667,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.483002,
      long: -2.2931,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.509865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.109865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.209865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.309865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.409865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.609865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.709865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.809865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 51.909865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.109865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.209865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.309865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.409865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.509865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.609865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.709865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.809865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.909865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.519865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.529865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.539865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.549865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 52.549865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.109865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.209865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.319865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.329865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.409865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.559865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.619865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.629865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.639865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.649865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.669865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.669865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.719865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.739865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.749865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.759865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.769865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.769865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.819865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.829865,
      long: -0.118092,
      name: "Richard Hendricks",
      street: "37 Seafield Place",
      location: "London",
    },
    {
      lat: 53.483959,
      long: -2.244644,
      name: "Ethel B. Brooks",
      street: "2576 Sun Valley Road",
    },
    {
      lat: 40.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 39.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 38.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 37.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 40.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 41.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 42.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 43.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 44.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 45.737,
      long: -73.923,
      name: "Marshall D. Lewis",
      street: "1489 Michigan Avenue",
      location: "Michigan",
    },
    {
      lat: 46.7128,
      long: 74.006,
      name: "Elizabeth C. Lyons",
      street: "4553 Kenwood Place",
      location: "Fort Lauderdale",
    },
    {
      lat: 40.7128,
      long: 74.1181,
      name: "Elizabeth C. Lyons",
      street: "4553 Kenwood Place",
      location: "Fort Lauderdale",
    },
    {
      lat: 14.235,
      long: 51.9253,
      name: "Ralph D. Wylie",
      street: "3186 Levy Court",
      location: "North Reading",
    },
    {
      lat: 15.235,
      long: 51.9253,
      name: "Ralph D. Wylie",
      street: "3186 Levy Court",
      location: "North Reading",
    },
    {
      lat: 16.235,
      long: 51.9253,
      name: "Ralph D. Wylie",
      street: "3186 Levy Court",
      location: "North Reading",
    },
    {
      lat: 14.235,
      long: 51.9253,
      name: "Ralph D. Wylie",
      street: "3186 Levy Court",
      location: "North Reading",
    },
    {
      lat: 15.8267,
      long: 47.9218,
      name: "Hope A. Atkins",
      street: "3715 Hillcrest Drive",
      location: "Seattle",
    },
    {
      lat: 15.9267,
      long: 47.9218,
      name: "Hope A. Atkins",
      street: "3715 Hillcrest Drive",
      location: "Seattle",
    },
    {
      lat: 23.4425,
      long: 58.4438,
      name: "Samuel R. Bailey",
      street: "2883 Raoul Wallenberg Place",
      location: "Cheshire",
    },
    {
      lat: 23.5425,
      long: 58.3438,
      name: "Samuel R. Bailey",
      street: "2883 Raoul Wallenberg Place",
      location: "Cheshire",
    },
    {
      lat: -37.8927369333,
      long: 175.4087452333,
      name: "Samuel R. Bailey",
      street: "3228 Glory Road",
      location: "Nashville",
    },
    {
      lat: -38.9064188833,
      long: 175.4441556833,
      name: "Samuel R. Bailey",
      street: "3228 Glory Road",
      location: "Nashville",
    },
    {
      lat: -12.409874,
      long: -65.596832,
      name: "Ann J. Perdue",
      street: "921 Ella Street",
      location: "Dublin",
    },
    {
      lat: -22.090887,
      long: -57.411827,
      name: "Jorge C. Woods",
      street: "4800 North Bend River Road",
      location: "Allen",
    },
    {
      lat: -19.019585,
      long: -65.261963,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: -16.500093,
      long: -68.214684,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: -17.413977,
      long: -66.165321,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: -16.489689,
      long: -68.119293,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 54.766323,
      long: 3.08603729,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 54.866323,
      long: 3.08603729,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 49.537685,
      long: 3.08603729,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 54.715424,
      long: 0.509207,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 44.891666,
      long: 10.136665,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: 48.078335,
      long: 14.535004,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: -26.358055,
      long: 27.398056,
      name: "Russ E. Panek",
      street: "4068 Hartland Avenue",
      location: "Appleton",
    },
    {
      lat: -29.1,
      long: 26.2167,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -29.883333,
      long: 31.049999,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -26.266111,
      long: 27.865833,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -29.087217,
      long: 26.154898,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -33.958252,
      long: 25.619022,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -33.977074,
      long: 22.457581,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: -26.563404,
      long: 27.844164,
      name: "Wilbur J. Dry",
      street: "2043 Jadewood Drive",
      location: "Northbrook",
    },
    {
      lat: 51.21389,
      long: -102.462776,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 52.321945,
      long: -106.584167,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 50.288055,
      long: -107.793892,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 52.7575,
      long: -108.28611,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 50.393333,
      long: -105.551941,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 50.930557,
      long: -102.807777,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 52.856388,
      long: -104.610001,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 52.289722,
      long: -106.666664,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 52.201942,
      long: -105.123055,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 53.278046,
      long: -110.00547,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 49.13673,
      long: -102.990959,
      name: "Joseph B. Poole",
      street: "3364 Lunetta Street",
      location: "Wichita Falls",
    },
    {
      lat: 45.484531,
      long: -73.597023,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.266666,
      long: -71.900002,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.349998,
      long: -72.51667,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 47.333332,
      long: -79.433334,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.400002,
      long: -74.033333,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.683334,
      long: -73.433334,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 48.099998,
      long: -77.783333,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.5,
      long: -72.316666,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 46.349998,
      long: -72.550003,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 48.119999,
      long: -69.18,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.599998,
      long: -75.25,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 46.099998,
      long: -71.300003,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 45.700001,
      long: -73.633331,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    {
      lat: 47.68,
      long: -68.879997,
      name: "Claudette D. Nowakowski",
      street: "3742 Farland Avenue",
      location: "San Antonio",
    },
    { lat: 46.716667, long: -79.099998, name: "299" },
    { lat: 45.016666, long: -72.099998, name: "299" },
  ];

  // returning vs non returning 
  const { echarts: echarts$1 } = window,
    returningCustomerChartInit = () => {
      const o = document.querySelector(".echart-returning-customer");
      if (o) {
        const t = getData(o, "echarts"),
          e = echarts$1.init(o);
        echartSetOption(e, t, () => ({
          color: getColor("gray-100"),
          legend: {
            data: [
              {
                name: "Fourth time",
                icon: "roundRect",
                itemStyle: { color: getColor("primary-300"), borderWidth: 0 },
              },
              {
                name: "Third time",
                icon: "roundRect",
                itemStyle: { color: getColor("info-200"), borderWidth: 0 },
              },
              {
                name: "Second time",
                icon: "roundRect",
                itemStyle: { color: getColor("primary"), borderWidth: 0 },
              },
            ],
            right: "right",
            width: "100%",
            itemWidth: 16,
            itemHeight: 8,
            itemGap: 20,
            top: 3,
            inactiveColor: getColor("gray-500"),
            inactiveBorderWidth: 0,
            textStyle: {
              color: getColor("gray-900"),
              fontWeight: 600,
              fontFamily: "Nunito Sans",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "none" },
            padding: [7, 10],
            backgroundColor: getColor("gray-100"),
            borderColor: getColor("gray-300"),
            textStyle: { color: getColor("dark") },
            borderWidth: 1,
            transitionDuration: 0,
            formatter: tooltipFormatter,
          },
          xAxis: {
            type: "category",
            data: months,
            show: !0, 
            boundaryGap: !1,
            axisLine: { show: !0, lineStyle: { color: getColor("gray-300") } },
            axisTick: { show: !1 },
            axisLabel: {
              showMinLabel: !1,
              showMaxLabel: !1,
              color: getColor("gray-800"),
              formatter: (o) => o.slice(0, 3),
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
            splitLine: {
              show: !0,
              lineStyle: { color: getColor("gray-200"), type: "dashed" },
            },
          },
          yAxis: {
            type: "value",
            boundaryGap: !1,
            axisLabel: {
              showMinLabel: !0,
              showMaxLabel: !0,
              color: getColor("gray-800"),
              formatter: (o) => `${o}%`,
              fontFamily: "Nunito Sans",
              fontWeight: 600,
              fontSize: 12.8,
            },
            splitLine: { show: !0, lineStyle: { color: getColor("gray-200") } },
          },
          series: [
            {
              name: "Fourth time",
              type: "line",
              data: [62, 90, 62, 90, 62, 90, 62, 17, 82, 17, 82, 17],
              showSymbol: !1,
              symbol: "circle",
              symbolSize: 10,
              emphasis: { lineStyle: { width: 1 } },
              lineStyle: {
                type: "dashed",
                width: 1,
                color: getColor("primary-300"),
              },
              itemStyle: {
                borderColor: getColor("primary-300"),
                borderWidth: 3,
              },
            },
            {
              name: "Third time",
              type: "line",
              data: [50, 62, 50, 62, 18, 62, 18, 22, 18, 70, 18, 70],
              showSymbol: !1,
              symbol: "circle",
              symbolSize: 10,
              emphasis: { lineStyle: { width: 1 } },
              lineStyle: { width: 1, color: getColor("info-200") },
              itemStyle: { borderColor: getColor("info-200"), borderWidth: 3 },
            },
            {
              name: "Second time",
              type: "line",
              data: [40, 78, 40, 78, 60, 78, 60, 40, 60, 40, 20, 40],
              showSymbol: !1,
              symbol: "circle",
              symbolSize: 10,
              emphasis: { lineStyle: { width: 3 } },
              lineStyle: { width: 3, color: getColor("primary") },
              itemStyle: { borderColor: getColor("primary"), borderWidth: 3 },
            },
          ],
          grid: { left: 0, right: 8, top: "14%", bottom: 0, containLabel: !0 },
        })),
          resize(() => {
            e.resize();
          });
      }
    };

  const chartJsInit = (t, n) => {
    if (!t) return;
    const e = t.getContext("2d");
    e && new window.Chart(e, n());
  };
  

    
  const payingCustomerChartInit = () => {
    const r = document.getElementById("payingCustomerChart");
    if (r) {
      chartJsInit(r, () => ({ 
        type: "doughnut",
        data: {
          labels: ["Cash On delivery", "Online payment"], 
          datasets: [
            {
              data: [30, 70],
              backgroundColor: [getColor("primary"), getColor("primary-100")],
              borderColor: [getColor("primary"), getColor("primary-100")],
              borderRadius: [
                { outerStart: 15, outerEnd: 0, innerStart: 15, innerEnd: 0 },
                { outerStart: 0, outerEnd: 15, innerStart: 0, innerEnd: 15 },
              ],
            },
          ],
        },
        options: {
          tooltips: {
            backgroundColor: getColor("primary-100"),
            borderColor: getColor("primary-100"),
            borderWidth: 1,
            titleColor: getColor("black"),
            callbacks: { labelTextColor: () => getColor("black") },
          },
          rotation: -90,
          circumference: "180",
          cutout: "80%",
          plugins: { legend: { display: !1 } },
        },
      }));
    }
  };

  const { L: L } = window,
    leafletTopRegionsInit = () => {
      const A = document.getElementById("map");
      if (L && A) {
        const A =
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          e = L.tileLayer(A),
          o = L.map("map", {
            center: L.latLng(25.659195, 30.182691),
            zoom: 0.6,
            layers: [e],
            minZoom: 1.4,
          }),
          t = L.markerClusterGroup({
            chunkedLoading: !1,
            spiderfyOnMaxZoom: !1,
          });
        leaftletPoints.map((A) => {
          const { name: e, location: o, street: n } = A,
            a = L.icon({
              iconUrl:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAACXBIWXMAAAFgAAABYAEg2RPaAAADpElEQVRYCZ1XS1LbQBBtybIdiMEJKSpUqihgEW/xDdARyAnirOIl3MBH8NK7mBvkBpFv4Gy9IRSpFIQiRPyNfqkeZkY9HwmFt7Lm06+7p/vN2MmyDIrQ6QebALAHAD4AbFuWfQeAAACGs5H/w5jlsJJw4wMA+GhMFuMA99jIDJJOP+ihZwDQFmNuowWO1wS3viDXpdEdZPEc0odruj0EgN5s5H8tJOEEX8R3rbkMtcU34NTqhe5nSQTJ7Tkk80s6/Gk28scGiULguFBffgdufdEwWoQ0uoXo8hdAlooVH0REjISfwZSlyHGh0V5n6aHAtKTxXI5g6nQnMH0P4bEgwtR18Yw8Pj8QZ4ARUAI0Hl+fQZZGisGEBVwHr7XKzox57DXZ/ij8Cdwe2u057z9/wygOxRl4S2vSUHx1oucaMQGAHTrgtdag9mK5aN+Wx/uAAQ9Zenp/SRce4TpaNbQK4+sTcGqeTB/aIXv3XN5oj2VKqii++U0JunpZ8urxee4hvjqVc2hHpBDXuKKT9XMgVYJ1/1fPGSeaikzgmWWkMIi9bVf8UhotXxzORn5gWFchI8QyttlzjS0qpsaIGY2MMsujV/AUSdcY0dDpB6/EiOPYzclR1CI5mOez3ekHvrFLxa7cR5pTscfrXjk0Vhm5V2PqLUWnH3R5GbPGpMVD7E1ckXesKBQ7AS/vmQ1c0+kHuxpBj98lTCm8pbc5QRJRdZ6qHb/wGryXq3Lxszv+5gySuwvxueXySwYvHEjuQ9ofTGKYlrmK1EsCHMd5SoD7mZ1HHFCBHLNbMEshvrugqWLn01hpVVJhFgVGkDvK7hR6n2B+d9C7xsqWsbkqHv4cCsWezEb+o2SR+SFweUBxfA5wH7kShjKt2vWL57Px3GhIFEezkb8pxvUWHYhotAfCk2AtkEcxoOttrxUWDR5svb1emSQKj0WXK1HYIgFREbiBqmoZcB2RkbE+byMZiosorVgAZF1ID7yQhEs38wa7nUqNDezdlavC2HbBGSQkGgZ8uJVBmzeiKCRRpEa9ilWghORVeGB7BxeSKF5xqbFBkxBrFKUk/JHA7ppENQaCnCjthK+3opCEYyANztXmZN858cDYWSUSHk3A311GAZDvo6deNKUk1EsqnJoQlkYBNlmxQZeaMgmxoUokICoHDce351RCCiuKoirJWEgNOYvQplM2VCLhUqF7jf94rW9kHVUjQeheV4riv0i4ZOzzz/2y/+0KAOAfr4EE4HpCFhwAAAAASUVORK5CYII=",
            }),
            p = L.marker([A.lat, A.long], { icon: a }),
            i = `\n        <h6 class="mb-1">${e}</h6>\n        <p class="m-0 text-500">${n}, ${o}</p>\n      `,
            s = L.popup({ minWidth: 180 }).setContent(i);
          return p.bindPopup(s), t.addLayer(p), !0;
        }),
          o.addLayer(t);
      }
    };

  docReady(totalSalesChartInit),
    docReady(newCustomersChartsInit),
    docReady(topCouponsChartInit),
    docReady(projectionVsActualChartInit),
    docReady(returningCustomerChartInit),
    docReady(payingCustomerChartInit),
    docReady(leafletTopRegionsInit);
});
//# sourceMappingURL=ecommerce-dashboard.js.map
