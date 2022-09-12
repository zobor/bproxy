"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
function inject(Service) {
    const { name  } = Service;
    if (!inject[name]) {
        inject[name] = new Service();
    }
    return inject[name];
}
const _default = inject;
