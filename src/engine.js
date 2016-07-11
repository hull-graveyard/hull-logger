/* global io */
import { EventEmitter } from "events";

const EVENT = "CHANGE";

export default class Engine extends EventEmitter {

  constructor(config, { ship }) {
    super();
    this.config = config;
    this.state = { ship, loading: false };
    this.eventSource = new EventSource(`/events/${config.ship}/${config.secret}`);
    this.eventSource.onmessage = (e) => {
      try {
        const { message, event } = JSON.parse(e.data);
        this.append({ message, event });
      } catch (err) {
        console.log(err);
      }
    };
  }

  append(entry) {
    const log = this.state.log || [];
    log.push(entry);
    this.setState({ log: log.slice(0, 100) });
  }

  setState(changes) {
    this.state = { ...this.state, ...changes };
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
