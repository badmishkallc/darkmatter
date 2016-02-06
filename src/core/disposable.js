
import { Symbol, noop } from "./globals.js";


let isDisposed = Symbol.for("isDisposed");

export class ObjectDisposedError extends Error {
    
    constructor(message) {
       super(message);
       this.name = this.constructor.name;
       this.message = message;
       Error.captureStackTrace(this, this.name);
    }
}



export default class Disposable
{
    
    constructor(cleanup) {
        if(cleanup && typeof cleanup !== "function")
            throw new TypeError("cleanup must be a function");

        this[isDisposed] = false;
        this.cleanup = cleanup;
    }
    
    dispose() {
        if(this.isDisposed)
            return;

        this[isDisposed] = true;

        if(this.cleanup)
            this.cleanup();
    }
    
    static get empty() {
        return {dispose: noop };
    }

    static isDisposed(obj) {
        if(!obj)
            return false;

        let o = Object(obj);
        if(o !== obj)
            return false;

        return obj[isDisposed];
    }
    
    static checkDisposed(obj) {
        if(Disposable.isDisposed(obj))
            throw new ObjectDisposedError(obj.constructor.name + " is already disposed.");
    }

    static isDisposable(obj) {
        return obj && typeof obj.dispose === "function";
    }
}
