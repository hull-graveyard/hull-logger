/* global io */
import { EventEmitter } from "events";
import _ from "lodash";

const EVENT = "CHANGE";
const LOG_DISPLAY = 100;

export default class Engine extends EventEmitter {

  constructor(config, { ship }) {
    super();
    this.config = config;
    this.state = { ship, loading: false, currentIndex: 0 };
    this.eventSource = new EventSource(`/events/${config.ship}/${config.secret}`);
    this.eventSource.onmessage = (e) => {
      try {
        const { timestamp, message, event } = JSON.parse(e.data);
        this.append({
          ...message,
          event,
          timestamp
        });
      } catch (err) {
        console.log(err);
      }
    };
  }

  selectLog(index) {
    this.setState({
      currentIndex: Math.max(0, Math.min(this.state.log.length - 1, index))
    });
  }

  append(entry) {
    const log = this.state.log || [];
    log.push(entry);
    this.setState({ log: _.reverse(_.sortBy(log.slice(0, LOG_DISPLAY), e => e.timestamp)) });
  }

  setState(changes) {
    this.state = {
      ...this.state,
      ...changes
    };
    this.state.current = this.state.log[this.state.currentIndex];
    this.emitChange();
    return this.state;
  }

  getState() {
    return this.state || { log: [] };
  }

  addChangeListener(listener) {
    this.addListener(EVENT, listener);
  }

  removeChangeListener(listener) {
    this.removeListener(EVENT, listener);
  }

  emitChange() {
    this.emit(EVENT);
  }

}
