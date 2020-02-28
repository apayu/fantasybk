import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import ScheduleTable from 'components/scheduleTable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamSchedule: [],
      fetchInProgress: true
    }
  }

  componentDidMount() {
    this.getTeamSchedule()
  }

  getTeamSchedule() {
    // 取得球員數據走勢
    const url = '/api/v1/teams/schedule'
    fetch(url).then(response => {
      if(response.ok) {
        return response.json()
      }
    })
    .then(response =>
      this.setState({
        teamSchedule: response.teamSchedule,
        fetchInProgress: false
      })
    )
  }

  render() {
    if(!this.state.fetchInProgress) {
      return(<ScheduleTable
        teamSchedule = {this.state.teamSchedule}
        />)
    }else{
      return(<div></div>)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDom.render(
    <App />,
    document.getElementById('schedule_app')
  )
})
