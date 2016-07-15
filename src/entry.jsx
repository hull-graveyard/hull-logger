import React, { Component } from "react";
import { Label, Button, Panel } from "react-bootstrap";
import moment from "moment";

export default class Entry extends Component {


  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleShowEntry = () => {
    this.props.onShowEntry(this.props.index);
  };

  renderTimeStamp() {
    return moment(this.props.timestamp).fromNow();
  }

  renderUpdate() {
    const { changes = {} } = this.props;
    return changes.is_new ? <strong>New User</strong> : <strong>Updated</strong>;
  }

  render() {
    const { user = {} } = this.props;
    return (
      <div className="row" onClick ={this.handleShowEntry} style={{ cursor: "pointer" }}>
        <div className="col-sm-12 log-content">
          <div className="pull-right log-actions">
            <span className='text-muted'>
              {this.renderUpdate()} {this.renderTimeStamp()}
            </span>
            <i className="icon icon-arrow_right icon-lg text-info" style={{ marginLeft: 5 }}></i>
          </div>
          <strong className='mt-0 mb-0'>
            <span className='log-title'>{ user.name || user.email || "Unknown User"}</span>
          </strong>
          <small className='text-muted'>{this.props.event}</small>
          <hr/>
        </div>
      </div>
    );
  }
}
