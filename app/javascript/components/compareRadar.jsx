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
            scheme: 'brewer.SetTwo3'
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

    // if(typeof playerScoreList !== 'undefined' && playerScoreList.length >0) {
    //   playerScoreList.forEach((p,i) => {
    //
    //     let points = p.points_value
    //     let tpm = p.three_point_value
    //     let tot_reb = p.tot_reb_value
    //     let assists = p.assists_value
    //     let steals = p.steals_value
    //     let blocks = p.blocks_value
    //     this.myRadarChart.data.datasets.push({
    //       label: p.name,
    //       backgroundColor: 'rgba(200,0,0,0.2)',
    //       data: [points, tpm, tot_reb, assists, steals, blocks]
    //     })
    //   })
    // }
    // const fetchInProgressByInfo = this.props.fetchInProgressByInfo
    // const playerInfo = this.props.playerInfo
    // const leagueInfo = this.props.leagueInfo
    //
    // const points = playerInfo.points/leagueInfo.points
    // const tpm = playerInfo.tpm/leagueInfo.tpm
    // const tot_reb = playerInfo.tot_reb/leagueInfo.tot_reb
    // const assists = playerInfo.assists/leagueInfo.assists
    // const steals = playerInfo.steals/leagueInfo.steals
    // const blocks = playerInfo.blocks/leagueInfo.blocks
    //
  }

  render() {
    this.renderRadar()
    return <canvas ref={this.canvasRef} />
  }
}

export default CompareRadar
