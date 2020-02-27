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

  // table 排序
  sortTable(scoreboard, tableHead, toSort) {
    if(toSort == 'asc')
      scoreboard.sort((a, b) => parseFloat(a[tableHead]) - parseFloat(b[tableHead]))
    else
      scoreboard.sort((a, b) => parseFloat(b[tableHead]) - parseFloat(a[tableHead]))

    return scoreboard
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
    // 排序條件
    const sortTableConditons = this.props.sortTableConditons

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


    scoreboardValue = this.sortTable(scoreboardValue, sortTableConditons.head, sortTableConditons.sort)

    return scoreboardValue.map((team, index) => {
      const originScoreboard = selectWeekScoreboard.filter( y => y.id == team.id)[0]
      const selectStyle = {
        backgroundColor: '#f3f3f3'
      }

      const cell = []
      cell.push(<td key='0' scope='col' >{team.name}</td>)
      cell.push(<td style={sortTableConditons.head == 'total_value' ? selectStyle : {}} key='1'>{team.total_value}</td>)
      cell.push(<td style={sortTableConditons.head == 'g' ? selectStyle : {}} key='2'>{team.g}</td>)

      for(let i = 4; i < Object.keys(originScoreboard).length; i++){
        const tdName = Object.keys(originScoreboard)[i]
        const tdValue = Object.values(originScoreboard)[i]
        cell.push(<td style={sortTableConditons.head == tdName ? selectStyle : {}} key={i}>{ tdValue  || '-' }</td>)
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

    const totalTable = weekArray.map( week => {
    const leagueStatsArray = this.props.leagueStatsArray
    const thArray = []

    const mouse = {
      cursor: 'pointer'
    }

    // 依照聯盟比項產生
    leagueStatsArray.map( s => {
      thArray.push(<th style={mouse} key={s.name} data-item={s.name} scope="col" onClick={this.props.handleSortValue.bind(this)}>{s.name}</th>)
    })

      return(
      <div key={week} style={ week == selectWeek ? null : hidden }>
        <div className="mt-2">
          <h4>{leagueName} week {week} 戰力表</h4>
        </div>
        <div className="custom-table-width">
          <table className="table table-sm week-score-table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">隊伍名稱</th>
                <th style={mouse} data-item="total_value" scope="col" onClick={this.props.handleSortValue.bind(this)}>戰力值</th>
                <th style={mouse} data-item="g" scope="col" onClick={this.props.handleSortValue.bind(this)}>出場數</th>
                {thArray}
              </tr>
            </thead>
            <tbody >
              {this.renderTableData(week)}
            </tbody>
          </table>
        </div>
      </div>)
    })
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
    }else if(!this.props.fetchSuccess){
      return (
      <div className="row justify-content-center align-items-center" style={{height: '100px'}}>
        找不到聯盟資訊，<a href="/users/edit">檢查聯盟ID</a>或是到<a href="https://www.facebook.com/%E5%8F%B0%E7%81%A3Fantasy%E5%A4%A7%E8%81%AF%E7%9B%9F-106004520979736/" target="_blank">粉絲團</a>私訊管理員
      </div>)

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

