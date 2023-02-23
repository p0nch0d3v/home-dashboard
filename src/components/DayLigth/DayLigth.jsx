import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { consoleDebug } from "../../helpers";
import './DayLigth.scss';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function DayLigth({ sunrise, sunset, dayLigthData }) {
  const dayBk = '#76A7E3';
  const nightBK = '#1F4371';
  const border = '#4B75AA';
  const white = '#FFFFFF';
  const black = '#000000';

  const data = {
    datasets: [
      {
        data: [...dayLigthData],
        backgroundColor: [nightBK, dayBk, dayBk, nightBK],
        borderColor: [border, border, border, border],
        borderWidth: 1,
        rotation: 0,
        datalabels: {
          anchor: 'center'
        }
      }
    ]
  };

  const options = {
    animation: false,
    plugins: {
      datalabels: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderRadius: 1,
        borderWidth: 1,
        color: function (context) {
          let color = 'transparent';
          if (context.dataIndex === 0 || context.dataIndex === 1) {
            color = white;
          } else if (context.dataIndex === 2 || context.dataIndex === 3) {
            color = black;
          }
          return color;
        },
        display: (context) => (context.dataIndex >= 0),
        font: {
          weight: 'normal',
          size: ((context) => Math.min(window.innerWidth, window.innerHeight) / 20)()
        },
        padding: 1,
        formatter: (value, context) => {
          let text = '';
          if (context.dataIndex === 0) {
            text = sunrise;
          } else if (context.dataIndex === 1) {
            text = '☀️';
          } else if (context.dataIndex === 2) {
            text = sunset;
          } else if (context.dataIndex === 3) {
            text = '🌜';
          }
          return text;
        },
        anchor: 'start',
        clamp: true,
        align: 'center',
        rotation: 45,
        opacity: 0.75
      }
    }
  };

  return (
    <div className="dayligth-wrapper">
      <Doughnut options={options} data={data}></Doughnut>
    </div>
  );
}

export default DayLigth;