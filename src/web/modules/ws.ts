import { BehaviorSubject } from 'rxjs';

interface WsConfig {
  url?: string;
  autoConnect?: boolean;
  autoReconnect?: boolean;
}
class WS {
  config: WsConfig = {
    autoReconnect: true,
    autoConnect: true,
  };
  public socket: any = {};
  private $stream = {};
  private reconnectCount = 0;

  constructor(config: WsConfig = {}) {
    this.config = {...this.config, ...config};
    const { autoConnect, url } = this.config;
    if (autoConnect && url) {
      this.connect();
    }
  }
  connect() {
    if (!this.config?.url) {
      return;
    }
    this.socket = new WebSocket(this.config.url);
    this.socket.onopen = () => {
      this.emit('open');
    };
    this.socket.onclose = () => {
      this.emit('close');
      if (this.config.autoReconnect) {
        this.reconnect();
      }
    };
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const { type, method, payload, uuid } = data;
      this.emit(type, { method, payload, uuid });
    };
  }
  checkAndCreate(type) {
    if (!this.$stream[type]) {
      this.$stream[type] = new BehaviorSubject(0);
    }
    return this.$stream[type];
  }
  on(type: string, callback) {
    const $channel = this.checkAndCreate(type);
    return $channel.subscribe(callback);
  }
  once(type: string, callback) {
    if (this.$stream[type]) {
      return;
    }
    const $channel = this.checkAndCreate(type);
    return $channel.subscribe(callback);
  }
  emit(type: string, data?: any) {
    const $channel = this.checkAndCreate(type);
    $channel.next(data);
  }
  send(data: any) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(typeof data !== 'string' ? JSON.stringify(data) : data);
    }
  }
  close() {}
  reconnect() {
    const timer = setInterval(() => {
      this.reconnectCount += 1;
      if (this.socket.readyState === 1) {
        clearInterval(timer);
        return;
      }
      this.connect();
      if (this.reconnectCount > 10) {
        clearInterval(timer);
      }
    }, 1500);
  }
}

export default WS;
