import React, { useState } from "react";//控制圖表展開或折疊
import { useQuery } from "react-query";
import ChartData from "./ChartData";

const useGetCardData = (cryptoName, options) => {
  return useQuery(
    `${cryptoName}-card`,
    async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoName}`
      );
      return await response.json();
    },
    options
  );
};

export const formatPrice = (price) => {
  const formatConfig = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TWD",//USD
    minimumFractionDigits: 2
  });

  return formatConfig.format(price);
};



const formatPlusMinus = (priceChange) => {
  const isPositive = Math.sign(priceChange) >= 0;

  return (
    <span className={`${isPositive ? "positive" : "negative"}`}>
      {`${isPositive ? "+" : ""}${priceChange.toFixed(2)}%`}
    </span>
  );
};

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/bitcoin-price-tracking-with-react-query
 */
const CryptoTracker = ({ cryptoName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading } = useGetCardData(cryptoName, {
    refetchInterval: 60000,
    staleTime: 60000
  });

  const onCardClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  if (isLoading) return null;

  const { image, name, market_data: marketData } = data;
  console.log(marketData.current_price)

  return (
    <div className={`card ${isExpanded ? "expanded" : "collapsed"}`}>
      {!isExpanded && <button onClick={onCardClick} className="hitzone" />}
      <div className="card-inner">
        {isExpanded && (
          <button className="close" onClick={() => setIsExpanded(false)}>
            X
          </button>
        )}
        <div className="top-data">
          <img src={image?.large} alt={`${name} logo`} />
          <h3 className="crypto-name">{name}</h3>
          <h4 className="crypto-price">
            {/* 控制幣別 */}
            {formatPrice(marketData?.current_price?.twd)}  
            {formatPlusMinus(marketData?.price_change_percentage_24h)}
          </h4>
        </div>
        <ChartData isExpanded={isExpanded} cryptoName={cryptoName} />
      </div>
    </div>
  );
};

export default CryptoTracker;
