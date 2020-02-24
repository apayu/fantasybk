import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import "chartjs-plugin-colorschemes"

// LineChart
class LineChart extends React.Component {
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
        scales: {
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
        labels: labels,
        datasets: dataSets
      }
    })
  }

  // 數值越大，分數越高
  sortScoreboard(arr, num, to_sort) {
    let newArray = arr.concat(num)

    if(to_sort == "asc")
      newArray.sort((a,b) => parseFloat(a)-parseFloat(b))
    else
      newArray.sort((a,b) => parseFloat(b)-parseFloat(a))

    return newArray.indexOf(num) + 1
  }

  calculateValue() {
    let fetchInProgress = this.props.fetchInProgress
    let league_start_week = parseInt(this.props.league_start_week)
    let league_current_week = parseInt(this.props.league_current_week)

    if(!fetchInProgress){
      // 建立計分板
      let scoreboard_value = JSON.parse(JSON.stringify(this.props.scoreboard))

      for(var week = league_start_week; week <= league_current_week; week++) {
        // 選擇要計算的 week 成績
        let select_week_scoreboard = this.props.scoreboard.filter(x => x.week == week)
        // 比項
        let league_stats = this.props.league_stats
        let single_value = 0

        // 算出各個項目的成績
        // 從每一隊的第一個比項開始算
        for(let i = 0; i< league_stats.length; i++) {
          let stat_name = league_stats[i].name
          let sort_order  = league_stats[i].sort_order
          let total_array = select_week_scoreboard.map(x => x[stat_name])
          let total_value = 0

          // x等於各隊數據
          select_week_scoreboard.map(x => {
            let c = scoreboard_value.filter( y => y.id == x.id && y.week == week)

            //取得分數
            if(sort_order == 1)
              single_value = x[stat_name] ? this.sortScoreboard(total_array, x[stat_name], "asc") : 0
            else
              single_value = x[stat_name] ? this.sortScoreboard(total_array, x[stat_name], "desc") : 0

            // 尋找對應的隊伍計分板
            c[0][stat_name] = single_value

            // 加總到total_value
            if (c && c[0]["total_value"]) {
              c[0]["total_value"] = c[0]["total_value"] + single_value
            }
            else{
              c[0]["total_value"] = single_value
            }
          })
        }
      }

      // 餵資料
      let totalTeamId = Object.values(scoreboard_value).map(item => item.id)
      let totalWeek = Object.values(scoreboard_value).map(item => item.week)

      // 設定週數
      let labels = Array.from(Array(league_current_week-(league_start_week-1)),(e,i)=>i+league_start_week)
      // 設定資料
      let dataSets = []

      let teamId = Array.from(new Set(totalTeamId))
      teamId.map(x => {
        let totalTeamValue = scoreboard_value.filter( y => y.id == x)
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
    return <canvas ref={this.canvasRef} />;
  }
}

export default LineChart;
