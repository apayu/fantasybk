import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import PlayerLineChart from 'components/playerLineChart'
import GameLogTable from 'components/gameLogTable'
import PlayerRadar from 'components/playerRadar'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerInfo: {},
      leagueInfo: {},
      playerWeekValue: [],
      gameLog: [],
      fetchInProgressByInfo: true,
      fetchInProgressByLog: true,
      fetchInProgressByShow: true
    }
  }

  componentDidMount() {

    // 取得網址球員ID
    let url_pathname = String(window.location).split("/")
    let player_id = url_pathname[url_pathname.length - 1]

    // 利用Promise 一次處理 ajax 初始化
    Promise.all([this.getPlayerInfo(player_id), this.getPlayerShow(player_id), this.getPlayerLog(player_id)])
                .then(([playerInfo, playerShow, playerLog])  => {
                  this.setState({
                    playerInfo: playerInfo.playerInfo,
                    leagueInfo: playerInfo.leagueInfo,
                    gameLog: playerLog.game_log,
                    playerWeekValue: playerShow.playerWeekValue,
                    fetchInProgressByShow:false,
                    fetchInProgressByLog: false,
                    fetchInProgressByInfo: false})
                })
  }

  getPlayerInfo(player_id) {
    // 取得球員info
    const urlForInfo = "/api/v1/players/info/" + player_id
    return fetch(urlForInfo).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
  }

  getPlayerLog(player_id) {
    // 取得球員game log
    const url = "/api/v1/players/log/" + player_id
    return fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
  }

  getPlayerShow(player_id) {
    // 取得球員數據走勢
    const url = "/api/v1/players/show/" + player_id
    return fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
  }

  render() {
    const chartStyle = {
      position: "relative",
      margin: "auto",
      height: "40vh",
      width: "80vw"
    }

    const chartRadarStyle = {
      position: "relative",
      margin: "auto",
      height: "40vh",
      width: "40vw"
    }

    let playerInfo = this.state.playerInfo

    return(
      <div>
        <div className="row pb-3 border-bottom border-dark">
          <div className="col-4">
            <div className="row h-75">
              <div className="col-12">
                <h3>{playerInfo.hasOwnProperty("name") ? playerInfo.name : ""}</h3>
                <h5>{playerInfo.hasOwnProperty("team_name") ? playerInfo.team_name : ""}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-3">位置</div>
              <div className="col-3">得分</div>
              <div className="col-3">籃板</div>
              <div className="col-3">助攻</div>
            </div>
            <div className="row">
              <div className="col-3">{playerInfo.hasOwnProperty("pos") ? playerInfo.pos : ""}</div>
              <div className="col-3">{playerInfo.hasOwnProperty("points") ? playerInfo.points : 0}</div>
              <div className="col-3">{playerInfo.hasOwnProperty("tot_reb") ? playerInfo.tot_reb : 0}</div>
              <div className="col-3">{playerInfo.hasOwnProperty("assists") ? playerInfo.assists : 0}</div>
            </div>
          </div>
          <div className="col-8">
            <div style={chartRadarStyle}>
            <PlayerRadar
              playerInfo = {this.state.playerInfo}
              leagueInfo = {this.state.leagueInfo}
              fetchInProgressByInfo = {this.state.fetchInProgressByInfo}
            />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Tabs defaultActiveKey="gameLog" id="leagueTabs">
            <Tab eventKey="gameLog" title="逐場表現">
              <GameLogTable
                gameLog = {this.state.gameLog}
                fetchInProgressByLog = {this.state.fetchInProgressByLog}
              />
            </Tab>
            <Tab eventKey="totalValue" title="數據走勢">
              <div style={chartStyle}>
                <PlayerLineChart
                  playerWeekValue = {this.state.playerWeekValue}
                  fetchInProgressByShow = {this.state.fetchInProgressByShow}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <App />,
    document.getElementById("player_app")
  )
})
