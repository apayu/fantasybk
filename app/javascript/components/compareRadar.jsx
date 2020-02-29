import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import 'chartjs-plugin-colorschemes'

class CompareRadar extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    const labels = ['得分', '三分', '籃板', '助攻', '抄截', '火鍋']
    const options = {
        plugins: {
          colorschemes: {
            scheme: 'brewer.Accent3'
          }
        },
        scale: {
            ticks: {
                max: 5,
                min: -2,
                stepSize: 1
            }
        },
        maintainAspectRatio: false
    }

    this.myRadarChart = new Chart(this.canvasRef.current, {
      type: 'radar',
      options: options,
        data: {
            labels: labels,
            datasets: [{
              label: '',
              data: [0, 0, 0, 0, 0, 0]
            },{
              label: '',
              data: [0, 0, 0, 0, 0, 0]
            }]
        }
    })
  }

  renderRadar() {
    const playerScoreList = this.props.playerScoreList

    if(playerScoreList.playerA.hasOwnProperty('player_id')) {
      const playerA = playerScoreList.playerA
      let points = playerA.points_value
      let tpm = playerA.three_point_value
      let tot_reb = playerA.tot_reb_value
      let assists = playerA.assists_value
      let steals = playerA.steals_value
      let blocks = playerA.blocks_value

      this.myRadarChart.data.datasets[0].label = playerA.name
      this.myRadarChart.data.datasets[0].data = [points, tpm, tot_reb, assists, steals, blocks]
      this.myRadarChart.update()
    }

    if(playerScoreList.playerB.hasOwnProperty('player_id')) {
      const playerB = playerScoreList.playerB
      let points = playerB.points_value
      let tpm = playerB.three_point_value
      let tot_reb = playerB.tot_reb_value
      let assists = playerB.assists_value
      let steals = playerB.steals_value
      let blocks = playerB.blocks_value

      this.myRadarChart.data.datasets[1].label = playerB.name
      this.myRadarChart.data.datasets[1].data = [points, tpm, tot_reb, assists, steals, blocks]
      this.myRadarChart.update()
    }
  }

  render() {
    this.renderRadar()
    return <canvas ref={this.canvasRef} />
  }
}

export default CompareRadar
