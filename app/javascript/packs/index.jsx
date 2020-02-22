// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Table from 'components/table'
import LineChart from 'components/lineChart'

// App
class App extends React.Component {
  constructor(props) {
    super(props);

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

  render() {
    return (
      <div className="App">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">戰力表</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">全年戰力</a>
          </li>
        </ul>
        <Table
          league_name = {this.state.league_name}
          league_num_teams = {this.state.league_num_teams}
          league_start_week = {this.state.league_start_week}
          league_current_week = {this.state.league_current_week}
          scoreboard = {this.state.scoreboard}
          fetchInProgress = {this.state.fetchInProgress}
        />
        <div className="chart-wrapper">
          <LineChart
            scoreboard = {this.state.scoreboard}
            league_start_week = {this.state.league_start_week}
            league_current_week = {this.state.league_current_week}
            fetchInProgress = {this.state.fetchInProgress}
          />
        </div>
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <App />,
    document.body.appendChild(document.createElement("div"))
  )
})

