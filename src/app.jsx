import React, { Component } from "react";
import Entry from "./entry";
import Sidebar from "./sidebar";
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

  handleSelectLog = i => this.props.engine.selectLog(i);

  renderEntries() {
    return (this.state.log || []).map((entry = {}, i) => {
      return <Entry {...entry} onShowEntry={this.handleSelectLog.bind(undefined, i)} key={`log-${i}`}/>;
    });
  }
  render() {
    return <div className="container-fluid">
      <h3 className='text-muted uppercase mt-1'>Logger</h3>
      <div className="row">
        <div className="col-sm-5">{this.renderEntries()}</div>
        <div className="col-sm-7">
          <Sidebar {...this.state.current}/>
        </div>
      </div>
    </div>;
  }
}
