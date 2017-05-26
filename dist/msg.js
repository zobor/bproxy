const Events = require('events');
const msg = new Events();
msg.setMaxListeners(1000);
module.exports = msg;