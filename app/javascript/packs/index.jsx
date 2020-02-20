// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 聯盟名稱
      league_name: "",
      // 聯盟隊伍數量
      league_num_teams: 0,
      // 聯盟開始週數
      league_start_week: "1",
      // 聯盟目前週數
      league_current_week: "1",
      // 數據板
      scoreboard: [],
      // 數據板換算得分
      scoreboard_value:[],
      // 正在取得資料
      fetchInProgress: true
    }
  }

  componentDidMount() {
    const url = "/api/v1/leagues/index"
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        league_name: response.league_name,
        league_num_teams: response.league_num_teams,
        league_start_week: response.league_start_week,
        league_current_week: response.league_current_week,
        scoreboard: response.scoreboard,
        fetchInProgress: false}))
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
    // 選擇要秀出的 week 成績
    let select_week_scoreboard = this.state.scoreboard.filter(x => x.week === this.state.league_current_week)
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
    const league_name = this.state.league_name
    const league_current_week = this.state.league_current_week

    return (
      <div>
        <h1>{league_name} week {league_current_week} 戰力表</h1>
        <table className="table">
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
    if(!this.state.fetchInProgress){
      return (
        <div>
            {this.state.scoreboard.length > 0 ? this.renderScoreboard() : this.renderNoToken()}
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

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <Table />,
    document.body.appendChild(document.createElement("div"))
  )
})

