/**
 * Created by mhern on 2/5/2016.
 */
import Globals, { Symbol } from "./globals.js";
import Disposable from "./disposable.js";
import setImmediate from "./set-immediate.js";


if(Symbol.observable) {
    var key = "observable";
    Object.defineProperty(Symbol, key, {value: Symbol(key)});
}

const observerProp = Symbol("observer");
const subscribeProp = Symbol("subscribe");
const subscriptionProp = Symbol("subscription");
const isDisposedProp = Symbol.for("isDisposed");
const disposableProp = Symbol("disposable");


export class Subscription {

    constructor(observer, subscribe) {
        if(observer !== Object(observer))
            throw new TypeError("observer must be an object");

        this[isDisposedProp] = false;
        this[observerProp] = observer;
        observer = new SubscriptionObserver(this);

        try {
            let cancel = subscribe.call(undefined, observer);
            if(cancel != null) {

                if(!cancel.unsubscribe && typeof cancel !== "function") {
                    throw new TypeError("unsubscribe is not a function.");
                }

                // if cancel is a subscription
                if(typeof cancel.unsubscribe === "function") {
                    var subscription = cancel;
                    this[disposableProp] = new Disposable(function() {
                        subscription.unsubscribe();
                    });
                } else {
                    this[disposableProp] = new Disposable(cancel);
                }
            }
        } catch(e) {
            observer.error(e);
            return;
        }

        if(!this[observerProp])
            this.dispose();
    }

    unsubscribe() {
       this.dispose();
    }

    dispose() {
        if(this[isDisposedProp])
            return;

        this[isDisposedProp] = true;

        if(this[disposableProp])
            this[disposableProp].dispose();

        this[disposableProp] = undefined;
        this[observerProp] = undefined;
    }
}

var checkMethod = function(obj, key) {

    let func = obj[key];
    if(func === null || func === undefined)
        return undefined;

    // must throw error if func is primitive.
    if(typeof value !== "function")
        throw new TypeError(key + " is not function");

    return value;
};

var suppress = function(action) {
    try {
        action();
    }catch (e) {}
};

var invokeMethod = function(obj, methodName, value, throwOnError, close) {

    let subscription = obj[subscriptionProp];

    if(Disposable.isDisposed(subscription)) {
        if(throwOnError)
            throw value;

        return undefined;
    }

    let o = subscription[observerProp];

    try {
        let method = checkMethod(o, methodName);
        if(!method) {

            if(throwOnError) {
                //noinspection ExceptionCaughtLocallyJS
                throw value;
            }

            return method;
        }

        value = method.call(o, value);
    } catch(error) {
        suppress(() => subscription.close());
        throw error;
    }

    if(close)
        suppress(() => subscription.close());

    return value;
};


export class SubscriptionObserver {

    constructor(subscription) {
        this[subscriptionProp] = subscription;
    }

    next(value) {
        return invokeMethod(this, "next", value, false, false);
    }

    error(value) {
        return invokeMethod(this, "error", value, true, true);
    }

    complete(value) {
        return invokeMethod(this, "complete", value, false, true);
    }
}

export class Observable {


    constructor(subscribe) {

        if(typeof subscribe !== "function")
            throw new TypeError("subscriber must be a function");

        this[subscribeProp] = subscribe;
    }

    subscribe(observer) {
        return new Subscription(observer, this[subscribeProp]);
    }

    forEach(func) {

        let thisArg = arguments[1];
        var o = this;

        return new Promise(function(resolve, reject) {

            if(typeof func !== "function")
                throw new TypeError("func is not a function");

            var next = function(value) {
                try{ func(value); }
                catch (e) { reject(e);}
            };

            if(thisArg) {
                next = function(value) {
                    try{ func.call(thisArg, value);}
                    catch (e) {reject(e);}
                };
            }

            o.subscribe({
                next: next,
                error: reject,
                complete: resolve
            });
        });
    }

    [Symbol.observable]() {
        return this;
    }

    static get [Symbol.species]() {return this;}

    static from(obj) {
        if(!obj)
            throw new TypeError("obj is not an object");

        let o = Object(obj);
        if(o !== obj)
            throw new TypeError("obj is not an object");

        let method = checkMethod(obj, Symbol.observable);
        let Observable = typeof this === "function" ? this : Observable;

        if(method) {
            let observable = method.call(obj);
            if(observable !== Object(observable))
                throw new TypeError("observable is not an object");

            if(observable.constructor === Observable)
                return observable;

            return new Observable(function(observer){
                observable.subscribe(observer);
            });
        }

        return new Observable(function(observer) {
            let done = false;

            setImmediate(function() {
                if(done)
                    return;

                try {
                    if (Array.isArray(obj)) {
                        var i = 0,
                            l = obj.length;

                        for (; i < l; i++) {
                            observer.next(obj[i]);

                            if (done)
                                return;
                        }
                    }

                    if (obj[Symbol.iterator]) {
                        var iterator = obj[Symbol.iterator]();
                        var n;
                        while (!(n = iterator.next()).done) {

                            observer.next(n.value);

                            if (done)
                                return;
                        }
                    }
                } catch(error) {
                    if(done)
                        throw e;

                    observer.error(error);
                    return;
                }

                observer.complete();
            });

            return function() {
                done = true;
            };
        });
    }

    static of() {
        var items = Array.from(arguments);
        let Observable = typeof this === "function" ? this : Observable;

        return new Observable(function(observer) {
            let done = false;

            setImmediate(function() {
                if(Disposable.isDisposed(observer))
                    return;

                var i = 0,
                    l = items.length;

                for(; i < l; i++) {
                    observer.next(items[i]);

                    if(done)
                        return;
                }

                observer.complete();
            });

            return function() {
                done = true;
            }
        });
    }
}

function listen(element, eventName) {
    return new Observable(observer => {
        // Create an event handler which sends data to the sink
        let handler = event => observer.next(event);

        // Attach the event handler
        element.addEventListener(eventName, handler, true);

        // Return a function which will cancel the event stream
        return _ => {
            // Detach the event handler from the element
            element.removeEventListener(eventName, handler, true);
        };
    });
}


var createDelegateObservable = function(observable, observer, next, error, complete) {

    return observable.subscribe({
        next: next || function(v) {
            observer.next(v);
        },
        error: error || function(e) {
            observer.error(e);
        },
        complete: complete || function(value) {
            observer.complete(value);
        }
    })
};

Observable.prototype.map = function(select) {
    var o = this,
        thisArg = arguments[1];
    return new Observable((observer) => {

        var cancel = createDelegateObservable(o, observer, function(value){
            var result = false;
            try {
                result = select.call(thisArg, value);
            } catch(e) {
                this.error(e);
                return;
            }

            observer.next(result);
        });

        return _ => {
            cancel.unsubscribe();
        }
    });
};


Observable.prototype.filter = function(predicate) {
    var o = this,
        thisArg = arguments[1];
    return new Observable((observer) => {

        var cancel = createDelegateObservable(o, observer, function(value){
            var result = false;
            try {
                result = predicate.call(thisArg, value);
            } catch(e) {
                this.error(e);
                return;
            }

            if(result)
                observer.next(value);
        });

        return _ => {
            cancel.unsubscribe();
        }
    });
};

