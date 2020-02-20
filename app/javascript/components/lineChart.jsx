import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

// LineChart
class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      weeklyTotalValue: [
        { week: 1, teamId: 1, teamName: "", value: 86},
        { week: 2, teamId: 1, teamName: "", value: 61},
        { week: 3, teamId: 1, teamName: "", value: 82},
        { week: 4, teamId: 1, teamName: "", value: 78},
        { week: 5, teamid: 1, teamname: "", value: 79}
      ]
    }
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.props.data.map(d => d.time);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
			  maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'week'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        }
      },
      data: {
        labels: this.state.weeklyTotalValue.map(d => d.week),
        datasets: [{
          label: this.props.title,
          data: this.state.weeklyTotalValue.map(d => d.value),
          fill: 'none',
          backgroundColor: this.props.color,
          pointRadius: 2,
          borderColor: this.props.color,
          borderWidth: 1,
          lineTension: 0
        }]
      }
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}
// class LineChart extends React.Component {
//   constructor(props) {
//     super(props);
//     this.chartRef = React.createRef();
//
//     this.state = {
//       weeklyTotalValue: [
//         { week: 1, teamId: 1, teamName: "", value: 86},
//         { week: 2, teamId: 1, teamName: "", value: 61},
//         { week: 3, teamId: 1, teamName: "", value: 82},
//         { week: 4, teamId: 1, teamName: "", value: 78},
//         { week: 5, teamid: 1, teamname: "", value: 79}
//       ]
//     }
//   }
//
//   // componentdidupdate() {
//   //   this.mychart.data.labels = this.props.data.map(d => d.time);
//   //   this.mychart.data.datasets[0].data = this.props.data.map(d => d.value);
//   //   this.mychart.update();
//   // }
//
//   // componentdidmount() {
//   //   this.mychart = new chart(this.chartref.current, {
//   //     type: 'line',
//   //     data: {
//   //       labels: this.state.weeklyTotalValue.map(d => d.week),
//   //       datasets: [{
//   //         label: "2019-2020 每週戰力表",
//   //         data: this.state.weeklyTotalValue.map(d => d.value)
//   //       }]
//   //     }
//   //   })
//   // }
//   componentDidMount() {
//     this.myChart = new Chart(this.canvasRef.current, {
//       type: 'line',
//       options: {
// 			  maintainAspectRatio: false,
//         scales: {
//           xAxes: [
//             {
//               type: 'time',
//               time: {
//                 unit: 'week'
//               }
//             }
//           ],
//           yAxes: [
//             {
//               ticks: {
//                 min: 0
//               }
//             }
//           ]
//         }
//       },
//       data: {
//         labels: this.props.data.map(d => d.time),
//         datasets: [{
//           label: this.props.title,
//           data: this.props.data.map(d => d.value),
//           fill: 'none',
//           backgroundColor: this.props.color,
//           pointRadius: 2,
//           borderColor: this.props.color,
//           borderWidth: 1,
//           lineTension: 0
//         }]
//       }
//     });
//   }
//
//   getTotalWeekValue() {
//     console.log(this.state.weeklyTotalValue.map(d=> d.week))
//     console.log(this.state.weeklyTotalValue.map(d=> d.value))
//   }
//
//
//   render() {
//     this.getTotalWeekValue()
//
//     return <canvas ref={this.chartRef} />;
//   }
// }

export default LineChart;
