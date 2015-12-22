/**
 * Loads mapped paths in the browser and via Gulp / Node.js allowing normalized dependencies to be
 * used in defining further mapped paths.
 */
/* eslint-disable */

var System = System || global.System;

var JSPMParser = JSPMParser || (typeof require !== 'undefined' ? require('typhonjs-config-jspm-parse') : undefined);

// Gets the PackageResolver and finds the `typhonjs-core-backbone-event` child dependency of mapped package `backbone`.
var packageResolver = JSPMParser.getPackageResolver(System);
var pathBackboneEvents = packageResolver.getDirectDependency('backbone', 'typhonjs-core-backbone-events');

System.config(
{
   map:
   {
      'mainEventbus': pathBackboneEvents + '/src/mainEventbus.js',       // This is the normal eventbus.
      'pathConfig': 'config',
      'pathSite': 'site'
   }
});