import React, { Component } from "react";
import MainViewContext from "./MainViewContext";

class MainViewProviderClass extends Component {
  render() {
    const { store, children } = this.props;
    // Use a Provider to pass the value to the children tree.
    // Any component can read it, no matter how deep it is.
    return (
      <MainViewContext.Provider
        value={{ store }}
      >
        {children}
      </MainViewContext.Provider>
    );
  }
}

export default MainViewProviderClass;
