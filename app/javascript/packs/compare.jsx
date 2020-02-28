import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import CompareRadar from 'components/compareRadar'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerList: [],
      playerScoreList: {
        playerA:{},
        playerB:{}
      },
      fetchInProgressByList: true
    }
    this.handleSelectPlayer = this.handleSelectPlayer.bind(this)
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

  handleSelectPlayer(event) {
    const playerId = event.target.value
    const playerSign = event.target.dataset.player
    this.getPlayerScore(playerId, playerSign)
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
    const playerA = this.state.playerScoreList.playerA
    const playerB = this.state.playerScoreList.playerB
    const playerAName = playerA.hasOwnProperty('name') ? playerA.name : ''
    const playerBName = playerB.hasOwnProperty('name') ? playerB.name : ''

    return(
      <div>
        <div className="row">
          <div className="col-4">{this.renderPlayerList('a')}</div>
          <div className="col-4"><CompareRadar playerScoreList = {this.state.playerScoreList} /></div>
          <div className="col-4">{this.renderPlayerList('b')}</div>
        </div>
        <div className="row m-2">
          <div className="col"><h2>{playerAName} vs {playerBName}</h2></div>
        </div>
        <div className="row">
          <div className="col">表格</div>
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
