import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class WeekScoreTable extends React.Component {
  constructor(props) {
    super(props)
  }

  // 數值越大，分數越高
  sortScoreboard(arr, num, toSort) {
    let newArray = arr.concat(num)

    if(toSort == 'asc')
      newArray.sort((a,b) => parseFloat(a)-parseFloat(b))
    else
      newArray.sort((a,b) => parseFloat(b)-parseFloat(a))

    return newArray.indexOf(num) + 1
  }

  renderTableData(week) {
    // 選擇要計算的 week 成績
    let selectWeekScoreboard = this.props.scoreboardArray.filter(x => x.week == week)
    // 比項
    let leagueStatsArray = this.props.leagueStatsArray
    // 複製成計分板
    let scoreboardValue = JSON.parse(JSON.stringify(selectWeekScoreboard))
    // 單項分數
    let singleValue = 0

    // 算出各個項目的成績
    // 從每一隊的第一個比項開始算
    for(let i = 0; i< leagueStatsArray.length; i++) {
      let statName = leagueStatsArray[i].name
      let sortOrder  = leagueStatsArray[i].sort_order
      let totalArray = selectWeekScoreboard.map(x => x[statName])
      let totalValue = 0

      // x等於各隊數據
      selectWeekScoreboard.map(x => {
        let c = scoreboardValue.filter( y => y.id == x.id)

        //取得分數
        if(sortOrder == 1)
          singleValue = x[statName] ? this.sortScoreboard(totalArray, x[statName], 'asc') : 0
        else
          singleValue = x[statName] ? this.sortScoreboard(totalArray, x[statName], 'desc') : 0

        // 尋找對應的隊伍計分板
        c[0][statName] = singleValue

        // 加總到total_value
        if (c && c[0]['total_value']) {
          c[0]['total_value'] = c[0]['total_value'] + singleValue
        }
        else{
          c[0]['total_value'] = singleValue
        }
      })
    }

    return selectWeekScoreboard.map((team, index) => {
      // 從對應計分板尋找總分
      let h = scoreboardValue.filter( y => y.id == team.id)

      const cell = []
      cell.push(<td key="0" scope="col" >{team.name}</td>)
      cell.push(<td key="1" scope="col" >{h[0].total_value}</td>)
      cell.push(<td key="2" scope="col" >{team.g}</td>)

      for(let i = 4; i < Object.keys(team).length; i++){
          cell.push(<td key={i} scope="col" >{ Object.values(team)[i] ? Object.values(team)[i] : '-' }</td>)
      }

      return(
        <tr key={index}>
          {cell}
        </tr>
      )
    })
  }

  renderWeekBtn(weekArray) {
    let btn = weekArray.map( week =>
      <input key={week} className="btn btn-info btn-sm mr-3" type="button" value={week} onClick={this.props.handleChangeWeek.bind(this)} />
    )
    return(<div className="mt-3">{btn}</div>)
  }

  renderScoreboard(weekArray) {
    const leagueName = this.props.leagueName
    const selectWeek = this.props.selectWeek

    const hidden = { 'display': 'none' }

    const totalTable = weekArray.map( week =>
      <div key={week} style={ week == selectWeek ? null : hidden }>
        <div className="mt-2">
          <h4>{leagueName} week {week} 戰力表</h4>
        </div>
        <div className="custom-table-width">
          <table className="table table-sm">
            <tbody className="thead-dark">
              <tr>
                <th>隊伍名稱</th>
                <th>戰力值</th>
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
              {this.renderTableData(week)}
            </tbody>
          </table>
        </div>
      </div>
    )
    return (
      <div>
        {totalTable}
      </div>
    )
  }

  renderNoToken() {
      <div>
        取得Yahoo Fantasy 授權
      </div>
  }

  render() {
    // 過去4週的對戰表印出
    let thisWeek = this.props.leagueCurrentWeek
    let minWeek = thisWeek - 4
    let weekArray = []
    while(thisWeek >= minWeek && thisWeek > 0) {
      weekArray.push(thisWeek)
      thisWeek -= 1
    }

    if(!this.props.fetchInProgress){
      return (
        <div>
          {this.renderWeekBtn(weekArray)}
          {this.renderScoreboard(weekArray)}
        </div>
      )
    }
    else {
      // 資料處理中
      const loadingStyle = {
        width: '3rem',
        height: '3rem'
      }

      const loadingPositon = {
        height: '100px'
      }
      return(
      <div className="row justify-content-center align-items-center" style={loadingPositon}>
        <div className="spinner-border" style={loadingStyle} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>)
    }
  }
}

export default WeekScoreTable

