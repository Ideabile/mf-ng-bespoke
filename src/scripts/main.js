// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),
  cube = require('bespoke-theme-cube'),
  nebula = require('bespoke-theme-nebula'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  backdrop = require('bespoke-backdrop'),
  scale = require('bespoke-scale'),
  hash = require('bespoke-hash'),
  progress = require('bespoke-progress'),
  timeview = require('bespoke-timeview'),
  graphview = require('bespoke-graphview');

// Bespoke.js
bespoke.from('article', [
  // cube(),
  nebula(),
  keys(),
  touch(),
  bullets('ul:not(.diagram) li, .bullet'),
  timeview('.timeview ol li'),
  graphview(),
  scale(),
  hash(),
  progress(),
  backdrop()
]);

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');
