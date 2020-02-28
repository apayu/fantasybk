import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

class PlayerRadar extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    const labels = ['得分', '三分', '籃板', '助攻', '抄截', '火鍋']
    const options = {
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
                label: '球員',
                backgroundColor: 'rgba(200,0,0,0.2)',
                data: [0, 0, 0, 0, 0, 0]
            }]
        }
    })
  }

  renderRadar() {
    const fetchInProgressByInfo = this.props.fetchInProgressByInfo
    const playerInfo = this.props.playerInfo
    const leagueInfo = this.props.leagueInfo

    const points = playerInfo.points/leagueInfo.points
    const tpm = playerInfo.tpm/leagueInfo.tpm
    const tot_reb = playerInfo.tot_reb/leagueInfo.tot_reb
    const assists = playerInfo.assists/leagueInfo.assists
    const steals = playerInfo.steals/leagueInfo.steals
    const blocks = playerInfo.blocks/leagueInfo.blocks

    if(!fetchInProgressByInfo){
      this.myRadarChart.data.datasets[0].data = [points, tpm, tot_reb, assists, steals, blocks]
      this.myRadarChart.data.datasets[0].label = playerInfo.name
      this.myRadarChart.update()
    }
  }

  render() {
    this.renderRadar()
    return <canvas ref={this.canvasRef} />
  }
}

export default PlayerRadar
