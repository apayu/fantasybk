import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

class PlayerRadar extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidUpdate() {
    let fetchInProgressByInfo = this.props.fetchInProgressByInfo
    let playerInfo = this.props.playerInfo
    let leagueInfo = this.props.leagueInfo
    let labels = ["得分", "三分", "籃板", "助攻", "抄截", "火鍋"]

    let points = playerInfo.points/leagueInfo.points
    let tpm = playerInfo.tpm/leagueInfo.tpm
    let tot_reb = playerInfo.tot_reb/leagueInfo.tot_reb
    let assists = playerInfo.assists/leagueInfo.assists
    let steals = playerInfo.steals/leagueInfo.steals
    let blocks = playerInfo.blocks/leagueInfo.blocks

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

    if(!fetchInProgressByInfo){
      this.myRadarChart = new Chart(this.canvasRef.current, {
        type: 'radar',
        options: options,
        data: {
            labels: labels,
            datasets: [{
                label: playerInfo.name,
                backgroundColor: "rgba(200,0,0,0.2)",
                data: [points, tpm, tot_reb, assists, steals, blocks]
            }]
        }
      })
    }
  }

  render() {
    return <canvas ref={this.canvasRef} />
  }
}

export default PlayerRadar
