import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { consoleDebug } from "../../helpers";
import './DayLigth.scss';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

function DayLigth({ sunrise, sunset, dayLigthData }) {
    const dayBk = '#76a7e3';
    const nightBK = '#1f4371';
    const border = '#4B75AA';

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
            backgroundColor: function (context) {
              return context.dataset.backgroundColor;
            },
            borderColor: 'transparent',
            borderRadius: 1,
            borderWidth: 1,
            color: 'white',
            display: function (context) {
              return context.dataIndex % 2 === 0;
            },
            font: {
              weight: 'normal',
              size: '32'
            },
            padding: 1,
            formatter: function (value, context) {
              let text = '';
              if (context.dataIndex === 0) {
                text = sunrise;
              } else if (context.dataIndex === 2) {
                text = sunset;
              }
              return text;
            },
            anchor: 'start',
            clamp: false,
            align: 'center',
            rotation: 45,
            opacity: 0.5
          }
        }
      };

    return (
        <div class="dayligth-wrapper">
            <Doughnut options={options} data={data}></Doughnut>
        </div>
    );
}

export default DayLigth;