import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import Chart from 'chart.js'

// LineChart
class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      "weeklyTotalValue": [
      {
        "teamId": 1,
        "data": [
          { "week": 1, "value": 86},
          { "week": 2, "value": 61},
          { "week": 3, "value": 82},
          { "week": 4, "value": 78},
          { "week": 5, "value": 79}
      ]},{
        "teamId": 2,
        "data": [
          { "week": 1, "value": 78},
          { "week": 2, "value": 66},
          { "week": 3, "value": 98},
          { "week": 4, "value": 77},
          { "week": 5, "value": 69}
        ]}
      ]
    }
  }

  // componentDidUpdate() {
  //   this.myChart.data.labels = this.props.data.map(d => d.time);
  //   this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
  //   this.myChart.update();
  // }

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
      options: {
			  maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        }
      },
      data: {
        labels: this.state.weeklyTotalValue[0].data.map(d => d.week),
        datasets: [{
          label: "A team",
          data: this.state.weeklyTotalValue[0].data.map(d => d.value),
          fill: 'none'
        },{
          label: "B team",
          data: this.state.weeklyTotalValue[1].data.map(d => d.value),
          fill: 'none'
        }
        ]
      }
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default LineChart;
