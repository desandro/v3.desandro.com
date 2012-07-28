/**
 * Typekit
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global Typekit: false */

( function( window, document, DD, undefined ) {

'use strict';

// how long to wait before showing fallback fonts
var timeoutDuration = 3000;

// -------------------------- Typekit -------------------------- //

console.log('init Typekit');
var config = {
  kitId: 'eel3tlp',
  active: function() {
    console.log('typekit active');
    setTimeout( DD.initCharParticles, 20 );
  },
  inactive: function() {
    console.log('typekit inactive');
    setTimeout( DD.initCharParticles, 20 );
  }
};

var html = document.getElementsByTagName('html')[0];
html.className += ' wf-loading';

// set timeout if fonts never load
var timeout = setTimeout( function(){
  html.className = html.className.replace(/( |^)wf-loading( |$)/g,"");
  html.className += ' wf-inactive';
  console.log('typekit load timed out');
  config.inactive();
}, timeoutDuration );

var typekitScript = document.createElement('script');
typekitScript.src= '//use.typekit.net/' + config.kitId + '.js';
typekitScript.async = 'true';
typekitScript.onload = typekitScript.onreadystatechange = function() {
  var readyState = this.readyState;
  if ( readyState && readyState !== 'complete' && readyState !== 'loaded' ) {
    return;
  }
  clearTimeout( timeout );
  try {
    Typekit.load( config );
  } catch( error ) {}
};

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore( typekitScript, firstScript );

})( window, document, window.DD );
