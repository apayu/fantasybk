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
      fetchInProgressByValue: true
    }
  }

  componentDidMount() {

    // 取得網址球員ID
    let url_pathname = String(window.location).split("/")
    let player_id = url_pathname[url_pathname.length - 1]

    this.getPlayerValue(player_id)

    // 利用Promise 一次處理 ajax 初始化
    Promise.all([this.getPlayerInfo(player_id), this.getPlayerLog(player_id)])
                .then(([playerInfo, playerLog])  => {
                  this.setState({
                    playerInfo: playerInfo.playerInfo,
                    leagueInfo: playerInfo.leagueInfo,
                    gameLog: playerLog.game_log,
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

  getPlayerValue(player_id) {
    // 取得球員數據走勢
    const url = "/api/v1/players/value/" + player_id
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        playerWeekValue: response.playerWeekValue,
        fetchInProgressByValue: false}))
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

    // 依照球員隊伍設定頁面顏色
    const teamColor = [
      { name: "DAL", fontColor: "#00538C", borderColor: "#002B5E" },
      { name: "LAL", fontColor: "#552583", borderColor: "#FDB927" },
      { name: "ATL", fontColor: "#E03A3E", borderColor: "#C1D32F" },
      { name: "BOS", fontColor: "#007A33", borderColor: "#BA9653" },
      { name: "BKN", fontColor: "#000000", borderColor: "#777D84" },
      { name: "CHA", fontColor: "#1D1160", borderColor: "#00788C" },
      { name: "CHI", fontColor: "#CE1141", borderColor: "#000000" },
      { name: "CLE", fontColor: "#860038", borderColor: "#041E42" },
      { name: "CLE", fontColor: "#860038", borderColor: "#041E42" },
      { name: "DEN", fontColor: "#0E2240", borderColor: "#FEC524" },
      { name: "DET", fontColor: "#C8102E", borderColor: "#1D42BA" },
      { name: "GSW", fontColor: "#1D428A", borderColor: "#FFC72C" },
      { name: "HOU", fontColor: "#CE1141", borderColor: "#000000" },
      { name: "IND", fontColor: "#002D62", borderColor: "#FDBB30" },
      { name: "LAC", fontColor: "#C8102E", borderColor: "#1D428A" },
      { name: "MEM", fontColor: "#5D76A9", borderColor: "#12173F" },
      { name: "MIA", fontColor: "#98002E", borderColor: "#F9A01B" },
      { name: "MIL", fontColor: "#00471B", borderColor: "#EEE1C6" },
      { name: "MIN", fontColor: "#0C2340", borderColor: "#236192" },
      { name: "NOP", fontColor: "#0C2340", borderColor: "#C8102E" },
      { name: "NYK", fontColor: "#006BB6", borderColor: "#F58426" },
      { name: "OKC", fontColor: "#007AC1", borderColor: "#EF3B24" },
      { name: "ORL", fontColor: "#0077C0", borderColor: "#C4CED4" },
      { name: "PHI", fontColor: "#006BB6", borderColor: "#ED174C" },
      { name: "PHX", fontColor: "#1D1160", borderColor: "#E56020" },
      { name: "POR", fontColor: "#E03A3E", borderColor: "#000000" },
      { name: "SAC", fontColor: "#5A2D81", borderColor: "#63727A" },
      { name: "SAS", fontColor: "#000000", borderColor: "#C4CED4" },
      { name: "TOR", fontColor: "#CE1141", borderColor: "#000000" },
      { name: "UTA", fontColor: "#002B5C", borderColor: "#00471B" },
      { name: "WAS", fontColor: "#002B5C", borderColor: "#E31837" }
    ]
    let fontColor = "#000000"
    let border = "2px splid #FFFFFF"

    if(playerInfo.hasOwnProperty("team_tricode"))
    {
      fontColor = teamColor.find( x => x.name == playerInfo.team_tricode).fontColor
      border = "2px solid " +  teamColor.find( x => x.name == playerInfo.team_tricode).borderColor
    }

    return(
      <div>
        <div style={{border: border}} className="row pb-3">
          <div className="col-4">
            <div className="row h-75 align-items-center">
              <div className="col-12">
                <h3>{playerInfo.hasOwnProperty("name") ? playerInfo.name : ""}</h3>
                <h5 style={{color: fontColor}}>{playerInfo.hasOwnProperty("team_name") ? playerInfo.team_name : ""}</h5>
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
                  fetchInProgressByValue = {this.state.fetchInProgressByValue}
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
