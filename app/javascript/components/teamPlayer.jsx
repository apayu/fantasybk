import React from 'react'
import ReactDom from 'react-dom'

class TeamPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const url = '/api/v1/leagues/index'
    fetch(url).then(response => {
      if(!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then(response => {
      this.setState({
        leagueName: response.leagueName,
        leagueNumTeams: response.league_num_teams,
        leagueStartWeek: response.league_start_week,
        leagueCurrentWeek: response.league_current_week,
        leagueStatsArray: response.league_stats,
        scoreboardArray: response.scoreboard,
        fetchInProgress: false,
        selectWeek: response.league_current_week})
    })
    .catch((error) => {
      this.setState({
        fetchSuccess: false })
    })
  }

  render() {
    return(
      <div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
          <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
        </div>
      </div>
    )
  }
}

export default TeamPlayer
