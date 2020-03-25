import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const styles = {
  ["autocomplete-wrapper"]: { // eslint-disable-line no-useless-computed-key
    display: "flex",
    width: "50%",
    flexDirection: "column",
    margin: "10px"
  },
  list: {
    margin: "10px"
  },
  ["suggestion-active"]: { // eslint-disable-line no-useless-computed-key
    backgroundColor: "#008f6",
    color: "#3f51b5",
    cursor: "pointer"
  },
  ["no-suggestions"]: { // eslint-disable-line no-useless-computed-key
    display: "flex",
    alignSelf: "center",
    margin: "20px"
  }
};

class Autocomplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    };
  }

  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    const { updateSelectedAsteroids } = this.props;
    this.setState(
      {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: e.currentTarget.innerText
      },
      () => {
        updateSelectedAsteroids(this.state.userInput);
        this.clearUserInpput();
      }
    );
  };


  clearUserInpput = () => {
    this.setState({ userInput: "" });
  }

  onKeyDown = e => {
    const { updateSelectedAsteroids } = this.props;
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      if (activeSuggestion === 0) {
        return;
      }
      
      this.setState(
        {
          activeSuggestion: 0,
          showSuggestions: false,
          userInput: filteredSuggestions[activeSuggestion]
        },
        () => {
          updateSelectedAsteroids(this.state.userInput);
          this.clearUserInpput();
        }
      );
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      userInput
    } = this.state;
    const {
      label,
      classes
    } = this.props;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <div className={classes.list}>
            <List component="nav" aria-label="secondary mailbox folders">
              {filteredSuggestions.map((suggestion, index) => {
                let className;

                // Flag the active suggestion with a class
                if (index === activeSuggestion) {
                  className = classes["suggestion-active"];
                }

                return (
                  <ListItem
                    className={className}
                    button
                    key={suggestion}
                    onClick={this.onClick}
                  >
                    {suggestion}
                  </ListItem>
                );
              })}
            </List>
          </div>
        );
      } else {
        suggestionsListComponent = (
          <div className={classes["no-suggestions"]}>
            <div>No suggestions!</div>
          </div>
        );
      }
    }

    return (
      <div className={classes["autocomplete-wrapper"]}>
        <TextField
          type="text"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          value={userInput}
          variant="outlined"
          label={label}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}

export default withStyles(styles)(Autocomplete);