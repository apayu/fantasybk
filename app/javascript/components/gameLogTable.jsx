import React from "react"
import RactDOM from "react-dom"
import PropType from "prop-types"

class GameLogTable extends React.Component {
  constructor(props) {
    super(props)
  }

  rgbaToHex(color) {
      const values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
      const colorValue = parseFloat(values[3] || 1)
      const red = Math.floor(colorValue * parseInt(values[0]) + (1 - colorValue) * 255)
      const green = Math.floor(colorValue * parseInt(values[1]) + (1 - colorValue) * 255)
      const blue = Math.floor(colorValue * parseInt(values[2]) + (1 - colorValue) * 255)

      return '#' +
        ('0' + red.toString(16)).slice(-2) +
        ('0' + green.toString(16)).slice(-2) +
        ('0' + blue.toString(16)).slice(-2)
  }

  getColorByNumber(eff, max, min) {

    let red = 255
    let green = 255
    let blue = 255
    let colorPercent = 0
    let difValue = 0

    // EFF 小於10 開始變紅色
    if(eff <= 10) {
      difValue = 10 - eff
      // 剛好等於10不要白色，給點紅色
      if(difValue == 0)
      {
        red = 255
        green = 240
        blue = 240
      }
      else {
        colorPercent = difValue >= 12 ? 1 : difValue/12
        red = 255
        green = 255 - (255 * colorPercent)
        blue = 255 - (255 * colorPercent)
      }
    }
    else {
      if(eff > 30)
      {
        // EFF大於30深綠色
        colorPercent = eff >= 50 ? 50 : eff/max
        red = 0
        green = 255 - (55 * colorPercent)
        blue = 0
      }
      else {
        // 小於30淺綠色
        colorPercent = eff/max;
        red = 255 - (255 * colorPercent)
        green = 255
        blue = 255 - (255 * colorPercent)
      }
    }

    red = parseInt(red)
    green = parseInt(green)
    blue = parseInt(blue)

    return this.rgbaToHex('rgb(' + red + ',' + green + ',' + blue + ')')
  }

  renderTableHeader() {
    const tableHeader = ['Date', 'Min', 'EFF', 'FGM', 'FGA', 'FG%',
      '3PM', '3PA', '3P%', 'FTM', 'FTA', 'FT%', 'OR', 'DR', 'Reb', 'Ast', 'Stl', 'Blk', 'TO', 'PF', 'Pts']
    return(
      <tr>{tableHeader.map(title => <th key={title}>{title}</th>)}</tr>
    )
  }

  renderTableDate() {
    const gameLog = this.props.gameLog
    // eff改變顏色最大小值
    const max = 50
    const min = -5

    let eff = 0
    let color = '#000000'

    return gameLog.map((log, index) => {
      const cell = []

      eff = (parseInt(log['points']) + parseInt(log['tot_reb']) + parseInt(log['assists']) + parseInt(log['steals']) + parseInt(log['blocks'])) - (parseInt(log['fga']) - parseInt(log['fgm'])) - (parseInt(log['fta']) - parseInt(log['ftm'])) - parseInt(log['turnovers'])

      color = this.getColorByNumber(eff, max, min)

      let gameDate = new Date(log['game_time'])

      cell.push(<td key='game_time'>{gameDate.getMonth()+1}/{gameDate.getDate()}</td>)
      cell.push(<td key='min'>{log['min'] == "" ? '00:00' : log['min']}</td>)
      cell.push(<td key='eff' style={{backgroundColor: color}} >{eff}</td>)
      cell.push(<td key='fgm'>{log['fgm']}</td>)
      cell.push(<td key='fga'>{log['fga']}</td>)
      cell.push(<td key='fgp'>{log['fgp']}%</td>)
      cell.push(<td key='tpm'>{log['tpm']}</td>)
      cell.push(<td key='tpa'>{log['tpa']}</td>)
      cell.push(<td key='tpp'>{log['tpp']}%</td>)
      cell.push(<td key='ftm'>{log['ftm']}</td>)
      cell.push(<td key='fta'>{log['fta']}</td>)
      cell.push(<td key='ftp'>{log['ftp']}%</td>)
      cell.push(<td key='off_reb'>{log['off_reb']}</td>)
      cell.push(<td key='def_reb'>{log['def_reb']}</td>)
      cell.push(<td key='tot_reb'>{log['tot_reb']}</td>)
      cell.push(<td key='assists'>{log['assists']}</td>)
      cell.push(<td key='steals'>{log['steals']}</td>)
      cell.push(<td key='blocks'>{log['blocks']}</td>)
      cell.push(<td key='turnovers'>{log['turnovers']}</td>)
      cell.push(<td key='p_fouls'>{log['p_fouls']}</td>)
      cell.push(<td key='points'>{log['points']}</td>)
      return(
        <tr key={index}>
          {cell}
        </tr>
      )}
    )
  }

  render() {
    const fetchInProgressByLog = this.props.fetchInProgressByLog
    if(!fetchInProgressByLog){
      return(
        <div className="mt-1">
          <div className="custom-table-width">
            <table className="table table-sm">
              <tbody className="thead-dark">
                {this.renderTableHeader()}
                {this.renderTableDate()}
              </tbody>
            </table>
          </div>
        </div>
      )
    }else{
      return(<div>處理中</div>)
    }
  }
}

export default GameLogTable
