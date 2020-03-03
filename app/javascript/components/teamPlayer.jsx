import React from 'react'
import ReactDom from 'react-dom'
import TeamTable from 'components/teamTable'

class TeamPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamRosters: {},
      itemSetting: {},
      checkedItems: new Map(),
      fetchInProgress: true,
      fetchSuccess: true
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const url = '/api/v1/leagues/roster'
    fetch(url).then(response => {
      if(!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then(response => {
      this.setState({
        teamRosters: response.leagueTeamInfo.teamRosters,
        itemSetting: response.leagueTeamInfo.itemSetting,
        fetchInProgress: false,
        fetchSuccess: true
      })
    })
    .catch((error) => {
      this.setState({
        fetchSuccess: false })
    })
  }

  handleChange(event) {
    const item = event.target.value
    const isChecked = event.target.checked
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked)}))
  }

  renderLoding() {
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
      </div>
    )
  }

  renderNotFind() {
    return(
      <div className="row justify-content-center align-items-center" style={{height: '100px'}}>
        找不到聯盟資訊，<a href="/users/edit">檢查聯盟ID</a>或是到<a href="https://www.facebook.com/%E5%8F%B0%E7%81%A3Fantasy%E5%A4%A7%E8%81%AF%E7%9B%9F-106004520979736/" target="_blank">粉絲團</a>私訊管理員
      </div>
    )
  }

  render() {
    const {
      renderCheckBox,
      renderLoding,
      renderNotFind,
      handleChange,
      state: {
        teamRosters,
        checkedItems,
        fetchInProgress,
        fetchSuccess
      }
    } = this

    if(!fetchInProgress) {
      return(
        <React.Fragment>
          {
            teamRosters.map((team,index)=>
              <div key={index} className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id={'inlineCheckbox' + index} value={team.teamId}  onChange={handleChange} />
                <label className="form-check-label" htmlFor={'inlineCheckbox' + index}>{team.teamName}</label>
              </div>
            )
          }
          <TeamTable teamRosters={teamRosters} checkedItems={checkedItems}  />
        </React.Fragment>
      )
    } else if(!fetchSuccess) {
      return(renderNotFind())
    } else {
      return(renderLoding())
    }
  }
}

export default TeamPlayer
