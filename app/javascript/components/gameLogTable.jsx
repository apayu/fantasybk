import React from "react"
import RactDOM from "react-dom"
import PropType from "prop-types"

class GameLogTable extends React.Component {
  constructor(props) {
    super(props)
  }

  rgbaToHex(color) {
      var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
      var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

      return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
  }

  getColorByNumber(n, max, min) {

      var r = 255;
      var g = 255;
      var b = 255;

    // EFF 小於10 開始變紅色
    if(n <= 10) {
      let x = 10 - n
      // 剛好等於10不要白色，給點紅色
      if(x == 0)
      {
        r = 255
        g = 240
        b = 240
      }
      else {
        let one = x/12
        r = 255
        g = 255 - (255 * one)
        b = 255 - (255 * one)
      }
    }
    else {
      if(n > 30)
      {
        // EFF大於30深綠色
        let two = n >= 50 ? 50 : n/max
        r = 0
        g = 255 - (55 * two)
        b = 0
      }
      else {
        // 小於30淺綠色
        let two = n/max;
        r = 255 - (255 * two)
        g = 255
        b = 255 - (255 * two)
      }
    }

    r = parseInt(r);// 取整
    g = parseInt(g);// 取整
    b = parseInt(b);// 取整

    return this.rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
  }

  renderTableHeader() {
    let tableHeader = ["Date", "Min", "EFF", "FGM", "FGA", "FG%",
      "3PM", "3PA", "3P%", "FTM", "FTA", "FT%", "OR", "DR", "Reb", "Ast", "Stl", "Blk", "TO", "PF", "Pts"]
    return(
      <tr>{tableHeader.map(title => <th key={title}>{title}</th>)}</tr>
    )
  }

  renderTableDate() {
    let gameLog = this.props.gameLog

    // 改變顏色最大最小值
    let max = 50
    let min = -5

    return gameLog.map((log, index) => {
      const cell = []

      let eff = (parseInt(log["points"]) + parseInt(log["tot_reb"]) + parseInt(log["assists"]) + parseInt(log["steals"]) + parseInt(log["blocks"])) - (parseInt(log["fga"]) - parseInt(log["fgm"])) - (parseInt(log["fta"]) - parseInt(log["ftm"])) - parseInt(log["turnovers"])

      let c = this.getColorByNumber(eff,max,min)
      console.log(c)
    // player_value[v_index].style.backgroundColor = c;

      let d = new Date(log["game_time"])
      cell.push(<td key="game_time">{d.getMonth()+1}/{d.getDate()}</td>)
      cell.push(<td key="min">{log["min"] == "" ? "00:00" : log["min"]}</td>)
      cell.push(<td style={{backgroundColor: c}} key="eff">{eff}</td>)
      cell.push(<td key="fgm">{log["fgm"]}</td>)
      cell.push(<td key="fga">{log["fga"]}</td>)
      cell.push(<td key="fgp">{log["fgp"]}%</td>)
      cell.push(<td key="tpm">{log["tpm"]}</td>)
      cell.push(<td key="tpa">{log["tpa"]}</td>)
      cell.push(<td key="tpp">{log["tpp"]}%</td>)
      cell.push(<td key="ftm">{log["ftm"]}</td>)
      cell.push(<td key="fta">{log["fta"]}</td>)
      cell.push(<td key="ftp">{log["ftp"]}%</td>)
      cell.push(<td key="off_reb">{log["off_reb"]}</td>)
      cell.push(<td key="def_reb">{log["def_reb"]}</td>)
      cell.push(<td key="tot_reb">{log["tot_reb"]}</td>)
      cell.push(<td key="assists">{log["assists"]}</td>)
      cell.push(<td key="steals">{log["steals"]}</td>)
      cell.push(<td key="blocks">{log["blocks"]}</td>)
      cell.push(<td key="turnovers">{log["turnovers"]}</td>)
      cell.push(<td key="p_fouls">{log["p_fouls"]}</td>)
      cell.push(<td key="points">{log["points"]}</td>)
      return(
        <tr key={index}>
          {cell}
        </tr>
      )}
    )
  }

  render() {
    let fetchInProgressByLog = this.props.fetchInProgressByLog
    if(!fetchInProgressByLog){
      return(
        <div className="mt-3">
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
