import React from 'react'
import ReactDom from 'react-dom'

class TeamTable extends React.Component {
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

  getColorByNumber(score, max, min) {

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

  calculation(teamRoster, item) {
    let value = 0
    let isNotInj = 0
    let avgValue = 0

    teamRoster.forEach(player =>{
      if(player['inj'] != true)
      {
        isNotInj ++
        value += parseFloat(player[item])
      }
    })
    avgValue = (value/isNotInj).toFixed(2)
    const color = this.getColorByNumber(avgValue, 3, -3)
    return(<td style={{backgroundColor: color}}>{avgValue}</td>)
  }

  addColor(value) {
    const ValueFloat = parseFloat(value).toFixed(2)
    const color = this.getColorByNumber(ValueFloat, 5, -3)
    return(<td style={{backgroundColor: color}}>{ValueFloat}</td>)
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
                      {this.calculation(team.teamRoster, 'field_goal_value')}
                      {this.calculation(team.teamRoster, 'free_throw_value')}
                      {this.calculation(team.teamRoster, 'three_point_value')}
                      {this.calculation(team.teamRoster, 'points_value')}
                      {this.calculation(team.teamRoster, 'off_reb_value')}
                      {this.calculation(team.teamRoster, 'def_reb_value')}
                      {this.calculation(team.teamRoster, 'tot_reb_value')}
                      {this.calculation(team.teamRoster, 'assists_value')}
                      {this.calculation(team.teamRoster, 'steals_value')}
                      {this.calculation(team.teamRoster, 'blocks_value')}
                      {this.calculation(team.teamRoster, 'turnovers_value')}
                      {this.calculation(team.teamRoster, 'p_fouls_value')}
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
                      {this.addColor(player.field_goal_value)}
                      {this.addColor(player.free_throw_value)}
                      {this.addColor(player.three_point_value)}
                      {this.addColor(player.points_value)}
                      {this.addColor(player.off_reb_value)}
                      {this.addColor(player.def_reb_value)}
                      {this.addColor(player.tot_reb_value)}
                      {this.addColor(player.assists_value)}
                      {this.addColor(player.steals_value)}
                      {this.addColor(player.blocks_value)}
                      {this.addColor(player.turnovers_value)}
                      {this.addColor(player.p_fouls_value)}
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
