;(function (definition) {
    // Wrapper adapted from Q:
    // https://github.com/kriskowal/q/blob/master/q.js

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.

    // CommonJS
    if (typeof exports == "object") {
        var chai = require("chai"),
            lodash = require("lodash"),
            traits = require("../");
        definition(chai, lodash, traits);
    }
    // RequireJS
    else if (typeof define == "function" && define.amd) {
        require([
            "../support/chai.js",
            "../support/lodash.min.js",
            "../traits.min.js"
        ], function (chai, lodash, traits) {
            definition(chai, lodash, traits);
            mocha.run();
        });
    }
    // <script>
    else {
        // chai library must be already loaded in the global scope and
        // available as `chai`
        function getGlobal(name) {
            return (typeof global != "undefined" && global[name] || window[name]);
        }
        definition( getGlobal("chai"), getGlobal("_"), getGlobal("traits") );
    }

}((function (undefined) {
    return function (chai, lodash, traits) {
        var expect = chai.expect,
            Trait = traits.Trait;

        function accessorP(get, set) {
            return {
                get: get,
                set: set,
                enumerable: true
            };
        }

        function conflictP(name) {
            var conflict = function () {
                throw new Error("Conflicting property: " + name);
            };
            return {
                get: conflict,
                set: conflict,
                enumerable: false,
                conflict: true
            };
        }

        function dataP(value) {
            return {
                value: value,
                enumerable: true
            };
        }

        function identical(name, x, y, title) {
            function check(b, title) {
                it(title, function () {
                    expect(b).to.be.ok;
                });
                return b;
            }
            title = title + ": " + name + ".value " + x + " equals " + y;
            if (x === y) {
                // 0 === -0, but they are not identical
                return check(x !== 0 || 1/x === 1/y, title);
            } else {
                return check(lodash.isNaN(x) && lodash.isNaN(y), title);
            }
        }

        function isSameDesc(name, desc1, desc2, title) {
            // for conflicting properties, don't compare values because the conflicting props
            // are never equal
            if (desc1.conflict && desc2.conflict) {
                return true;
            } else {
                function cmp(v1, v2, title) {
                    it(title, function () {
                        expect(v1).to.equal(v2);
                    });
                    return v1 === v2;
                }
                return ( cmp(desc1.get, desc2.get, title + ": " + name + ".get")
                         && cmp(desc1.set, desc2.set, title + ": " + name + ".set")
                         && identical(name, desc1.value, desc2.value, title)
                         && cmp(desc1.enumerable, desc2.enumerable, title + ": " + name + ".enumerable")
                         && cmp(desc1.required, desc2.required, title + ": " + name + ".required")
                         && cmp(desc1.conflict, desc2.conflict, title + ": " + name + ".conflict") );
            }
        }

        function methodP(fun) {
            return {
                value: fun,
                method: true,
                enumerable: true
            };
        }

        function requiredP() {
            return {
                value: undefined,
                required: true,
                enumerable: false
            };
        }

        function testEqv(obj1, obj2, title) {
            describe(title, function () {
                var names1 = Object.getOwnPropertyNames(obj1),
                    names2 = Object.getOwnPropertyNames(obj2),
                    name;
                it(title + ": compared objects declare same amount of properties", function () {
                    expect(names1.length).to.equal(names2.length);
                });
                for (var i = 0; i < names1.length; i++) {
                    name = names1[i];
                    it("compared object contains " + name, function () {
                        expect( obj2[name] ).to.not.be.undefined;
                    });
                    describe(null, function () {
                        var isSame = isSameDesc(name, obj1[name], obj2[name], title);
                        it("same descriptions: " + obj1[name] + " versus: " + obj2[name], function () {
                            expect(isSame).to.be.ok;
                        });
                    });
                }
            });
        }

        function testMethod() {}

        describe("traits.js", function () {

            describe("Trait.eqv", function () {

                var T1 = Trait({ a: 0, b:Trait.required, c: testMethod }),
                    T2 = Trait({ b: Trait.required, a: 0, c: testMethod }),
                    T3 = Trait({ a: 0, b:Trait.required, c: testMethod, d: "foo" }),
                    T4 = Trait({ a: 0, b:Trait.required, d: "foo" });

                it("eqv is reflexive", function () {

                    expect( Trait.eqv( T1, T1 ) ).to.be.ok;

                });

                describe("eqv is symmetric", function () {

                    it("T1 eqv T2", function () {

                        expect( Trait.eqv( T1, T2 ) ).to.be.ok;

                    });

                    it("T2 eqv T1", function () {

                        expect( Trait.eqv( T2, T1 ) ).to.be.ok;

                    });

                });

                describe("should determine trait inequality", function () {

                    it("T1 ! eqv T3", function () {

                        expect( Trait.eqv( T1, T3 ) ).to.not.be.ok;

                    });

                    it("T1 ! eqv T4", function () {

                        expect( Trait.eqv( T2, T4 ) ).to.not.be.ok;

                    });

                });

            });

            describe("Trait construction, composition", function () {

                testEqv(
                    Trait({}),
                    {},
                    "empty trait"
                );

                testEqv(
                    Trait({ a: 0,
                            b: testMethod }),
                    { a: dataP(0),
                      b: methodP(testMethod) },
                    "simple trait"
                );

                testEqv(
                    Trait({ a: Trait.required,
                            b: 1 }),
                    { a: requiredP(),
                      b: dataP(1) },
                    "simple trait with required prop"
                );

                testEqv(
                    Trait({ a: 0, b: 1, c: Trait.required }),
                    Trait({ b: 1, c: Trait.required, a: 0}),
                    "ordering of trait properties is irrelevant"
                );

                describe(null, function () {
                    var record = eval("({get a() {}, set a(v) {} })");
                    var get = Object.getOwnPropertyDescriptor(record,"a").get;
                    var set = Object.getOwnPropertyDescriptor(record,"a").set;
                    testEqv(
                        Trait(record),
                        { a: accessorP(get,set) },
                        "trait with accessor property"
                    );
                });

                testEqv(Trait.compose(
                    Trait({ a: 0,
                            b: 1 }),
                    Trait({ c: 2,
                            d: testMethod })),
                        { a: dataP(0),
                          b: dataP(1),
                          c: dataP(2),
                          d: methodP(testMethod) },
                        "simple composition");

                testEqv(Trait.compose(
                    Trait({ a: 0,
                            b: 1 }),
                    Trait({ a: 2,
                            c: testMethod })),
                        { a: conflictP("a"),
                          b: dataP(1),
                          c: methodP(testMethod) },
                        "composition with conflict");

                testEqv(Trait.compose(
                    Trait({ a: 0,
                            b: 1 }),
                    Trait({ a: 0,
                            c: testMethod })),
                        { a: dataP(0),
                          b: dataP(1),
                          c: methodP(testMethod) },
                        "composition of identical props does not cause conflict");

                testEqv(Trait.compose(
                    Trait({ a: Trait.required,
                            b: 1 }),
                    Trait({ a: Trait.required,
                            c: testMethod })),
                        { a: requiredP(),
                          b: dataP(1),
                          c: methodP(testMethod) },
                        "composition with identical required props");

                testEqv(Trait.compose(
                    Trait({ a: Trait.required,
                            b: 1 }),
                    Trait({ a: testMethod })),
                        { a: methodP(testMethod),
                          b: dataP(1) },
                        "composition satisfying a required prop");

                testEqv(Trait.compose(
                    Trait.compose(Trait({ a: 1 }), Trait({ a: 2 })),
                    Trait({ b: 0 })),
                        { a: conflictP("a"),
                          b: dataP(0) },
                        "compose is neutral wrt conflicts");

                testEqv(Trait.compose(
                    Trait.compose(Trait({ a: 1 }), Trait({ a: 2 })),
                    Trait({ a: Trait.required })),
                        { a: conflictP("a") },
                        "conflicting prop overrides required prop");

                testEqv(Trait.compose(
                    Trait({ a: 0, b: 1 }),
                    Trait({ c: 2, d: testMethod })),
                        Trait.compose(
                            Trait({ c: 2, d: testMethod}),
                            Trait({ a: 0, b: 1 })),
                        "compose is commutative");

                testEqv(Trait.compose(
                    Trait({ a: 0, b: 1, c: 3, e: Trait.required }),
                    Trait({ c: 2, d: testMethod })),
                        Trait.compose(
                            Trait({ c: 2, d: testMethod}),
                            Trait({ a: 0, b: 1, c: 3, e: Trait.required })),
                        "compose is commutative, also for required/conflicting props");

                testEqv(Trait.compose(
                    Trait({ a: 0, b: 1, c: 3, d: Trait.required }),
                    Trait.compose(
                        Trait({ c: 3, d: Trait.required }),
                        Trait({ c: 2, d: testMethod, e: "foo" }))),
                        Trait.compose(
                            Trait.compose(
                                Trait({ a: 0, b: 1, c: 3, d: Trait.required }),
                                Trait({ c: 3, d: Trait.required })),
                            Trait({ c: 2, d: testMethod, e: "foo" })),
                        "compose is associative");

                testEqv(Trait.compose(
                    Trait.compose(Trait({ b: 2 }), Trait({ a: 1 })),
                    Trait.compose(Trait({ c: 3 }), Trait({ a: 1 })),
                    Trait({ d: 4 })),
                        { a: dataP(1),
                          b: dataP(2),
                          c: dataP(3),
                          d: dataP(4) },
                        "diamond import of same prop does not generate conflict");

                testEqv(Trait.resolve({},
                                      Trait({ a: 1, b: Trait.required, c: testMethod })),
                        { a: dataP(1),
                          b: requiredP(),
                          c: methodP(testMethod) },
                        "resolve with empty resolutions has no effect");

                testEqv(Trait.resolve({ a: "A", c: "C" },
                                      Trait({ a: 1, b: Trait.required, c: testMethod })),
                        { A: dataP(1),
                          b: requiredP(),
                          C: methodP(testMethod),
                          a: requiredP(),
                          c: requiredP() },
                        "resolve: renaming");

                testEqv(Trait.resolve({ a: "b" },
                                      Trait({ a: 1, b: 2 })),
                        { b: conflictP("b"),
                          a: requiredP() },
                        "resolve: renaming to conflicting name causes conflict, ordering 1");

                testEqv(Trait.resolve({ a: "b" },
                                      Trait({ b: 2, a: 1 })),
                        { b: conflictP("b"),
                          a: requiredP() },
                        "resolve: renaming to conflicting name causes conflict, ordering 2");

                testEqv(Trait.resolve({ a: undefined },
                                      Trait({ a: 1, b: 2 })),
                        { a: requiredP(),
                          b: dataP(2) },
                        "resolve: simple exclusion");

                testEqv(Trait.resolve({ a: undefined, b: undefined },
                                      Trait({ a: 1, b: 2 })),
                        { a: requiredP(),
                          b: requiredP() },
                        "resolve: exclusion to \"empty\" trait");

                testEqv(Trait.resolve({ a: undefined, b: "c" },
                                      Trait({ a: 1, b: 2 })),
                        { a: requiredP(),
                          c: dataP(2),
                          b: requiredP() },
                        "resolve: exclusion and renaming of disjoint props");

                testEqv(Trait.resolve({ a: undefined, b: "a" },
                                      Trait({ a: 1, b: 2 })),
                        { a: dataP(2),
                          b: requiredP() },
                        "resolve: exclusion and renaming of overlapping props");

                testEqv(Trait.resolve({ a: "c", b: "c" },
                                      Trait({ a: 1, b: 2 })),
                        { c: conflictP("c"),
                          a: requiredP(),
                          b: requiredP() },
                        "resolve: renaming to a common alias causes conflict");

                testEqv(Trait.resolve({ b: "a" },
                                      Trait({ a: Trait.required, b: 2 })),
                        { a: dataP(2),
                          b: requiredP() },
                        "resolve: renaming overrides required target");

                testEqv(Trait.resolve({ b: "a" },
                                      Trait({ a: 2, b: Trait.required })),
                        { a: dataP(2),
                          b: requiredP() },
                        "resolve: renaming required properties has no effect");

                testEqv(Trait.resolve({ a: "c", d: "c" },
                                      Trait({ a: 1, b: 2 })),
                        { c: dataP(1),
                          b: dataP(2),
                          a: requiredP() },
                        "resolve: renaming of non-existent props has no effect");

                testEqv(Trait.resolve({ b: undefined },
                                      Trait({ a: 1 })),
                        { a: dataP(1) },
                        "resolve: exclusion of non-existent props has no effect");

                testEqv(Trait.resolve({ a: "c", b: undefined },
                                      Trait({ a: Trait.required, b: Trait.required, c:"foo", d:1 })),
                        { a: requiredP(),
                          b: requiredP(),
                          c: dataP("foo"),
                          d: dataP(1) },
                        "resolve is neutral w.r.t. required properties");

                testEqv(Trait.resolve({a: "b", b: "a"},
                                      Trait({ a: 1, b: 2 })),
                        { a: dataP(2),
                          b: dataP(1) },
                        "resolve supports swapping of property names, ordering 1");

                testEqv(Trait.resolve({b: "a", a: "b"},
                                      Trait({ a: 1, b: 2 })),
                        { a: dataP(2),
                          b: dataP(1) },
                        "resolve supports swapping of property names, ordering 2");

                testEqv(Trait.resolve({b: "a", a: "b"},
                                      Trait({ b: 2, a: 1 })),
                        { a: dataP(2),
                          b: dataP(1) },
                        "resolve supports swapping of property names, ordering 3");

                testEqv(Trait.resolve({a: "b", b: "a"},
                                      Trait({ b: 2, a: 1 })),
                        { a: dataP(2),
                          b: dataP(1) },
                        "resolve supports swapping of property names, ordering 4");

                testEqv(Trait.override(
                    Trait({a: 1, b: 2 }),
                    Trait({c: 3, d: testMethod })),
                        { a: dataP(1),
                          b: dataP(2),
                          c: dataP(3),
                          d: methodP(testMethod) },
                        "override of mutually exclusive traits");

                testEqv(Trait.override(
                    Trait({a: 1, b: 2 }),
                    Trait({c: 3, d: testMethod })),
                        Trait.compose(
                            Trait({d: testMethod, c: 3 }),
                            Trait({b: 2, a: 1 })),
                        "override of mutually exclusive traits is compose");

                testEqv(Trait.override(
                    Trait({a: 1, b: 2 }),
                    Trait({a: 3, c: testMethod })),
                        { a: dataP(1),
                          b: dataP(2),
                          c: methodP(testMethod) },
                        "override of overlapping traits");

                testEqv(Trait.override(
                    Trait({a: 1, b: 2 }),
                    Trait({b: 4, c: 3 }),
                    Trait({a: 3, c: testMethod, d: 5 })),
                        { a: dataP(1),
                          b: dataP(2),
                          c: dataP(3),
                          d: dataP(5) },
                        "three-way override of overlapping traits");

                testEqv(Trait.override(
                    Trait({a: Trait.required, b: 2 }),
                    Trait({a: 1, c: testMethod })),
                        { a: dataP(1),
                          b: dataP(2),
                          c: methodP(testMethod) },
                        "override replaces required properties");

                describe("override is not commutative", function () {

                    it("override result depends on argument ordering", function () {

                        expect(
                            Trait.eqv(
                                Trait.override(
                                    Trait({a: 1, b: 2}),
                                    Trait({a: 3, c: 4})),
                                Trait.override(
                                    Trait({a: 3, c: 4}),
                                    Trait({a: 1, b: 2}))
                            )
                        ).to.not.be.ok;

                    });

                });

                testEqv(Trait.override(
                    Trait.override(
                        Trait({a: 1, b: 2}),
                        Trait({a: 3, c: 4, d: 5})),
                    Trait({a: 6, c: 7, e: 8})),
                        Trait.override(
                            Trait({a: 1, b: 2}),
                            Trait.override(
                                Trait({a: 3, c: 4, d: 5}),
                                Trait({a: 6, c: 7, e: 8}))),
                        "override is associative");

            });

            describe("Traite.create", function () {

                describe("creation", function () {

                    var o1 = Trait.create(
                        Object.prototype,
                        Trait({ a: 1, b: function () { return this.a; } })
                    );

                    it("o1 prototype", function () {

                        expect(Object.prototype).to.equal(Object.getPrototypeOf(o1));

                    });

                    it("o1.a", function () {

                        expect(1).to.equal(o1.a);

                    });

                    it("o1.b()", function () {

                        expect(1).to.equal( o1.b() );

                    });

                    it("Object.keys(o1).length === 2", function () {

                        expect(2).to.equal( Object.getOwnPropertyNames(o1).length );

                    });

                });

                describe("creation with prototype", function () {

                    var o2 = Trait.create(
                        Array.prototype, Trait({})
                    );

                    it("o2 prototype", function () {

                        expect(Array.prototype).to.equal( Object.getPrototypeOf(o2) );

                    });

                });

                describe("exception for incomplete required properties", function () {

                    function create() {
                        Trait.create(
                            Object.prototype,
                            Trait({ foo: Trait.required })
                        );
                    }

                    it("required prop error", function () {
                        expect(create).to.throw("Missing required property: foo");
                    });

                });

                describe("exception for unresolved conflicts", function () {

                    function create() {
                        Trait.create(
                            Object.prototype,
                            Trait.compose(Trait({ a: 0 }), Trait({ a: 1 }))
                        );
                    }

                    it("conflicting prop error", function () {
                        expect(create).to.throw("Remaining conflicting property: a");
                    });

                });

                describe("creates frozen objects", function () {

                    var o3 = Trait.create(Object.prototype, Trait({ m: function() { return this; } }));

                    it("closed create freezes object", function () {

                        expect( Object.isFrozen(o3) ).to.be.ok;

                    });

                    it("this refers to composite object", function () {

                        expect(o3).to.equal( o3.m() );

                    });

                    it("this bound to composite object", function () {

                        expect(o3).to.equal( o3.m.call({}) );

                    });

                });

                describe("Object.create", function () {

                    describe("required props are present but undefined", function () {

                        var o4 = Object.create(
                            Object.prototype,
                            Trait({ foo: Trait.required })
                        );

                        it("required property present", function () {

                            expect("foo" in o4).to.be.ok;

                        });

                        it("required property undefined", function () {

                            expect(o4.foo).to.not.be.ok;

                        });

                    });

                    describe("conflicting props are present", function () {

                        var o5 = Object.create(
                            Object.prototype,
                            Trait.compose(Trait({ a: 0 }), Trait({ a: 1 }))
                        );

                        it("conflicting property present", function () {

                            expect("a" in o5).to.be.ok;

                        });

                        function tripConflict() {
                            (o5.a, o5.a()); // accessor or data prop
                        }

                        it("conflicting prop access error", function () {

                            expect(tripConflict).to.throw("Conflicting property: a");

                        });

                    });

                    describe("Object.create creates unfrozen objects", function () {

                        var o6 = Object.create(
                            Object.prototype,
                            Trait({ m: function() { return this; } })
                        );

                        it("open create does not freeze object", function () {

                            expect( Object.isFrozen(o6) ).to.not.be.ok;

                        });

                        it("open create does not freeze methods", function () {

                            expect( Object.isFrozen(o6.m) ).to.not.be.ok;

                        });

                        it("this refers to composite object", function () {

                            expect(o6).to.equal( o6.m() );

                        });

                        it("this not bound to composite object", function () {

                            var fakethis = {};

                            expect(fakethis).to.equal( o6.m.call(fakethis) );

                        });

                    });

                });

                describe("Diamond with conflicts", function () {

                    function makeT1(x) {
                        return Trait({ m: function() { return x; } });
                    }

                    function makeT2(x) {
                        return Trait.compose(Trait({t2:"foo"}), makeT1(x));
                    }

                    function makeT3(x) {
                        return Trait.compose(Trait({t3:"bar"}), makeT1(x));
                    }

                    var T4 = Trait.compose(makeT2(5), makeT3(5));

                    function create() {
                        Trait.create(Object.prototype, T4);
                    }

                    it("diamond prop conflict", function () {

                        expect(create).to.throw("Remaining conflicting property: m");

                    });

                });

            });

        });

    };
}(void 0))));
