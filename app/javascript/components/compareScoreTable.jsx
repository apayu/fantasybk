import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class CompareScoreTable extends React.Component {
  constructor(props) {
    super(props)
  }
  rgbaToHex(color) {
      const values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',')
      const colorValue = parseFloat(values[3] || 1),
        red = Math.floor(colorValue * parseInt(values[0]) + (1 - colorValue) * 255),
        green = Math.floor(colorValue * parseInt(values[1]) + (1 - colorValue) * 255),
        blue = Math.floor(colorValue * parseInt(values[2]) + (1 - colorValue) * 255)

      return "#" +
        ("0" + red.toString(16)).slice(-2) +
        ("0" + green.toString(16)).slice(-2) +
        ("0" + blue.toString(16)).slice(-2)
  }

  getColorByNumber(score) {

      const max = 5
      const min = -3

      let red = 255
      let green = 255
      let blue = 255

    if(score < 0) {
      score = score < min ? -3 : score
      var one = (-1 * score)/( -1 * min)
      red = 255
      green = 255 - (255 * one)
      blue = 255 - (255 * one)
    }

    if(score > 0) {
      score = score > max ? 5 : score
      var two = score/max
      red = 255 - (255 * two)
      green = 255
      blue = 255 - (255 * two)
    }

      red = parseInt(red)// 取整
      green = parseInt(green)// 取整
      blue = parseInt(blue)// 取整

      return this.rgbaToHex("rgb(" + red + "," + green + "," + blue + ")")
  }

  renderTableData() {
    const playerScoreList = this.props.playerScoreList
    const playerList = Object.values(playerScoreList)
    let tr = []
    playerList.map((player,index)=>{
      let cell = []
      if(player.hasOwnProperty('player_id')){
        const field_goal_value = parseFloat(player.field_goal_value)
        const free_throw_value = parseFloat(player.free_throw_value)
        const points_value = parseFloat(player.points_value)
        const three_point_value = parseFloat(player.three_point_value)
        const tot_reb_value = parseFloat(player.tot_reb_value)
        const assists_value = parseFloat(player.assists_value)
        const steals_value = parseFloat(player.steals_value)
        const blocks_value = parseFloat(player.blocks_value)
        const turnovers_value = parseFloat(player.turnovers_value)

        let value = field_goal_value + free_throw_value + points_value + three_point_value + tot_reb_value + assists_value + steals_value + blocks_value + turnovers_value


        cell.push(<th key="0" scope="row">{player.name}</th>)
        cell.push(<td key="1">{player.tricode}</td>)
        cell.push(<td key="2">{player.pos}</td>)
        cell.push(<td key="3">{player.g}</td>)
        cell.push(<td key="4">{player.min.slice(3,8)}</td>)

        const fgColor = this.getColorByNumber(field_goal_value)
        cell.push(<td style={{backgroundColor: fgColor}} key="5">{field_goal_value.toFixed(2)}</td>)

        const ftColor = this.getColorByNumber(free_throw_value)
        cell.push(<td style={{backgroundColor: ftColor}} key="6">{free_throw_value.toFixed(2)}</td>)

        const ptsColor = this.getColorByNumber(points_value)
        cell.push(<td style={{backgroundColor: ptsColor}} key="7">{points_value.toFixed(2)}</td>)

        const tpmColor = this.getColorByNumber(three_point_value)
        cell.push(<td style={{backgroundColor: tpmColor}} key="8">{three_point_value.toFixed(2)}</td>)

        const rebColor = this.getColorByNumber(tot_reb_value)
        cell.push(<td style={{backgroundColor: rebColor}} key="9">{tot_reb_value.toFixed(2)}</td>)

        const astColor = this.getColorByNumber(assists_value)
        cell.push(<td style={{backgroundColor: astColor}} key="10">{assists_value.toFixed(2)}</td>)

        const stColor = this.getColorByNumber(steals_value)
        cell.push(<td style={{backgroundColor: stColor}} key="11">{steals_value.toFixed(2)}</td>)

        const blkColor = this.getColorByNumber(blocks_value)
        cell.push(<td style={{backgroundColor: blkColor}} key="12">{blocks_value.toFixed(2)}</td>)

        const toColor = this.getColorByNumber(turnovers_value)
        cell.push(<td style={{backgroundColor: toColor}} key="13">{turnovers_value.toFixed(2)}</td>)
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
            <table className="table table-sm compare-score-table">
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
