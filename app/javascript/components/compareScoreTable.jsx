import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class CompareScoreTable extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTableData() {
    const playerScoreList = this.props.playerScoreList
    const playerList = Object.values(playerScoreList)
    let tr = []
    playerList.map((player,index)=>{
      let cell = []
      if(player.hasOwnProperty('player_id')){
        let value = parseFloat(player.field_goal_value) + parseFloat(player.free_throw_value) + parseFloat(player.points_value) + parseFloat(player.three_point_value) + parseFloat(player.tot_reb_value) + parseFloat(player.assists_value) + parseFloat(player.steals_value) + parseFloat(player.blocks_value) + parseFloat(player.turnovers_value)

        cell.push(<th key="0" scope="row">{player.name}</th>)
        cell.push(<td key="1">{player.tricode}</td>)
        cell.push(<td key="2">{player.pos}</td>)
        cell.push(<td key="3">{player.g}</td>)
        cell.push(<td key="4">{player.min.slice(3,8)}</td>)
        cell.push(<td key="5">{parseFloat(player.field_goal_value).toFixed(2)}</td>)
        cell.push(<td key="6">{parseFloat(player.free_throw_value).toFixed(2)}</td>)
        cell.push(<td key="7">{parseFloat(player.points_value).toFixed(2)}</td>)
        cell.push(<td key="8">{parseFloat(player.three_point_value).toFixed(2)}</td>)
        cell.push(<td key="9">{parseFloat(player.tot_reb_value).toFixed(2)}</td>)
        cell.push(<td key="10">{parseFloat(player.assists_value).toFixed(2)}</td>)
        cell.push(<td key="11">{parseFloat(player.steals_value).toFixed(2)}</td>)
        cell.push(<td key="12">{parseFloat(player.blocks_value).toFixed(2)}</td>)
        cell.push(<td key="13">{parseFloat(player.turnovers_value).toFixed(2)}</td>)
        cell.push(<td key="14">{value.toFixed(2)}</td>)
      }
      tr.push(<tr key={index}>{cell}</tr>)
    })
    return(tr)
  }

  renderTableHeader() {
    const playerA = this.props.playerScoreList.playerA
    const playerB = this.props.playerScoreList.playerB
    const player = playerA || playerB
    let cell = []
    if(player.hasOwnProperty('player_id')){
      cell.push(<th key="0" scope="col">姓名</th>)
      cell.push(<th key="1" scope="col">球隊</th>)
      cell.push(<th key="2" scope="col">位置</th>)
      cell.push(<th key="3" scope="col">出賽</th>)
      cell.push(<th key="4" scope="col">時間</th>)
      cell.push(<th key="5" scope="col">FG%</th>)
      cell.push(<th key="6" scope="col">FT%</th>)
      cell.push(<th key="7" scope="col">PTS</th>)
      cell.push(<th key="8" scope="col">3PTM</th>)
      cell.push(<th key="9" scope="col">REB</th>)
      cell.push(<th key="10" scope="col">AST</th>)
      cell.push(<th key="11" scope="col">ST</th>)
      cell.push(<th key="12" scope="col">BLK</th>)
      cell.push(<th key="13" scope="col">TO</th>)
      cell.push(<th key="14" scope="col">價值</th>)
    }
    return(<tr>{cell}</tr>)
  }

  render(){
    return(
        <div className="mt-1">
          <div className="custom-table-width">
            <table className="table table-sm">
              <thead className="thead-dark">
                {this.renderTableHeader()}
              </thead>
              <tbody>
                {this.renderTableData()}
              </tbody>
            </table>
          </div>
        </div>
    )
  }
}

export default CompareScoreTable
