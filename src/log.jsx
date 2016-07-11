import React, { Component } from "react";
import { Label, Table, Button, Panel } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";

export default class Entry extends Component {


  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggleState = () => {
    this.setState({ open: !this.state.open });
  };

  renderChangeTable(property) {
    const changes = this.props.message.changes[property];
    if (!_.size(changes)) return null;
    return (
    <span>
      <hr className='mt-1' />
      <Table striped bordered>
        <thead>
          <tr>
            <th><small>{property} changes</small></th>
            <th><small>Previous Value</small></th>
            <th><small>New Value</small></th>
          </tr>
        </thead>
        <tbody>
          {_.map(changes, (v, k) => {
            return (<tr key={k}>
              <td><code><small>{k}</small></code></td>
              <td><code><small>{v[0]}</small></code></td>
              <td><code><small>{v[1]}</small></code></td>
            </tr>);
          })}
        </tbody>
      </Table>
    </span>
    );
  }
  renderChanges() {
    if (!_.size(this.props.message.changes)) return null;

    return <span>
      {this.renderChangeTable("user")}
      {this.renderChangeTable("segments")}
    </span>;
  }

  renderEvents() {
    if (!this.props.message.events.length) return null;

    return <span>
      <hr className='mt-1' />
      <small className="text-muted">
        Events: <code>{JSON.stringify(_.map(this.props.message.events, "event"))}</code>
      </small>
    </span>;
  }

  renderTimeStamp() {
    return <small>{moment(this.props.timestamp).fromNow()}</small>;
  }

  renderUpdate() {
    return this.props.message.changes.is_new ? <Label bsStyle="success">New User</Label> : <Label bsStyle="info">Updated</Label>;
  }

  renderPanelTitle() {
    return (<div>
      <div className="pull-right log-actions">
        <Button bsSize={'small'} bsStyle={'primary'} className="btn-pill btn-rounded" onClick ={this.toggleState}>{(this.state.open) ? "Hide" : "Show Log"}</Button>
        {this.renderTimeStamp()}
      </div>
      <h4 className='mt-0 mb-0'>
        <span className='log-title'>{this.props.event} - {this.props.message.user.name || this.props.message.user.email || 'Unknown User'}</span>
        {this.renderUpdate()}
        {this.renderChanges()}
        {this.renderEvents()}
      </h4>
    </div>);
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-12 log-content">
          <Panel collapsible expanded={!!this.state.open} header={this.renderPanelTitle()}>
            <pre>
              <code>{JSON.stringify(this.props.message, null, 2)}</code>
            </pre>
          </Panel>
        </div>
        <hr/>
      </div>
    );
  }
}
