// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scoreboard: [
        { id: 1, name: "Dallas", point: 50 },
        { id: 2, name: "Link", point: 45 },
        { id: 3, name: "Suck", point: 90 }
      ],
      fetchInProgress: true
    }
  }

  componentDidMount() {
    const url = "/api/v1/leagues/index";
    fetch(url).then(response => {
      if(response.ok) {
        return response.json();
      }
    })
    .then(response =>  this.setState({ scoreboard: response}))
  }

  renderTableHeader() {
    let header = Object.keys(this.state.scoreboard[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.state.scoreboard.map((team, b) => {
      const {name, id, gp, fg, ft, tpm, pts, oreb, dreb, ast, st, blk, to, pf} = team;
      return(
        <tr key={id}>
          <td scope="col">{name}</td>
          <td scope="col">0</td>
          <td scope="col">{fg}</td>
          <td scope="col">{ft}</td>
          <td scope="col">{tpm}</td>
          <td scope="col">{pts}</td>
          <td scope="col">{oreb}</td>
          <td scope="col">{dreb}</td>
          <td scope="col">{ast}</td>
          <td scope="col">{st}</td>
          <td scope="col">{blk}</td>
          <td scope="col">{to}</td>
          <td scope="col">{pf}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h1>week 17 戰力表</h1>
        <table class="table">
          <tbody class="thead-dark">
            <tr>
              <th>隊伍名稱</th>
              <th>出場數(GP)</th>
              <th>FG%</th>
              <th>FT%</th>
              <th>3PTM</th>
              <th>PTS</th>
              <th>OREB</th>
              <th>DREB</th>
              <th>AST</th>
              <th>ST</th>
              <th>BLK</th>
              <th>TO</th>
              <th>PF</th>
            </tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <Table />,
    document.body.appendChild(document.createElement("div"))
  );
});

