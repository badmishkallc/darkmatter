/* global test,assert,suite */

import {Scavenger, Symbol} from "src/scavenger/scavenger.js";


suite("Scavenger", function(){
   
   test("first", function() {
       assert.ok(typeof Symbol != "undefined");
       assert.ok(typeof Scavenger !== "undefined", "");
   });
    
});