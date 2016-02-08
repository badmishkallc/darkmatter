/* global test,assert,suite */

import Observable from "src/core/observer.js";


suite("Observable", function(){

    test("import", function() {
        assert.ok(typeof Observable != "undefined");
    });

    test("empty constructor", function(done){

        var eventStream = function(el, eventType) {

            return new Observable(function (observer) {
                console.log("Construct");
                var handler = function (e) {
                    observer.next(e);
                };
                el.addEventListener(eventType, handler);

                return function () {
                    el.removeEventListener(eventType, handler);
                }
            });
        };

        if(window && document) {
            var div = document.createElement("div");

            var clickStream = eventStream(div, "click");

            var copy  = null;
            var filter = clickStream.map(function(e) {
                copy = e;
                return e.target;
            });

            filter.subscribe({
                next: function(e) {
                    // event fired and was mapped to e.target.
                    assert.ok(e === div);
                    done();
                }
            });

            try {
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });

            } catch(e) {
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", true, true);
            }

            div.dispatchEvent(event);
        }
    });



});
