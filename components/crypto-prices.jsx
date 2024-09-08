"use client"

import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const defaultTokens = [
  { name: 'Bitcoin', id: 'bitcoin' },
  { name: 'Ethereum', id: 'ethereum' },
  { name: 'Ripple', id: 'ripple' },
  { name: 'TONCOIN', id: 'the-open-network'},
  { name: 'BNB', id: 'binancecoin'},
  { name: 'Solana', id: 'solana'}
];

const CryptoPriceTicker = ({ tokens = defaultTokens }) => {
  const [prices, setPrices] = useState({});
  const [logos, setLogos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = tokens.map(token => token.id).join(',');
        const [pricesResponse, coinsResponse] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`),
          fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=false`)
        ]);

        if (!pricesResponse.ok || !coinsResponse.ok) throw new Error('Failed to fetch');

        const pricesData = await pricesResponse.json();
        const coinsData = await coinsResponse.json();

        setPrices(pricesData);
        setLogos(coinsData.reduce((acc, coin) => ({
          ...acc,
          [coin.id]: coin.image
        }), {}));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tokens]);

  if (loading) {
    return <div className="flex justify-center items-center h-16 bg-gray-800 text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 text-white overflow-hidden">
      <div className="flex animate-marquee">
        {tokens.map((token) => {
          const price = prices[token.id]?.usd;
          const change = prices[token.id]?.usd_24h_change;
          return (
            <div key={token.id} className="flex items-center space-x-2 px-6  py-2">
              {logos[token.id] && (
                <img
                  src={logos[token.id]}
                  alt=''
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold">{token.name}</span>
              <span>${price?.toFixed(2)}</span>
              {change && (
                <span className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change >= 0 ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                  {Math.abs(change).toFixed(2)}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoPriceTicker;