import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import 'chartjs-plugin-colorschemes'

class SeasonScoreLine extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef()
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
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '戰力'
            },
            ticks: {
              min: 0
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
        labels: labels,
        datasets: dataSets
      }
    })
  }

  // 數值越大，分數越高
  sortScoreboard(arr, num, toSort) {
    let newArray = arr.concat(num)

    if(toSort == 'asc')
      newArray.sort((a,b) => parseFloat(a)-parseFloat(b))
    else
      newArray.sort((a,b) => parseFloat(b)-parseFloat(a))

    return newArray.indexOf(num) + 1
  }

  calculateValue() {
    const fetchInProgress = this.props.fetchInProgress
    const leagueStartWeek = parseInt(this.props.leagueStartWeek)
    const leagueCurrentWeek = parseInt(this.props.leagueCurrentWeek)

    if(!fetchInProgress){
      // 建立計分板
      let scoreboardValue = JSON.parse(JSON.stringify(this.props.scoreboardArray))

      for(var week = leagueStartWeek; week <= leagueCurrentWeek; week++) {
        // 選擇要計算的 week 成績
        let selectWeekScoreboard = this.props.scoreboardArray.filter(x => x.week == week)
        // 比項
        let leagueStatsArray = this.props.leagueStatsArray
        let singleValue = 0

        // 算出各個項目的成績
        // 從每一隊的第一個比項開始算
        for(let i = 0; i< leagueStatsArray.length; i++) {
          let statName = leagueStatsArray[i].name
          let sortOrder  = leagueStatsArray[i].sort_order
          let totalArray = selectWeekScoreboard.map(x => x[statName])
          let totalValue = 0

          // x等於各隊數據
          selectWeekScoreboard.map(x => {
            let c = scoreboardValue.filter( y => y.id == x.id && y.week == week)

            //取得分數
            if(sortOrder == 1)
              singleValue = x[statName] ? this.sortScoreboard(totalArray, x[statName], 'asc') : 0
            else
              singleValue = x[statName] ? this.sortScoreboard(totalArray, x[statName], 'desc') : 0

            // 尋找對應的隊伍計分板
            c[0][statName] = singleValue

            // 加總到total_value
            if (c && c[0]['total_value']) {
              c[0]['total_value'] = c[0]['total_value'] + singleValue
            }
            else{
              c[0]['total_value'] = singleValue
            }
          })
        }
      }

      // 餵資料
      let totalTeamId = Object.values(scoreboardValue).map(item => item.id)
      let totalWeek = Object.values(scoreboardValue).map(item => item.week)

      // 設定週數
      let labels = Array.from(Array(leagueCurrentWeek-(leagueStartWeek-1)),(e,i)=>i+leagueStartWeek)
      // 設定資料
      let dataSets = []

      let teamId = Array.from(new Set(totalTeamId))
      teamId.map(x => {
        let totalTeamValue = scoreboardValue.filter( y => y.id == x)
        let dataSet = {
          label: totalTeamValue[0].name,
          data: totalTeamValue.map(d => d.total_value),
          fill: 'none'
        }
        dataSets.push(dataSet)
      })

      this.renderChart(labels, dataSets)
    }
  }

  render() {
    this.calculateValue()
    return <canvas ref={this.canvasRef} />
  }
}

export default SeasonScoreLine
