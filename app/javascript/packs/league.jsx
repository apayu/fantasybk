import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Table from 'components/table'
import LineChart from 'components/lineChart'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

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
      // 聯盟比項
      league_stats: [],
      // 數據板
      scoreboard: [],
      // 正在取得資料
      fetchInProgress: true,
      // 選擇目前秀出的week成績
      selectWeek: "1"
    }

    this.handleChangeWeek = this.handleChangeWeek.bind(this)
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
        league_stats: response.league_stats,
        scoreboard: response.scoreboard,
        fetchInProgress: false,
        selectWeek: response.league_current_week}))
  }

  // 切換顯示week
  handleChangeWeek(event) {
    this.setState({selectWeek:event.target.value})
  }

  render() {
    const chartStyle = {
      position: "relative",
      margin: "auto",
      height: "80vh",
      width: "80vw"
    }

    return (
      <div>
        <Tabs defaultActiveKey="currentWeek" id="leagueTabs">
          <Tab eventKey="currentWeek" title="當週戰力">
            <Table
              league_name = {this.state.league_name}
              league_num_teams = {this.state.league_num_teams}
              league_start_week = {this.state.league_start_week}
              league_current_week = {this.state.league_current_week}
              league_stats = {this.state.league_stats}
              scoreboard = {this.state.scoreboard}
              fetchInProgress = {this.state.fetchInProgress}
              handleChangeWeek = {this.handleChangeWeek}
              selectWeek = {this.state.selectWeek}
            />
          </Tab>
          <Tab eventKey="totalValue" title="全年戰力">
            <div style={chartStyle}>
              <LineChart
                league_name = {this.state.league_name}
                league_num_teams = {this.state.league_num_teams}
                league_start_week = {this.state.league_start_week}
                league_current_week = {this.state.league_current_week}
                league_stats = {this.state.league_stats}
                scoreboard = {this.state.scoreboard}
                fetchInProgress = {this.state.fetchInProgress}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <App />,
    document.getElementById("league_app"))
})

