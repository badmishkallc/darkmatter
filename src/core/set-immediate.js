/**
 * Created by mhern on 2/6/2016.
 */

import Globals from "./globals.js";

// Node & IE support setImmediate
var setImmediate = Globals.setImmediate;
var clearImmediate = Globals.clearImmediate;

if(!setImmediate) {

    setImmediate = (function(){
        var queue = {},
            count = 0,
            schedule,
            flush;

        clearImmediate = function(handle) {
            if(queue[handle]) {
                queue[handle] = undefined;
            }
        };

        setImmediate = function(func) {
            var next = count;
            count++;
            queue[next] = func;

            if(count > 0)
                schedule();

            return next;
        };

        flush = function(){
            var i  = 0, l = count;

            for(; i < l; i++) {
                var cb = queue[i];
                if(cb)
                    cb();

                queue[i] = undefined;
            }

            if(count !== l)
                schedule();
            else
                count = 0;
        };

        if(Globals.Promise) {
            schedule = function() {
                Promise.resolve(0).then(flush());
            };

            return setImmediate;
        }

        if(Globals.process && Globals.process.nextTick) {
           var p = Globals.process;
           schedule = function() {
               p.nextTick(flush);
           };

            return setImmediate;
        }


        if(Globals.MutationObserver) {
            var MutationStream = Globals.MutationObserver || WebkitMutationObserver || MozMutationObserver;
            var node = document.createElement('div');
            var stream = new MutationStream(flush);

            stream.observe(node, { attributes: true });
            schedule = function(){
                node.classList.toggle("flip");
            };
            return setImmediate;
        }

        if(typeof importScripts !== 'undefined' &&
           typeof MessageChannel !== 'undefined') {
            var channel = new MessageChannel();

            channel.port1.onmessage = flush();
            schedule = function() {
                channel.port2.postMessage(0);
            };

            return setImmediate;
        }

        clearImmediate = clearTimeout;

        return function(func) {
            return setTimeout(func, 0);
        }
    })();
}

export default {setImmediate};
export { clearImmediate };