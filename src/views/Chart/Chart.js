import React, { Component } from "react";
import { observer } from "mobx-react";
import MainViewContext from "../../components/MainView/MainViewContext";
import Button from "@material-ui/core/Button";
import Spinner from "react-spinner-material";
import { Link } from "react-router-dom";

import "./Chart.css";

import { CHART_COLORS } from "../../constants/index";

class Chart extends Component {
  static contextType = MainViewContext; 

  state = {
    dataLoaded: false
  }

  async componentDidMount() {
    const { store } = this.context;
    await Promise.all(store.selectedAsteroids.map(asteroid => asteroid.fetchApproachingData()));
    this.setState({
      dataLoaded: true
    });
  }

  drawCharts() {
    const { store } = this.context;
    const asteroidsByIteration = store.getAsteroidsSortedByIterations();
    //make the smallest element 10% of total chart length
    const baseWidth = asteroidsByIteration.length && asteroidsByIteration[0].iterations * 10;
    let chartWidth;
    return asteroidsByIteration.map((asteroid) => {
      const asteroidName = asteroid.name;
      chartWidth = (asteroid.iterations / 100) * baseWidth;
      if (chartWidth > 90) {
        chartWidth = 90;
      }

      return asteroid.iterations && (
        <div key={asteroid.id} className="chart-container">
          <div className="chart-name">{asteroidName}</div>
          <div
            className="single-chart"
            style={{
              width: `${chartWidth}%`,
              background: `${this.determineChartColor(asteroid.iterations)}`,
            }}
          >
            <div className="approaches-number">
              {asteroid.iterations}
            </div>
          </div>
        </div>
      );
    });
  }

  determineChartColor(iterations) {
    if (iterations <= 25) {
      return CHART_COLORS.GREEN;
    } else if (iterations <= 45) {
      return CHART_COLORS.YELLOW;
    } else if (iterations <= 75) {
      return CHART_COLORS.ORANGE;
    } else if (iterations > 75) {
      return CHART_COLORS.RED;
    }
  }

  render() {
    const { dataLoaded } = this.state;
    const { store } = this.context;

    return (
      dataLoaded ? (
        <div>
          <Link className="link" to="./">
            <div className="back-button">
              <Button
                variant="contained"
                color="primary"
              >
                Back
              </Button>
            </div>
          </Link>
          {store.selectedAsteroids.length ? (
            <div>{this.drawCharts()}</div>
          ) : (
            <div>No results</div>
          )}
        </div>
      ) : (
        <div className="spinner-container">
          <Spinner radius={120} color={"#3f51b5"} stroke={2} visible={true} />
        </div>
      )
    )
  }
}

export default observer(Chart);
