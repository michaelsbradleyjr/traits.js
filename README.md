[![Build Status](https://secure.travis-ci.org/michaelsbradleyjr/traits.js.png?branch=master)](https://travis-ci.org/michaelsbradleyjr/traits.js)

# traits.js

[Trait](https://en.wikipedia.org/wiki/Trait_%28computer_programming%29) composition library for JavaScript.

## Description

This library is a pseudo-fork of the original [traits.js](http://soft.vub.ac.be/~tvcutsem/traitsjs/) by [Tom Van Cutsem](http://soft.vub.ac.be/soft/members/tomvancutsem).

It will share some similarities with another *traits.js* derivative, [light-traits](https://github.com/Gozala/light-traits/) by [Irakli Gozalishvili](https://github.com/Gozala), e.g. ECMAScript 5 shims will (eventually) *not* be included in the core library. However, it's intended to be a fresh start built atop the same original.

## Goals

By retooling and experimenting with the original *traits.js*, the primary goal is to come to a deeper understanding of the concepts, implementation, benefits and trade-offs of traits-based composition in JavaScript.

In time, this fork will explore the possibility of leveraging traits as a basis for *gradual typing* in JavaScript libraries, along the lines of Clojure's [core.typed](https://github.com/clojure/core.typed).

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

Load *traits.js* in your Node.js programs as you would any other module:

```javascript
var Trait = require("traits.js").Trait;
```

In a Web browser, you can load *traits.js* with a `<script>` tag, as you would any other JavaScript library:

```html
<script src="traits.min.js"></script>
<script>
  Trait = traits.Trait;
</script>
```

You can also load it as an AMD module, e.g. with [RequireJS](http://requirejs.org/).

## API and Examples

Documentation will be provided in the [wiki](https://github.com/michaelsbradleyjr/traits.js/wiki). For the initial `0.4.0` release, the API will exactly match that of the original library, and the latter's documentation can be consulted: &nbsp;[API](http://soft.vub.ac.be/~tvcutsem/traitsjs/api.html), &nbsp;[Tutorial](http://soft.vub.ac.be/~tvcutsem/traitsjs/tutorial.html), &nbsp;[HowToNode article](http://howtonode.org/traitsjs), &nbsp;[2011 PLASTIC Workshop paper](http://es-lab.googlecode.com/files/traitsJS_PLASTIC2011_final.pdf).

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

You can also load the test suite as located on the `gh-pages` site for this repo: [script tag](http://michaelsbradleyjr.github.io/traits.js/test/), [amd](http://michaelsbradleyjr.github.io/traits.js/test/amd.html).

## Bugs

You can report bugs and discuss features on the [issues page](http://github.com/michaelsbradleyjr/traits.js/issues) or send tweets to [@michaelsbradley](https://twitter.com/michaelsbradley).

## Credit

This software is adapted from an existing work: &nbsp;[traits.js](http://soft.vub.ac.be/~tvcutsem/traitsjs/)

For the original license text please refer to the [licenses](https://github.com/michaelsbradleyjr/traits.js/tree/master/licenses) directory at the [root](https://github.com/michaelsbradleyjr/traits.js/tree/master/) of this distribution.

## Copyright and License

This software is Copyright (c) 2013 by Michael Bradley, Jr.

The use and distribution terms for this software are covered by the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0) which can be found in the file [LICENSE.txt](http://michaelsbradleyjr.github.io/traits.js/LICENSE.txt) at the [root](https://github.com/michaelsbradleyjr/traits.js/tree/master/) of this distribution. By using this software in any fashion, you are agreeing to be bound by the terms of this license. You must not remove this notice, or any other, from this software.

---------------------------------------

<div align="left">
  <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference" title="JavaScript Reference"><img src="http://upload.wikimedia.org/wikipedia/en/d/d6/Mozilla_Developer_Network.png" alt="JavaScript Reference" width="64" heigh="73" align="center"/></a>&nbsp;&nbsp;&nbsp;<a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference">JavaScript Reference</a>
</div>
