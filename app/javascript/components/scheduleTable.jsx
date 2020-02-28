import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class ScheduleTable extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTableHeader() {
    const teamSchedule = this.props.teamSchedule
    let cell = []
    cell.push(<th key='0' scope="col">week</th>)
    for(let i=0; i < teamSchedule[0]['game_week'].length; i++) {
      cell.push(<th key={i+1} scope="col">{i+1}</th>)
    }
    return(<tr>{cell}</tr>)
  }

  renderTableData() {
    const teamSchedule = this.props.teamSchedule
    let row = []
    teamSchedule.forEach( t => {
      let cell = []
      cell.push(<th key={t.tricode} scope="row">{t['tricode']}</th>)
      t['game_week'].forEach( (week,index) => {
        cell.push(<td key={index}>{week}</td>)
      })
      row.push(<tr>{cell}</tr>)
    })

    return(row)
  }

  render() {
    return(
      <div className="mt-1">
        <div className="custom-table-width">
          <table className="table table-sm">
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

export default ScheduleTable
