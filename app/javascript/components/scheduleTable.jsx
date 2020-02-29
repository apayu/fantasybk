import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class ScheduleTable extends React.Component {
  constructor(props) {
    super(props)
  }

  rgbaToHex(color) {
      const values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
      const colorValue = parseFloat(values[3] || 1)
      const red = Math.floor(colorValue * parseInt(values[0]) + (1 - colorValue) * 255)
      const green = Math.floor(colorValue * parseInt(values[1]) + (1 - colorValue) * 255)
      const blue = Math.floor(colorValue * parseInt(values[2]) + (1 - colorValue) * 255)

      return '#' +
        ('0' + red.toString(16)).slice(-2) +
        ('0' + green.toString(16)).slice(-2) +
        ('0' + blue.toString(16)).slice(-2)
  }

  getColorByNumber(week) {

    let red = 255
    let green = 255
    let blue = 255

    switch(week) {
      case 5:
        red = 0
        green = 100
        blue = 0
        break
      case 4:
        red = 0
        green = 200
        blue = 0
        break
      case 3:
        red = 255
        green = 255
        blue = 255
        break
      case 2:
        red = 255
        green = 100
        blue = 100
        break
      case 1:
        red = 255
        green = 0
        blue = 0
        break
      case 0:
        red = 255
        green = 0
        blue = 0
        break
      default:
    }

    red = parseInt(red)
    green = parseInt(green)
    blue = parseInt(blue)

    return this.rgbaToHex('rgb(' + red + ',' + green + ',' + blue + ')')
  }

  renderTableHeader() {
    const teamSchedule = this.props.teamSchedule
    const mouse = {
      cursor: 'pointer'
    }
    let cell = []
    cell.push(<th key='0' scope="col">week</th>)
    for(let i=0; i < teamSchedule[0]['game_week'].length; i++) {
      cell.push(<th style={mouse} key={i+1} scope="col" data-week={i+1} onClick={this.props.handleSortWeek.bind(this)}>{i+1}</th>)
    }
    return(<tr>{cell}</tr>)
  }

  // table 排序
  sortTable(teamSchedule, tableHead, toSort) {
    const index = tableHead - 1
    if(toSort == 'asc')
      teamSchedule.sort((a, b) => parseFloat(a['game_week'][index]) - parseFloat(b['game_week'][index]))
    else
      teamSchedule.sort((a, b) => parseFloat(b['game_week'][index]) - parseFloat(a['game_week'][index]))

    return teamSchedule
  }

  renderTableData() {
    let teamSchedule = JSON.parse(JSON.stringify(this.props.teamSchedule))

    // 排序條件
    const sortTableConditons = this.props.sortTableConditons
    const head = sortTableConditons.head
    const sort = sortTableConditons.sort

    teamSchedule = this.sortTable(teamSchedule, head, sort)

    let row = []
    teamSchedule.forEach( (t, i) => {
      let cell = []
      cell.push(<th key={t.tricode} scope="row">{t['tricode']}</th>)
      t['game_week'].forEach( (week,index) => {
        let selectStyle = {
          backgroundColor: '#ffffff',
          color: '#000000'
        }
        selectStyle.backgroundColor = this.getColorByNumber(week)
        cell.push(<td style={selectStyle} key={index}>{week}</td>)
      })
      row.push(<tr key={i}>{cell}</tr>)
    })

    return(row)
  }

  renderWeekData(week) {
    let teamSchedule = this.props.teamSchedule
    let totalTeamWeek = ['', '', '', '', '', '']
    let divArray = []

    teamSchedule.forEach((t, i) => {
      let str = totalTeamWeek[t['game_week'][week-1]]
      if(str == '')
        str += t['tricode']
      else
        str += ', ' + t['tricode']

      totalTeamWeek[t['game_week'][week-1]] = str
    })


    totalTeamWeek.forEach((t,i) => {
      if(t != '')
        divArray.push(<div key={i}>{i}場: {t}</div>)
    })

    return(<div className="m-1"><div><h3>week {week}</h3></div>{divArray.reverse()}</div>)
  }

  render() {
    const thisWeek = this.props.thisWeek
    const nextWeek = thisWeek + 1

    return(
      <div className="mt-1">
        {this.renderWeekData(thisWeek)}
        {this.renderWeekData(nextWeek)}
        <div className="custom-table-width">
          <table className="table table-sm table-bordered">
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
