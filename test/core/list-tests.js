/* global test,assert,suite */

import List from "src/core/list.js";


suite("List", function(){

    test("import", function() {
        assert.ok(typeof List != "undefined");
    });

    test("empty constructor", function(){
        var list = new List();

        assert.ok(list, "List should exist");
        assert.ok(list.count === 0, "list count should be 0");
    });

    test("bad constructor", function() {

        var list = new List({"random": "test"});

        assert.ok(list, "list should exist");
        assert.ok(list.count === 0);
    });


    test("iterable", function(){

        var list = new List(["one", "two"]);

        var list2 = new List(list);

        assert.ok(list.count === 2);
        assert.ok(list2.count === 2);
    });

});/**
 * Created by mhern on 2/5/2016.
 */
