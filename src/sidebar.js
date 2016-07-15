import { Panel, Table } from "react-bootstrap";
import React, { Component } from "react";
import _ from "lodash";

export default class Sidebar extends Component {

  static defaultProps = {
    events: [],
    changes: {},
    user: {},
    segments: {}
  }

  renderEvents() {
    if (!this.props.events.length) return null;

    return <span>
      <hr className='mt-1' />
      <small className="text-muted">
        Events: <code>{JSON.stringify(_.map(this.props.events, "event"))}</code>
      </small>
    </span>;
  }


  renderChangeTable(property) {
    const changes = this.props.changes[property];
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

  renderTitle() {
    const { user = {} } = this.props;
    return (<div>
      <h4 className='mt-0 mb-0'>
        <span className='log-title'>{ user.name || user.email || "Unknown User"} <small className="pull-right">{this.props.event}</small></span>
      </h4>
    </div>);
  }

  renderChanges() {
    if (!_.size(this.props.changes)) return null;

    return <span>
      {this.renderChangeTable("user")}
      {this.renderChangeTable("segments")}
    </span>;
  }

  render() {
    return (
      <Panel header={this.renderTitle()}>
        {this.renderChanges()}
        {this.renderEvents()}
        <hr/>
        <pre>
          <code>{JSON.stringify(this.props, null, 2)}</code>
        </pre>
      </Panel>
    );
  }
}
