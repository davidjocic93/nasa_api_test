import React, { Component } from "react";
import { observer } from "mobx-react";
import Spinner from "react-spinner-material";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import { AsteroidsTable as Table } from "../../components/Table";
import { SelectedAsteroidsTable } from "../../components/SelectedAsteroidsTable";
import MainViewContext from "../../components/MainView/MainViewContext";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import { DATE_API_FORMAT } from "../../constants/index";

import "./Main.css";

class Main extends Component {
  static contextType = MainViewContext; 
  state = {
    sugestions: [],
    dataLoaded: false
  };

  componentDidMount() {
    const { store } = this.context;
    store.setSearchTriggered(false);
  }

  fetchAsteroids = async (startDate, endDate) => {
    this.setState({ dataLoaded: false });
    const { store } = this.context;
    await store.fetchAsteroids(startDate.format(DATE_API_FORMAT), endDate.format(DATE_API_FORMAT));
    this.setState({ 
      dataLoaded: true,
      sugestions: store.getUnselectedAsteroids().map(({ name }) => name )
    });
  }

  updateSelectedAsteroids = (asteroidName) => {
    const { store } = this.context;
    const selectedAsteroid = store.asteroids.find(({ name }) => name === asteroidName);
    store.addSelectedAsteroid(selectedAsteroid);
    this.updateSuggestions();
  }

  removeSelectedAsteroid = (selectedAsteroid) => {
    const { store } = this.context;
    store.removeSelectedAsteroid(selectedAsteroid);
    this.updateSuggestions();
  }

  updateSuggestions = () => {
    const { store } = this.context;
    this.setState({ sugestions: store.getUnselectedAsteroids().map(({ name}) => name ) });
  }

  renderTable = () => {
    const { 
      store: {
        asteroids,
        selectedAsteroids,
        searchTriggered
      }
    } = this.context;
    const { sugestions, dataLoaded } = this.state;

    if (dataLoaded) {
      return (
        asteroids && asteroids.length ?
        (
          <>
            <Table asteroids={asteroids} />
            <div className="selected-items-wrapper">
              <Autocomplete
                suggestions={sugestions}
                label="Select asteroid"
                updateSelectedAsteroids={this.updateSelectedAsteroids}
              />
              {
                selectedAsteroids && selectedAsteroids.length ?
                  (
                    <>
                      <SelectedAsteroidsTable
                        selectedAsteroids={selectedAsteroids}
                        removeSelectedAsteroid={this.removeSelectedAsteroid}
                      />
                    </>
                  ) : null
              }
            </div>
          </>
        ) : (
          searchTriggered && <div>No results</div>
        )
      )
    } else {
      return (
        <div className="spinner-container">
          {searchTriggered && <Spinner radius={120} color={"#3f51b5"} stroke={2} visible={true} />}
        </div>
      )
    }
  }

  render() {
    return (
      <>
        <SearchComponent fetchAsteroids={this.fetchAsteroids}/>
        {this.renderTable()}
      </>
    );
  }
}

export default observer(Main);
