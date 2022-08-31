"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function inject(Service) {
    const { name } = Service;
    if (!inject[name]) {
        inject[name] = new Service();
    }
    return inject[name];
}
exports.default = inject;
