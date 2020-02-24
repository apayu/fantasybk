import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import PlayerLineChart from 'components/playerLineChart'
import GameLogTable from 'components/gameLogTable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerWeekValue: [],
      gameLog: [],
      fetchInProgressByLog: true,
      fetchInProgressByShow: true
    }
  }

  componentDidMount() {

    // 取得球員ID
    let url_pathname = String(window.location).split("/")
    let player_id = url_pathname[url_pathname.length - 1]

    const urlForLog = "/api/v1/players/log/" + player_id
    fetch(urlForLog).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        gameLog: response.game_log,
        fetchInProgressByLog: false}))

    const urlForShow = "/api/v1/players/show/" + player_id
    fetch(urlForShow).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        playerWeekValue: response.playerWeekValue,
        fetchInProgressByShow: false}))
  }

  render() {
    const chartStyle = {
      position: "relative",
      margin: "auto",
      height: "40vh",
      width: "80vw"
    }

    return(
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
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <App />,
    document.getElementById("player_app")
  )
})
