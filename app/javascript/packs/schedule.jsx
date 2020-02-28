import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import ScheduleTable from 'components/scheduleTable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      teamSchedule: [],
      thisWeek: 1,
      // 排序條件
      sortTableConditons: {
        head: '12',
        sort: 'desc'
      },
      fetchInProgress: true
    }

    this.handleSortWeek = this.handleSortWeek.bind(this)
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
        thisWeek: response.thisWeek,
        fetchInProgress: false
      })
    )
  }

  // 每週場次排序
  handleSortWeek(event) {
    let sortTableConditons = this.state.sortTableConditons
    const week = event.target.dataset.week

    if(week == sortTableConditons.head) {
      if(sortTableConditons.sort == 'desc') {
        this.setState({sortTableConditons: {head: week, sort: 'asc'}})
      }
      else {
        this.setState({sortTableConditons: {head: week, sort: 'desc'}})
      }
    }else {
        this.setState({sortTableConditons: {head: week, sort: 'desc'}})
    }
  }

  render() {
    if(!this.state.fetchInProgress) {
      return(<ScheduleTable
        teamSchedule = {this.state.teamSchedule}
        thisWeek = {this.state.thisWeek}
        sortTableConditons = {this.state.sortTableConditons}
        handleSortWeek = {this.handleSortWeek}
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
