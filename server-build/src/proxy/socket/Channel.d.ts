export = Channel;
declare class Channel extends Emitter {
    constructor(ws: any);
    _ws: any;
    _connections: any[];
    send(message: any): void;
    destroy(): void;
    isConnected(connection: any): boolean;
    hasConnection(connection: any): boolean;
    connect(connection: any): void;
    disconnect(connection: any): void;
}
import Emitter = require("licia/Emitter");
