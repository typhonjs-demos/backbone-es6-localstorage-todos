/**
 * Loads mapped paths in the browser and via Gulp / Node.js allowing normalized dependencies to be
 * used in defining further mapped paths.
 */
/* eslint-disable */

var System = System || global.System;

System.config(
{
   map:
   {
      'mainEventbus': 'site/js/events/mainEventbus.js',
      'pathConfig': 'config',
      'pathSite': 'site'
   }
});