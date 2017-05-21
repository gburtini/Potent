Potent - The XPath Rule Generalizer
===================================
![Potent.js](https://d2ppvlu71ri8gs.cloudfront.net/items/1i3H1E3A2A0u0r1m0U44/potent-short-left.png)

[![Build Status](https://travis-ci.org/gburtini/Potent.svg?branch=master)](https://travis-ci.org/gburtini/Potent) [![Known Vulnerabilities](https://snyk.io/test/github/gburtini/potent/badge.svg)](https://snyk.io/test/github/gburtini/potent) [![npm version](https://badge.fury.io/js/potent.svg)](https://badge.fury.io/js/potent)

This package builds atop [Potent Tools](https://github.com/gburtini/potent-tools-for-xpath) to solve a single problem: given a set of XPath expressions, find the most specific expression which matches everything the original set would have. This allows you to learn a generalized pattern, e.g., for scraping data. A simple use case has a user specifying some example nodes, then you running `potent.simplify(thoseNodes)` and the resultant expression should capture all the 'similar content' on a page.

Installation
------------
`yarn add potent`

Usage
-----

A common use-case, find elements and generalize the selector as you go:
```js
const potent = require('potent');
let currentRule = potent.get(element);
while(...) {
  // e.g., user selects an element, userElement
  newElement = potent.get(userElement);
  currentRule = potent.simplify([
    currentRule,
    newElement
  ]);
}

// use currentRule to find all matching elements.
const allMatchingElements = potent.find(currentRule);
```

API
---

```js
XPathNodes result = potent.get(DOMElement a);
```
takes a DOM element and turns it in to an object appropriate for simplifying.

```js
XPathNodes common = potent.simplify(XPathNodes a, XPathNodes b);
```
takes in two results from `.get` and produces the common query between them.

```js
XPathNodes common;
common.toString(); 
```
produces the XPath expression for this string.

```js
DOMElementList matching = potent.find(XPathNodes a, document)
```
produces a set of matching elements from your document for query `a`.

FAQ
---

**Where did this come from?**
This was the backend to a commercial project I embarked on in 2012 to provide a GUI scraping tool for academic researchers to collect data from government websites and other mostly-structured online data sources. The business was abandoned and instead became a set of tools I used for my own research and consulting efforts. The current version is effectively just a polished up version of that original code.

**What about grouping rules?**
A common problem in this form of scraping occurs when you wish to collect tuples of data. If all fields are always available, then simple index matching will work. When fields are sporadically missing, it will not -- a way to avoid this problem is to match in stages; for example, match a collection of outer elements first, then iterate over them and match the requisite inner elements. 

**Is this problem well-defined?**
Not really! There are many cases where the right decision is subjective -- for example, if we select `/a/b/c` and `/a/b/d`, a decision must be made whether to match `/a/b/*` or `/a/b/(c|d)`. To support this, we calculate a configurable violation cost for each non-matching pair with the end goal being finding the minimum cost set. Similar cases apply on attribute patterns. The decisions as they have been made here have been used by a small number of users in production for many years.

**Is there a GUI?**
Not publicly, yet.

**Can I use prewritten XPath queries?**
Yes, but only simple ones. For example, this is a valid usage of `potent.simplify`:

```js
const potent = require('potent');
const rule = potent.simplify([
  "//div[@class='title']/a[@id='123']",
  "//div[@class='title']/a[@id='456']",
  "//div[@class='title']/a[@id='999']",
]).toString(); // -> '//div.title/a[@id]'
const allTitles = potent.find(rule, document); // -> ['Title 123', 'Title 124', ... 'Title 456', ..., 'Title 998', 'Title 999']
```
However, this relies on `XPathNodes::fromString()` which is only partially implemented -- simple paths, attributes and anything produced from `.toString()` should be functional.

License
-------
Dual-licensed MIT or BSD-3-Clause. There is significant dependency on BSD-3-Clause licensed code, due to the use of old Firebug code from [potent-tools](https://github.com/gburtini/potent-tools-for-xpath).

Development
-----------
- In general, readability will be preferred to conciseness. 
- Please ensure all unit tests pass (`yarn test`).
- Please ensure new code has sufficient coverage (`yarn run coverage`).
- Please ensure code has been linted to meet the formatting standards (I use [eslint-config-strawhouse](https://www.npmjs.com/package/eslint-config-strawhouse) and [Prettier](https://github.com/prettier/prettier)).