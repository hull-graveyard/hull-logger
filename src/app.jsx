import React, { Component } from "react";
import Entry from "./log";
import _ from "lodash";

export default class App extends Component {


  constructor(props) {
    super(props);
    this.state = { log: [] };
  }

  componentWillMount() {
    this.props.engine.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    const state = this.props.engine.getState();
    this.setState(state);
  }

  handleSearch(userSearch) {
    if (userSearch && !this.state.loading) {
      this.props.engine.searchUser(userSearch);
    }
  }

  renderLog() {
    return (_.reverse(this.state.log) || []).map((entry = {}, i) => {
      return <Entry {...entry} key={`log-${i}`}/>;
    });
  }
  render() {
    return <div className="container">
      <h5>Logger</h5>
      {this.renderLog()}
    </div>;
  }
}
