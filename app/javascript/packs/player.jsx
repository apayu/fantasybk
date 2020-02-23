import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Tabs defaultActiveKey="currentWeek" id="leagueTabs">
          <Tab eventKey="currentWeek" title="近期表現">
            <div>近期表現</div>
          </Tab>
          <Tab eventKey="totalValue" title="數據走勢">
            <div>數據走勢</div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDom.render(
    <App />,
    document.getElementById('root')
  )
})
