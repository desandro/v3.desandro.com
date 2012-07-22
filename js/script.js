/**
 * desandro.com v3 script
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, undefined ) {

'use strict';

var charElems = [];
var charParticles = [];

function setupCharElems() {
  var splitables = document.querySelectorAll('.split');
  var charCount = 0;
  // split each string into words and then characters
  var splitable, words, chars, word, wordContent, fragment, wordElem, charElem;

  for ( var i=0, len = splitables.length; i < len; i++ ) {
    // get words
    splitable = splitables[i];
    words = splitable.textContent.split(' ');
    // clear out original HTML
    while ( splitable.firstChild ) {
      splitable.removeChild( splitable.firstChild );
    }

    fragment = document.createDocumentFragment();

    // split word into characters
    for ( var j=0, wordsLen = words.length; j < wordsLen; j++ ) {
      word = words[j];
      wordElem = document.createElement('span');
      wordElem.className = 'word';
      // wrap each character in a span
      chars = word.split('');
      for ( var k=0, charsLen = chars.length; k < charsLen; k++ ) {
        charElem = document.createElement('span');
        charElem.className = 'char';
        charElem.textContent = chars[k];
        charElems.push( charElem );
        wordElem.appendChild( charElem );
        charCount++;
      }
      fragment.appendChild( wordElem );
      // add space
      fragment.appendChild( document.createTextNode(' ') );
    }

    // add splitted content
    splitable.appendChild( fragment );
  }
  // console.log( charCount );
}

function onBodyClick( event ) {
  console.log( event );
  event.preventDefault();
}


// -------------------------- CharParticle -------------------------- //

function CharParticle( elem ) {
  this.element = elem;
  this.width = elem.offsetWidth;
  this.height = elem.offsetHeight;
  this.x = elem.offsetLeft + this.width / 2;
  this.y = elem.offsetTop + this.height / 2;
}

// -------------------------- init -------------------------- //

function init() {
  setupCharElems();
  // setup char particles
  var charParticle;
  for ( var i=0, len = charElems.length; i < len; i++ ) {
    charParticle = new CharParticle( charElems[i] );
  }


  document.body.addEventListener( 'click', onBodyClick, false );
}


window.addEventListener( 'DOMContentLoaded', init, false );


})( window, document );
