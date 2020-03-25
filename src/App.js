import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { BrowserRouter, Route } from "react-router-dom"
import MainViewProvider from "./components/MainView/MainViewProvider";
import Main from "./views/Main/Main";
import Chart from "./views/Chart/Chart";

import "./App.css";

class App extends Component {
  render() {
    const { store } = this.props;

    return (  
      <MainViewProvider
        store={store}
      >
        <div className="App">
          <BrowserRouter>
              <Route exact  path="/" component={Main} />
              <Route path="/chart" component={Chart} />
            </BrowserRouter>
        </div>
      </MainViewProvider>
    );
  }
}

export default inject("store")(observer (App));
