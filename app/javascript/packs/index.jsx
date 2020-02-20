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
      league_start_week: 1,
      // 聯盟目前週數
      league_current_week: 1,
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

  // renderTableHeader() {
  //   let header = Object.keys(this.state.scoreboard[0])
  //   return header.map((key, index) => {
  //     return <th key={index}>{key.toUpperCase()}</th>
  //   })
  // }

  // 數值越大，分數越高
  sortScoreboard_asc(arr, num) {
    let newArray = arr.concat(num)
    newArray.sort((a,b) => parseFloat(a)-parseFloat(b))
    return newArray.indexOf(num) + 1
  }

  // 數值越大，分數越小
  sortScoreboard_desc(arr, num) {
    let newArray = arr.concat(num)
    newArray.sort((a,b) => parseFloat(b)-parseFloat(a))
    return newArray.indexOf(num) + 1
  }

  renderTableDateByValue() {
    // 選擇要秀出的 week 成績
    let select_week = this.state.scoreboard.filter(x => x.week === "16")
    let scoreboard_value = select_week
    let ss = 0
    for(let i = 3; i <= 13; i++) {
      let total_array = select_week.map(x => Object.values(x)[i])
      select_week.map(x=> {
        let value_item  = Object.keys(x)[i]
        let c = scoreboard_value.filter( y => y.id === x.id)

        if(value_item.toLowerCase() == "to" || value_item.toLowerCase() == "pf")
          ss = this.sortScoreboard_desc(total_array, Object.values(x)[i])
        else
          ss = this.sortScoreboard_asc(total_array, Object.values(x)[i])
        // 尋找對應的隊伍計分板
        c[0][value_item] = ss
      })
    }

    return scoreboard_value.map((team, index) => {
      const {name, id, gp, fg, ft, tpm, pts, oreb, dreb, ast, st, blk, to, pf} = team
      return(
        <tr key={index}>
          <td scope="col">{name}</td>
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

  renderTableData() {
    // 選擇要秀出的 week 成績
    let select_week = this.state.scoreboard.filter(x => x.week === "16")
    return select_week.map((team, index) => {
      const {name, id, gp, fg, ft, tpm, pts, oreb, dreb, ast, st, blk, to, pf} = team
      return(
        <tr key={index}>
          <td scope="col">{name}</td>
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

  renderScoreboardValue() {
    const league_name = this.state.league_name
    const league_current_week = this.state.league_current_week

    return (
      <div>
        <h1>{league_name} week {league_current_week} 戰力表</h1>
        <table className="table">
          <tbody className="thead-dark">
            <tr>
              <th>隊伍名稱</th>
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
            {this.renderTableDateByValue()}
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
          <div>
              {this.state.scoreboard.length > 0 ? this.renderScoreboard() : this.renderNoToken()}
          </div>
          <div>
              {this.state.scoreboard.length > 0 ? this.renderScoreboardValue() : this.renderNoToken()}
          </div>
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

