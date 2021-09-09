import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import format from "date-fns/format";
import { formatPrice } from "./CryptoTracker";

const intervals = [
  {
    label: "1D",
    value: 1,
  },
  {
    label: "7D",
    value: 7,
  },
  {
    label: "1M",
    value: 30,
  },
  {
    label: "3M",
    value: 90,
  },
  {
    label: "6M",
    value: 180,
  },
];

const useGetChartData = (cryptoName, interval, options) => {
  return useQuery(
    ["chartData", interval],
    async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart?vs_currency=usd&days=${interval}`
      );
      return await response.json();
    },
    options
  );
};

const ChartData = ({ cryptoName, isExpanded }) => {
  const [dataInterval, setDataInterval] = useState(intervals[0].value);

  const { isLoading, data } = useGetChartData(cryptoName, dataInterval, {
    refetchInterval: 60000,
    staleTime: 60000,
    select: (data) =>
      data?.prices?.map((item) => ({
        x: item[0],
        y: item[1],
      }
      )),
  });
  //console.log(data.prices,"價格")
  return (
    <div className="chart">
      <div className="chart-actions">
        {intervals.map((interval) => (
          <button
            key={interval.value}
            className={dataInterval === interval.value ? "active" : "inactive"}
            onClick={() => setDataInterval(interval.value)}
          >
            {interval.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="loading-container">
          <span>Loading...</span>
        </div>
      ) : !isExpanded ? (
        <VictoryLine
          style={{
            data: {
              stroke: "#fff",
              strokeWidth: 2,
            },
          }}
          width={300}
          height={150}
          data={data}
        />
      ) : (
        <VictoryChart
          width={800}
          height={400}
          domainPadding={5}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => formatPrice(datum.y)} // Format the price
              title={`${cryptoName} price data chart`} // For screen readers
              labelComponent={
                <VictoryTooltip
                  style={{
                    fill: "#333",
                    fontSize: 25,
                  }}
                  flyoutStyle={{
                    fill: "#fff",
                    stroke: "#fff",
                    strokeWidth: 1,
                    margin: 10,
                  }}
                />
              }
            />
          }
        >
          <VictoryLine
            style={{
              data: {
                stroke: "#fff",
                strokeWidth: 2,
              },
            }}
            data={data}
          />
          <VictoryAxis
            orientation="bottom"
            style={{
              axis: {
                stroke: "#fff",
                strokeWidth: 2,
              },
              tickLabels: {
                fill: "#fff",
              },
            }}
            tickFormat={(x) => {
              if (dataInterval === 1) {
                return format(x, "p");
              }

              return format(x, "MM/dd");
            }}
          />
        </VictoryChart>
      )}
    </div>
  );
};

export default ChartData;
