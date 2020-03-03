import React from 'react'
import ReactDom from 'react-dom'

class TeamTable extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTableHeader() {
    const tableHeader = ['姓名', '球隊', '出賽', '時間']
    return(
      <tr>{tableHeader.map(title => <th key={title} scope="col">{title}</th>)}</tr>
    )
  }

  renderTableData() {
    return(<tr><td></td></tr>)
  }

  renderTable(team) {
    return(
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
    )
  }

  render() {
    const { teamRosters, checkedItems } = this.props
    return(
      <div className="mt-1">
        {
          checkedItems.forEach((isChecked,teamId)=>{
            console.log(teamRosters)
            if(isChecked == true)
              this.renderTable(teamRosters.find(team => team.teamId == teamId))
          })
        }
      </div>
    )
  }
}

export default TeamTable
