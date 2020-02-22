import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Table extends React.Component {
  constructor(props) {
    super(props)
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

  renderTableData() {
    // 選擇要計算的 week 成績
    let select_week_scoreboard = this.props.scoreboard.filter(x => x.week === this.props.league_current_week)
    // 建立計分板
    let scoreboard_value = JSON.parse(JSON.stringify(select_week_scoreboard))
    let single_value = 0

    // 算出各個項目的成績
    // 從每一隊的第一個比項開始算
    for(let i = 3; i <= 13; i++) {
      let total_array = select_week_scoreboard.map(x => Object.values(x)[i])
      let total_value = 0

      // x等於各隊數據
      select_week_scoreboard.map(x=> {
        let value_item  = Object.keys(x)[i]
        let c = scoreboard_value.filter( y => y.id == x.id)

        //取得分數
        if(value_item.toLowerCase() == "to" || value_item.toLowerCase() == "pf")
          single_value = this.sortScoreboard(total_array, Object.values(x)[i], "desc")
        else
          single_value = this.sortScoreboard(total_array, Object.values(x)[i], "asc")

        // 尋找對應的隊伍計分板
        c[0][value_item] = single_value

        // 加總到total_value
        if (c && c[0]["total_value"]) {
          c[0]["total_value"] = c[0]["total_value"] + single_value
        }
        else{
          c[0]["total_value"] = single_value
        }
      })
    }

    return select_week_scoreboard.map((team, index) => {
      // 從對應計分板尋找總分
      let h = scoreboard_value.filter( y => y.id == team.id)

      const {name, id, gp, fg, ft, tpm, pts, oreb, dreb, ast, st, blk, to, pf} = team

      return(
        <tr key={index}>
          <td scope="col">{name}</td>
          <td scope="col">{h[0].total_value}</td>
          <td scope="col">0</td>
          <td scope="col">{fg}</td>
          <td scope="col">{ft}</td>
          <td scope="col">{tpm}</td>
          <td scope="col">{pts}</td>
          <td scope="col">{oreb}</td>
          <td scope="col">{dreb}</td>
          <td scope="col">{ast}</td>
          <td scope="col">{st}</td>
          <td scope="col">{blk}</td>
          <td scope="col">{to}</td>
          <td scope="col">{pf}</td>
        </tr>
      )
    })
  }

  renderScoreboard() {
    const league_name = this.props.league_name
    const league_current_week = this.props.league_current_week

    return (
      <div>
        <h3>{league_name} week {league_current_week} 戰力表</h3>
        <table className="table table-sm">
          <tbody className="thead-dark">
            <tr>
              <th>隊伍名稱</th>
              <th>戰力值</th>
              <th>出場數(GP)</th>
              <th>FG%</th>
              <th>FT%</th>
              <th>3PTM</th>
              <th>PTS</th>
              <th>OREB</th>
              <th>DREB</th>
              <th>AST</th>
              <th>ST</th>
              <th>BLK</th>
              <th>TO</th>
              <th>PF</th>
            </tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }

  renderNoToken() {
      <div>
        取得Yahoo Fantasy 授權
      </div>
  }

  renderChart() {
    let ctx = document.getElementById('myChart')
    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
  }

  render() {
    if(!this.props.fetchInProgress){
      return (
        <div>
          {this.props.scoreboard.length > 0 ? this.renderScoreboard() : this.renderNoToken()}
        </div>
      )
    }
    else{
      return (
        <div>
          等待資料中
        </div>
      )
    }
  }
}

export default Table;

