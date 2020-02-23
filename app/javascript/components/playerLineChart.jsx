import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import "chartjs-plugin-colorschemes"

// LineChart
class PlayerLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  renderChart(labels, dataSets) {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
        plugins: {
          colorschemes: {
            scheme: 'tableau.Classic20'
          }
        },
        maintainAspectRatio: false,
      },
      data: {
        labels: labels,
        datasets: dataSets
      }
    })
  }

  calculateValue() {
    let fetchInProgress = this.props.fetchInProgress
    let playerWeekValue = this.props.playerWeekValue

    if(!fetchInProgress){
      // 設定週數
      let labels = Object.values(playerWeekValue).map(item => item.week)
      // 設定資料
      let dataSets = []
      let dataSet = {
        label: "player",
        data: Object.values(playerWeekValue).map(item => item.value),
        fill: 'none'
      }
      dataSets.push(dataSet)

      this.renderChart(labels, dataSets)
    }
  }

  render() {
    this.calculateValue()
    return <canvas ref={this.canvasRef} />;
  }
}

export default PlayerLineChart;
