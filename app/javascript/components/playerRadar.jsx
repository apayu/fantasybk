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
    let labels = ["得分", "三分", "籃板", "助攻", "抄截", "火鍋"]
    let options = {
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
                label: "",
                backgroundColor: "rgba(200,0,0,0.2)",
                data: [0, 0, 0, 0, 0, 0]
            }]
        }
    })
  }

  renderRadar() {
    let fetchInProgressByInfo = this.props.fetchInProgressByInfo
    let playerInfo = this.props.playerInfo
    let leagueInfo = this.props.leagueInfo

    let points = playerInfo.points/leagueInfo.points
    let tpm = playerInfo.tpm/leagueInfo.tpm
    let tot_reb = playerInfo.tot_reb/leagueInfo.tot_reb
    let assists = playerInfo.assists/leagueInfo.assists
    let steals = playerInfo.steals/leagueInfo.steals
    let blocks = playerInfo.blocks/leagueInfo.blocks

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
