import React from 'react'
import ReactDom from 'react-dom'

class TeamTable extends React.Component {
  constructor(props) {
    super(props)
  }

  calculation(teamRoster, item) {
    let value = 0
    let isNotInj = 0
    teamRoster.forEach(player =>{
      if(player['inj'] != true)
      {
        isNotInj ++
        value += parseFloat(player[item])
      }
    })

    return (value/isNotInj).toFixed(2)
  }


  renderTableHeader(tableHeader) {
    return(
      <tr>{tableHeader.map(title => <th key={title} scope="col">{title}</th>)}</tr>
    )
  }

  renderTotalTeamTable(teams) {
    const tableHeader = ['隊名', 'FG%', 'FT%', '3PTM', 'PTS', 'OREB', 'DREB', 'REB', 'AST', 'ST', 'BLK', 'TO', 'PF']
    return(
      <div className="mt-1">
        <div className="custom-table-width">
          <table className="table table-sm">
            <thead className="thead-dark">
              {this.renderTableHeader(tableHeader)}
            </thead>
            <tbody>
              {
                teams.map(team=>{
                  return(<tr key={team.teamId}>
                      <th scope="row">{team.teamName}</th>
                      <td>{this.calculation(team.teamRoster, 'field_goal_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'free_throw_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'three_point_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'points_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'off_reb_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'def_reb_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'tot_reb_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'assists_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'steals_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'blocks_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'turnovers_value')}</td>
                      <td>{this.calculation(team.teamRoster, 'p_fouls_value')}</td>
                    </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderSingleTeamTable(team) {
    const tableHeader = ['姓名', '狀態', '球隊', '出賽', '時間', 'FG%', 'FT%', '3PTM', 'PTS', 'OREB', 'DREB', 'REB', 'AST', 'ST', 'BLK', 'TO', 'PF', 'RANK']

    return(
       <div key={team.teamId} className="mt-1">
        <div>
          {team.teamName}
        </div>
        <div className="custom-table-width">
          <table className="table table-sm">
            <thead className="thead-dark">
              {this.renderTableHeader(tableHeader)}
            </thead>
            <tbody>
              {
                team.teamRoster.map(player=>{
                  return(<tr key={player.player_id}>
                      <th scope="row">{player.name}</th>
                      <td>{player.inj ? 'inj' : ''}</td>
                      <td>{player.tricode}</td>
                      <td>{player.g}</td>
                      <td>{player.min.slice(3,8)}</td>
                      <td>{parseFloat(player.field_goal_value).toFixed(2)}</td>
                      <td>{parseFloat(player.free_throw_value).toFixed(2)}</td>
                      <td>{parseFloat(player.three_point_value).toFixed(2)}</td>
                      <td>{parseFloat(player.points_value).toFixed(2)}</td>
                      <td>{parseFloat(player.off_reb_value).toFixed(2)}</td>
                      <td>{parseFloat(player.def_reb_value).toFixed(2)}</td>
                      <td>{parseFloat(player.tot_reb_value).toFixed(2)}</td>
                      <td>{parseFloat(player.assists_value).toFixed(2)}</td>
                      <td>{parseFloat(player.steals_value).toFixed(2)}</td>
                      <td>{parseFloat(player.blocks_value).toFixed(2)}</td>
                      <td>{parseFloat(player.turnovers_value).toFixed(2)}</td>
                      <td>{parseFloat(player.p_fouls_value).toFixed(2)}</td>
                      <td>{player.rank}</td>
                    </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render() {
    const { teamRosters, checkedItems } = this.props
    let teams = []
    checkedItems.forEach((isChecked,teamId)=>{
      if(isChecked == true)
        teams.push(teamRosters.find(team => team.teamId == teamId))
    })
    if(teams.length > 0){
      return(
        <React.Fragment>
        {this.renderTotalTeamTable(teams)}
        {teams.map(team=>this.renderSingleTeamTable(team))}
        </React.Fragment>
      )
    }else{
      return(<React.Fragment></React.Fragment>)
    }
  }
}

export default TeamTable
