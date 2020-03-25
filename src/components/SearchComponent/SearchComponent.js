import React, { Component } from "react";
import DateFnsUtils from "@date-io/moment"
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import moment from "moment";

import MainViewContext from "../MainView/MainViewContext";
import { DATE_DISPLAY_FORMAT } from "../../constants/index";

const styles = {
  container: {
    marginTop: "10px",
    border: "1px solid #DDD"
  },
  start: {
    maxWidth: "50vw",
    margin: "10px auto"
  },
  end: {
    maxWidth: "50vw",
    margin: "10px auto"
  },
  button: {
    maxWidth: "50vw",
    margin: "10px auto"
  },
}

class SearchComponent extends Component {
  static contextType = MainViewContext; 

  state = {
    startDate: moment("1900-01-01"),
    endDate: moment("1900-01-08"),
    disableSearchButton: false
  };

  handleDateChange = (date, dateType) => {
    this.setState(
      { 
        [dateType]: date,
      },
      this.calculateDaysDifference
    );
  }

  calculateDaysDifference = () => {
    const { startDate, endDate } = this.state;
    const startDatePlusSevenDays = moment(startDate).add(7, "d");
    const disableSearchButton = startDate.isAfter(endDate) || endDate.isAfter(startDatePlusSevenDays);
    this.setState({ disableSearchButton })
  }

  render() {
    const { 
      startDate,
      endDate,
      disableSearchButton
    } = this.state;
    const { classes, fetchAsteroids } = this.props;

    return (
      <div className={classes.container}>
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
        >
          <div className={classes.start}>
            <DatePicker 
              value={startDate}
              format={DATE_DISPLAY_FORMAT}
              onChange={(date) => this.handleDateChange(date, "startDate")}
              minDate={moment("1900-01-01")}
              maxDate={moment("1999-12-31")}
              label="Start date"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
            />
          </div>
          <div className={classes.end}>
            <DatePicker 
              value={endDate}
              format={DATE_DISPLAY_FORMAT}
              onChange={(date) => this.handleDateChange(date, "endDate")}
              label="End date"
              minDate={moment("1900-01-01")}
              maxDate={moment("1999-12-31")}
              InputLabelProps={{
                shrink: true
              }}
              fullWidth
            />
          </div>
          {
            disableSearchButton ? 
              (
                <Tooltip
                  title="Start date has to be before end date. Difference between start and end date can't be greater than 7 days." 
                  placement="bottom" 
                  arrow
                  disableFocusListener
                  disableTouchListener
                >
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled={disableSearchButton}
                    >
                      Show asteroids
                    </Button>
                  </div>
                </Tooltip>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => fetchAsteroids(startDate, endDate)}
                >
                  Show asteroids
                </Button>
              )
          }
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default withStyles(styles)(SearchComponent);
