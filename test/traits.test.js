;(function (definition) {
    // Wrapper and several helpers were adapted from Q:
    // https://github.com/kriskowal/q/blob/master/q.js

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.

    // CommonJS
    if (typeof exports == "object") {
        var chai = require("chai");
        definition(chai);
    }
    // RequireJS
    else if (typeof define == "function" && define.amd) {
        require(["../node_modules/chai/chai.js"], function (chai) {
            definition(chai);
            mocha.run();
        });
    }
    // <script>
    else {
        // chai library must be already loaded in the global scope and
        // available as `chai`
        definition( ( typeof global != "undefined" && global.chai || window.chai ) );
    }

}((function (undefined) {
    return function (chai) {
        var expect = chai.expect;

        describe("dummy suite", function () {

            it("should do something", function (done) {

                expect(true).to.equal(true);

                done();

            });

        });

    };
}(void 0))));
