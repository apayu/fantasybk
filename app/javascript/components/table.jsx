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
    // 比項
    let league_stats = this.props.league_stats
    // 複製成計分板
    let scoreboard_value = JSON.parse(JSON.stringify(select_week_scoreboard))
    // 單項分數
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
        let c = scoreboard_value.filter( y => y.id == x.id)

        //取得分數
        if(sort_order == 1)
          single_value = this.sortScoreboard(total_array, x[stat_name], "asc")
        else
          single_value = this.sortScoreboard(total_array, x[stat_name], "desc")

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

    return select_week_scoreboard.map((team, index) => {
      // 從對應計分板尋找總分
      let h = scoreboard_value.filter( y => y.id == team.id)

      const cell = []
      cell.push(<td key="0" scope="col" >{team.name}</td>)
      cell.push(<td key="1" scope="col" >{h[0].total_value}</td>)
      cell.push(<td key="2" scope="col" >{team.g}</td>)

      for(let i = 4; i < Object.keys(team).length; i++){
          cell.push(<td key={i} scope="col" >{Object.values(team)[i]}</td>)
      }

      return(
        <tr key={index}>
          {cell}
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

