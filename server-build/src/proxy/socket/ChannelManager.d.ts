export default class ChannelManager extends Emitter {
    _targets: {};
    _clients: {};
    createTarget(id: any, ws: any, url: any, title: any, favicon: any, ua: any): void;
    createClient(id: any, ws: any, target: any): any;
    removeTarget(id: any, title?: string): void;
    removeClient(id: any): void;
    getTargets(): {};
    getClients(): {};
}
import Emitter = require("licia/Emitter");
