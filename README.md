[![Build Status](https://secure.travis-ci.org/michaelsbradleyjr/traits.js.png?branch=master)](https://travis-ci.org/michaelsbradleyjr/traits.js)

# `Inactive`

*This repository is no longer actively maintained. Please use or create a fork.*

Recommended: **[trait](https://github.com/YR/trait)** by [YR](https://github.com/YR).

N.B. since 2013, when I created this repository, *traits-based composition* seem to have lost none of its value as an alternative (or complement) to inheritance based programming in JavaScript. However, I found my needs better met by [ClojureScript](https://github.com/clojure/clojurescript) as I spent more time with that technology, and left off developing this library not long after I began working on it.

# traits.js

Trait composition library for JavaScript.

## Description

This library is a fork of the original [traits.js](http://soft.vub.ac.be/~tvcutsem/traitsjs/) by [Tom Van Cutsem](http://soft.vub.ac.be/soft/members/tomvancutsem):

> <a href="https://en.wikipedia.org/wiki/Trait_(computer_programming)">Traits</a> are a flexible language feature to factor out and recombine reusable pieces of code. They are a more robust alternative to multiple inheritance or mixins. They are more robust because name clashes must be resolved explicitly by composers, and because trait composition is order-independent (hence more declarative). To put it simply: if you combine two traits that define a method with the same name, your program will fail. Traits won't automatically give precedence to either one.

## Compatibility

For 1-to-1 features and compatibility with the original *traits.js*, including the built-in ECMAScript 5 shims, please <a href="#installation">install</a> the latest `0.4.x` release.

The `Trait` constructor is available on the object <a href="#usage">exported</a> by the library:

```javascript
var Trait = require("traits.js").Trait; // NodeJS
```
*&mdash;or&mdash;*
```javascript
Trait = traits.Trait; // browser global scope
```

## Goals

This library will share some similarities with another *traits.js* derivative, [light-traits](https://github.com/Gozala/light-traits/) by [Irakli Gozalishvili](https://github.com/Gozala), e.g. ECMAScript 5 shims will (eventually) *not* be included in the core library. However, it's intended to be a fresh start built atop the same original.

By retooling and experimenting with the original *traits.js*, the primary goal is to come to a deeper understanding of the concepts, implementation, benefits and trade-offs of traits-based composition in JavaScript.

In time, this fork may explore the possibility of leveraging traits as a basis for *gradual typing* in JavaScript libraries, along the lines of Clojure's [core.typed](https://github.com/clojure/core.typed).

A more immediate goal is to leverage traits on top of [Google Polymer](http://www.polymer-project.org/), providing a mechanism for [Custom Element](http://www.w3.org/TR/custom-elements/) *composition* which is complementary to prototypal inheritance, e.g. the `extends` feature of [polymer-element](http://www.polymer-project.org/polymer.html). To that end, this library specifically targets [bower](http://bower.io/), which presently seems to be the favored system for distributing Web Components and expressing dependencies in and between them.

## Installation

You can install the latest release via [bower](http://bower.io/):

```shell
$ bower install traits.js
```

It is also available through [npm](https://npmjs.org/package/traits.js):

```shell
$ npm install traits.js
```

The installed package contains two consumable JavaScript files, `traits.js` and `traits.min.js`.

## Usage

Load *traits.js* in your Node.js programs as you would any other module. The `Trait` constructor is available on the object exported by the library:

```javascript
var Trait = require("traits.js").Trait;
```

In a Web browser, you can load *traits.js* with a `<script>` tag, as you would any other JavaScript library:

```html
<script src="traits.min.js"></script>
<!-- `traits` is now in the global scope -->
<script>
  Trait = traits.Trait;
</script>
```

You can also load it as an AMD module, e.g. with [RequireJS](http://requirejs.org/).

## API and Examples

Documentation will be provided in the [wiki](https://github.com/michaelsbradleyjr/traits.js/wiki). For the `0.4.x` releases, the API will exactly match that of the original library, and the latter's documentation can be consulted: &nbsp;[API](http://soft.vub.ac.be/~tvcutsem/traitsjs/api.html), &nbsp;[Tutorial](http://soft.vub.ac.be/~tvcutsem/traitsjs/tutorial.html), &nbsp;[HowToNode article](http://howtonode.org/traitsjs), &nbsp;[PLASTIC Workshop 2011 paper](http://es-lab.googlecode.com/files/traitsJS_PLASTIC2011_final.pdf).

## Development and Testing

The npm and bower distributions are stripped down, so if you wish to hack on the library you should clone it:

```shell
$ git clone https://github.com/michaelsbradleyjr/traits.js
...
$ cd traits.js && npm install .
```

### Testing with Node.js

Launch the mocha test runner with:

```shell
$ npm test
```

You can also have it run continuously, with re-runs triggered by changes to `*.js` files under the project's root.

```shell
$ npm run-script test-watch
```

### Testing with Web browsers

To host the test suite locally, you will need a server &mdash; the ever handy [http-server](https://github.com/nodeapps/http-server) is highly recommended:

```shell
$ npm install -g http-server
...
$ http-server -p 12345 -c-1
```

Then point your browser/s to `http://localhost:12345/test/` &nbsp;or&nbsp; `http://localhost:12345/test/amd.html`.

You can also load the test suite as hosted on the `gh-pages` site for this repo: &nbsp;[script tag](http://michaelsbradleyjr.github.io/traits.js/test/), &nbsp;[amd](http://michaelsbradleyjr.github.io/traits.js/test/amd.html).

## Bugs

You can report bugs and discuss features on the [issues page](http://github.com/michaelsbradleyjr/traits.js/issues) or send tweets to [@michaelsbradley](https://twitter.com/michaelsbradley).

## Credit

This software is adapted from an existing work: &nbsp;[traits.js](http://soft.vub.ac.be/~tvcutsem/traitsjs/)

For the original license text please refer to the [licenses](https://github.com/michaelsbradleyjr/traits.js/tree/master/licenses) directory at the [root](https://github.com/michaelsbradleyjr/traits.js/tree/master/) of this distribution.

## Copyright and License

This software is Copyright (c) 2013 by Michael Bradley, Jr.

The use and distribution terms for this software are covered by the [Apache License, Version 2.0](http://opensource.org/licenses/Apache-2.0) which can be found in the file [LICENSE.txt](http://michaelsbradleyjr.github.io/traits.js/LICENSE.txt) at the [root](https://github.com/michaelsbradleyjr/traits.js/tree/master/) of this distribution. By using this software in any fashion, you are agreeing to be bound by the terms of this license. You must not remove this notice, or any other, from this software.

---------------------------------------

<div align="left">
  <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference" title="JavaScript Reference"><img src="http://upload.wikimedia.org/wikipedia/en/d/d6/Mozilla_Developer_Network.png" alt="JavaScript Reference" width="64" heigh="73" align="center"/></a>&nbsp;&nbsp;&nbsp;<a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference">JavaScript Reference</a>
</div>
