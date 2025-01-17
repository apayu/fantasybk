import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import CompareRadar from 'components/compareRadar'
import CompareScoreTable from 'components/compareScoreTable'
import CompareValueLine from 'components/compareValueLine'
import InputAutoComplate from 'components/inputAutoComplete'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerList: [],
      playerScoreList: {
        playerA:{},
        playerB:{}
      },
      playerWeekValue: {
        playerA:[],
        playerB:[]
      },
      fetchInProgressByList: true,
      value: '',
      reSetInput: false
    }
    this.handleSelectPlayer = this.handleSelectPlayer.bind(this)
    this.handleAutoCompleteClick = this.handleAutoCompleteClick.bind(this)
  }

  componentDidMount() {
    this.getPlayerList()
  }

  // 取得球員列表
  getPlayerList() {
    const url = '/api/v1/players/list'
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        playerList: response.playerList,
        fetchInProgressByList: false
      })
    )
  }

  // 取得球員score
  getPlayerScore(playerId, playerSign) {
    const url = '/api/v1/players/score/' + playerId
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response => {
      let playerScoreList = this.state.playerScoreList
      if(playerSign == 'a') {
        playerScoreList.playerA = response.playerValue[0]
      }else {
        playerScoreList.playerB = response.playerValue[0]
      }
      this.setState({
        playerScoreList: playerScoreList
      })
    })
  }

  // 取得球員數據走勢
  getPlayerValue(playerId, playerSign) {
    const url = '/api/v1/players/value/' + playerId
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response => {
      let playerWeekValue = this.state.playerWeekValue
      if(playerSign == 'a') {
        playerWeekValue.playerA = response.playerWeekValue
      }else {
        playerWeekValue.playerB = response.playerWeekValue
      }
      this.setState({
        playerWeekValue: playerWeekValue
      })
    })
  }

  // 選擇球員
  handleSelectPlayer(event) {
    const playerId = event.target.value
    const playerSign = event.target.dataset.player
    this.getPlayerScore(playerId, playerSign)
    this.getPlayerValue(playerId, playerSign)
  }

  // 選擇球員autocomplete
  handleAutoCompleteClick(playerId, playerSign) {
    this.getPlayerScore(playerId, playerSign)
    this.getPlayerValue(playerId, playerSign)
  }

  renderPlayerList(playerSign) {
    const playerList = this.state.playerList
    let option = []
    playerList.forEach((p, i) => {
      option.push(<option key={i} value={p.id}>{p.name}</option>)
    })

    return(
      <select data-player={playerSign} onChange={this.handleSelectPlayer.bind(this)} className="custom-select" size="15">
        {option}
      </select>)
  }

  render() {
    const { playerA, playerB } = this.state.playerScoreList
    const playerAName = playerA.hasOwnProperty('name') ? playerA.name : ''
    const playerBName = playerB.hasOwnProperty('name') ? playerB.name : ''
    // const playerList = Object.values(this.state.playerList).map(item => item.name)
    const playerList = this.state.playerList
    const chartStyle = {
      position: 'relative',
      margin: 'auto',
      height: '40vh',
      width: '80vw'
    }

    return(
      <div>
        <div className="row">
          <div className="col-4">
            <div>
              <InputAutoComplate
                handleAutoCompleteClick={this.handleAutoCompleteClick}
                suggestions = {playerList}
                playerSign = 'a'
              />
            </div>
            <div>{this.renderPlayerList('a')}</div>
          </div>
          <div className="col-4"><CompareRadar playerScoreList = {this.state.playerScoreList} /></div>
          <div className="col-4">
            <div>
              <InputAutoComplate
                handleAutoCompleteClick={this.handleAutoCompleteClick}
                suggestions = {playerList}
                playerSign = 'b'
              />
            </div>
            <div>{this.renderPlayerList('b')}</div>
          </div>
        </div>
        <div className="row m-2">
          <div className="col text-right"><h2>{playerAName}</h2></div>
          <div className="col-1 text-center"><h2>vs</h2></div>
          <div className="col text-left"><h2>{playerBName}</h2></div>
        </div>
        <div className=" row mt-3">
          <div className="col">
            <Tabs defaultActiveKey="compareScore" id="compareTabs">
              <Tab eventKey="compareScore" title="數據比較">
                <CompareScoreTable playerScoreList = {this.state.playerScoreList} />
              </Tab>
              <Tab eventKey="compareEff" title="近期表現">
                <div style={chartStyle}>
                  <CompareValueLine playerWeekValue = {this.state.playerWeekValue} />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDom.render(
    <App />,
    document.getElementById('compare_app'))
})
