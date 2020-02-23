import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import PlayerLineChart from 'components/playerLineChart'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerWeekValue: [],
      fetchInProgress: true
    }
  }

  componentDidMount() {

    // 取得球員ID
    let url_pathname = String(window.location).split("/")
    let player_id = url_pathname[url_pathname.length - 1]

    const url = "/api/v1/players/show/" + player_id
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        playerWeekValue: response.playerWeekValue,
        fetchInProgress: false}))
  }

  render() {
    const chartStyle = {
      position: "relative",
      margin: "auto",
      height: "40vh",
      width: "80vw"
    }

    return(
      <div>
        <Tabs defaultActiveKey="currentWeek" id="leagueTabs">
          <Tab eventKey="currentWeek" title="近期表現">
            <div>近期表現</div>
          </Tab>
          <Tab eventKey="totalValue" title="數據走勢">
            <div style={chartStyle}>
              <PlayerLineChart
                playerWeekValue = {this.state.playerWeekValue}
                fetchInProgress = {this.state.fetchInProgress}
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
