import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import WeekScoreTable from 'components/weekScoreTable'
import SeasonScoreLine from 'components/seasonScoreLine'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

// App
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 聯盟名稱
      leagueName: '',
      // 聯盟隊伍數量
      leagueNumTeams: 0,
      // 聯盟開始週數
      leagueStartWeek: '1',
      // 聯盟目前週數
      leagueCurrentWeek: '1',
      // 聯盟比項
      leagueStatsArray: [],
      // 數據板
      scoreboardArray: [],
      // 排序條件
      sortTableConditons: {
        head: 'total_value',
        sort: 'desc'
      },
      // 正在取得資料
      fetchInProgress: true,
      // 取得失敗
      fetchSuccess: true,
      // 選擇目前秀出的week成績
      selectWeek: '1'
    }

    this.handleChangeWeek = this.handleChangeWeek.bind(this)
    this.handleSortValue = this.handleSortValue.bind(this)
  }

  componentDidMount() {
    const url = '/api/v1/leagues/index'
    fetch(url).then(response => {
      if(!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then(response => {
      this.setState({
        leagueName: response.leagueName,
        leagueNumTeams: response.league_num_teams,
        leagueStartWeek: response.league_start_week,
        leagueCurrentWeek: response.league_current_week,
        leagueStatsArray: response.league_stats,
        scoreboardArray: response.scoreboard,
        fetchInProgress: false,
        selectWeek: response.league_current_week})
    })
    .catch((error) => {
      this.setState({
        fetchSuccess: false })
    })
  }

  // 切換顯示week
  handleChangeWeek(event) {
    this.setState({selectWeek:event.target.value})
  }

  // 每週戰力排序
  handleSortValue(event) {
    let sortTableConditons = this.state.sortTableConditons
    const click = event.target.dataset.item

    if(click == sortTableConditons.head) {
      if(sortTableConditons.sort == 'desc') {
        this.setState({sortTableConditons: {head: click, sort: 'asc'}})
      }
      else {
        this.setState({sortTableConditons: {head: click, sort: 'desc'}})
      }
    }else {
        this.setState({sortTableConditons: {head: click, sort: 'desc'}})
    }
  }

  render() {
    const chartStyle = {
      position: 'relative',
      margin: 'auto',
      height: '80vh',
      width: '80vw'
    }

    return (
      <div>
        <Tabs defaultActiveKey="currentWeek" id="leagueTabs">
          <Tab eventKey="currentWeek" title="當週戰力">
            <WeekScoreTable
              leagueName = {this.state.leagueName}
              leagueNumTeams = {this.state.leagueNumTeams}
              leagueStartWeek = {this.state.leagueStartWeek}
              leagueCurrentWeek = {this.state.leagueCurrentWeek}
              leagueStatsArray = {this.state.leagueStatsArray}
              scoreboardArray = {this.state.scoreboardArray}
              sortTableConditons = {this.state.sortTableConditons}
              fetchInProgress = {this.state.fetchInProgress}
              fetchSuccess = {this.state.fetchSuccess}
              handleChangeWeek = {this.handleChangeWeek}
              handleSortValue = {this.handleSortValue}
              selectWeek = {this.state.selectWeek}
            />
          </Tab>
          <Tab eventKey="totalValue" title="全年戰力">
            <div style={chartStyle}>
              <SeasonScoreLine
                leagueName = {this.state.leagueName}
                leagueNumTeams = {this.state.leagueNumTeams}
                leagueStartWeek = {this.state.leagueStartWeek}
                leagueCurrentWeek = {this.state.leagueCurrentWeek}
                leagueStatsArray = {this.state.leagueStatsArray}
                scoreboardArray = {this.state.scoreboardArray}
                fetchInProgress = {this.state.fetchInProgress}
                fetchSuccess = {this.state.fetchSuccess}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDom.render(
    <App />,
    document.getElementById('league_app'))
})

