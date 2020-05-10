import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {Line} from 'react-chartjs-2';

const pubKey = 'NjJhN2E5ZTM1NjI2NGU5NTlmOTE2MDE0YmU2MzcxNDU';
const [MAX, YEAR, MONTH, DAY] = ['MAX', 'YEAR', 'MONTH', 'DAY'];

function App() {
  const [times, changeTimes] = useState([]);
  const [scale, changeScale] = useState(MAX);
  const [prices, changePrices] = useState([]);
  const data = {
    labels: times,
    datasets: [
      {
        label: 'BTC-USD',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: prices
      }
    ]
  };
  useEffect(() => {
    axios.get('https://apiv2.bitcoinaverage.com/websocket/v3/get_ticket', {
      headers: {
        "x-ba-key": pubKey,
      }
    }).then(response => console.log(response))
  }, []);
  useEffect(() => {
    let oneYearBack = new Date();
    oneYearBack.setFullYear(oneYearBack.getFullYear() - 1);
    let oneMonthBack = new Date();
    oneMonthBack.setMonth(oneMonthBack.getMonth() - 1);
    let onDayBack = new Date();
    onDayBack.setDate(onDayBack.getDate() - 1);
    const oneDayBackStr = Math.floor(onDayBack.getTime() / 1000).toString();
    const oneMonthBackStr = Math.floor(oneMonthBack.getTime() / 1000).toString();
    const oneYearBackStr = Math.floor(oneYearBack.getTime() / 1000).toString();
    let maxBack = '1273242555';

    let resolution;
    let start;
    switch (scale) {
      case MAX:
        resolution = 'day';
        start = maxBack;
        break;
      case YEAR:
        resolution = 'day';
        start = oneYearBackStr;
        break;
      case MONTH:
        resolution = 'hour';
        start = oneMonthBackStr;
        break;
      case DAY:
        resolution = 'minute';
        start = oneDayBackStr;
        break;
      default:
        resolution = 'day';
        start = maxBack;
    }
    const req = axios.get("https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD", {
      params: {
        resolution: resolution,
        since: start,
      },
      headers: {
        "x-ba-key": pubKey,
      }
    }).then(response => {
      console.log(response);
      let labelsDup = [];
      let dataDup = [];
      labelsDup = response.data.map(item => {
        let date = new Date(item.time);
        return date.toLocaleString();
      });
      labelsDup.reverse();
      dataDup = response.data.map(item => item.average);
      dataDup.reverse();
      changeTimes(labelsDup);
      changePrices(dataDup);
    })
  }, [scale]);
  return (
    <div className="App">
      <span>
        <button onClick={() => changeScale(MAX)}>
          Max
        </button>
        <button onClick={() => changeScale(YEAR)}>
          1 year
        </button>
        <button onClick={() => changeScale(MONTH)}>
          31 days
        </button>
        <button onClick={() => changeScale(DAY)}>
          24 hours
        </button>
      </span>
      <Line data={data} />
    </div>
  );
}

export default App;
