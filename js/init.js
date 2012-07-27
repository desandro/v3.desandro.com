/**
 * init - start when doc ready
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, DD ) {

'use strict';

// -------------------------- setupCharElems -------------------------- //

DD.charElems = [];

function setupCharElems() {
  var splitables = document.querySelectorAll('.split');
  var charCount = 0;
  // split each string into words and then characters
  var splitable, words, chars, word, wordContent, fragment, wordElem, charElem;

  for ( var i=0, len = splitables.length; i < len; i++ ) {
    // get words
    splitable = splitables[i];
    words = splitable.innerText.split(' ');
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
        charElem.innerText = chars[k];
        DD.charElems.push( charElem );
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


// -------------------------- init -------------------------- //

var isInited = false;

function init() {
  console.log('init');
  if ( isInited ) {
    console.log('already inited');
    return;
  }
  setupCharElems();

  // mouse over for sparkleShine
  document.addEventListener( 'mouseover', DD.onMouseover, false );

  isInited = true;
}


window.addEventListener( 'DOMContentLoaded', init, false );

window.onload = init;


})( window, document, window.DD, undefined );