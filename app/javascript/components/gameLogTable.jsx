import React from "react"
import RactDOM from "react-dom"
import PropType from "prop-types"

class GameLogTable extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTableHeader() {
    let tableHeader = ["Date", "Min", "FGM", "FGA", "FG%",
      "3PM", "3PA", "3P%", "FTM", "FTA", "FT%", "OR", "DR", "Reb", "Ast", "Stl", "Blk", "TO", "PF", "Pts"]
    return(
      <tr>{tableHeader.map(title => <th key={title}>{title}</th>)}</tr>
    )
  }

  renderTableDate() {
    let gameLog = this.props.gameLog
    return gameLog.map((log, index) => {
      const cell = []

      let d = new Date(log["game_time"])
      cell.push(<td key="game_time">{d.getMonth()+1}/{d.getDate()}</td>)
      cell.push(<td key="min">{log["min"]}</td>)
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
