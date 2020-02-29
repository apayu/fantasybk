import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

class CompareValueLine extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
        plugins: {
          colorschemes: {
            scheme: 'brewer.SetTwo3'
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'z-score'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: '週次 week'
            }
          }]
        }
      },
      data: {
        labels: [],
        datasets: [{
          label: '',
          data: [0]
        },{
          label: '',
          data: [0]
        }]
      }
    })
  }

  renderChart() {
    const playerWeekValue = this.props.playerWeekValue
    const playerA = playerWeekValue.playerA
    const playerB = playerWeekValue.playerB
    const player = playerA.length > 0 ? playerA : playerB
    let dataSets = []

    if(player.length > 0) {
      // 設定週數
      const labels = Object.values(player).map(item => item.week)
      this.myChart.data.labels = labels

      if(playerA.length >0){
        const name = Array.from(new Set(Object.values(playerA).map(item => item.name)))

        this.myChart.data.datasets[0].label = name
        this.myChart.data.datasets[0].data = Object.values(playerA).map(item => item.value)
        this.myChart.data.datasets[0].fill = 'none'
      }

      if(playerB.length >0){
        const name = Array.from(new Set(Object.values(playerB).map(item => item.name)))

        this.myChart.data.datasets[1].label = name
        this.myChart.data.datasets[1].data = Object.values(playerB).map(item => item.value)
        this.myChart.data.datasets[1].fill = 'none'
      }
      this.myChart.update()
    }

  }

  render() {
    this.renderChart()
    return <canvas ref={this.canvasRef} />
  }
}

export default CompareValueLine
