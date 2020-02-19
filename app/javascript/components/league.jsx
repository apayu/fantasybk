import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scoreboard: [
      ]
    }
  }

  componentDidMount() {
    const url = "/api/v1/leagues/index";
    fetch(url).then(response => {
      if(response.ok) {
        return response.json();
      }
    })
    .then(response => this.setState({ scoreboard: response}))
  }

  renderTableHeader() {
    let header = Object.keys(this.state.scoreboard[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.state.scoreboard.map((a,b) => {
      const { id, name, point } = a;
      return(
        <tr key={id}>
          <td>{id}</td>
          <td>{name}</td>
          <td>{point}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h1>week 17 戰力表</h1>
        <table id="123">
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}
