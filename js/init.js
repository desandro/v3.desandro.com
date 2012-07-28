/**
 * init - start when doc ready
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, DD ) {

'use strict';

var charCount = 0;

// -------------------------- setupCharElems -------------------------- //


// -------------------------- email link -------------------------- //

var emailLink;
var emailUsername = 'contact';
var emailDomain = 'desandro.com';
var emailAddress = emailUsername + '@' + emailDomain;

function onEmailClick( event ) {
  emailLink.textContent = emailAddress;
  emailLink.href = 'mailto:' + emailAddress;
  // get chars for sparkle-shine
  var charElems = DD.parseForChars( emailLink );
  // add new char particle
  DD.addCharParticles( charElems );

  emailLink.removeEventListener( 'click', onEmailClick, false );
  event.preventDefault();
}


// -------------------------- init -------------------------- //

var isInited = false;

DD.initialCharElems = [];

function init() {
  console.log('init');
  if ( isInited ) {
    console.log('already inited');
    return;
  }

  // setup char elems
  var splitables = document.querySelectorAll('.split');
  // split each string into words and then characters
  var charElems;
  for ( var i=0, len = splitables.length; i < len; i++ ) {
    charElems = DD.parseForChars( splitables[i] );
    // add these char Elems to initial char elems, to be set up as charParticles
    DD.initialCharElems = DD.initialCharElems.concat( charElems );
  }

  // mouse over for sparkleShine
  document.addEventListener( 'mouseover', DD.onMouseover, false );

  emailLink = document.getElementById('email');
  emailLink.addEventListener( 'click', onEmailClick, false );

  isInited = true;
}


window.addEventListener( 'DOMContentLoaded', init, false );

window.onload = init;


})( window, document, window.DD, undefined );