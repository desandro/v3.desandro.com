/**
 * desandro.com v3 script
**/


/*jshint asi: false, curly: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

( function( window, document, undefined ) {

'use strict';

function setupCharParticles() {
  var splitables = document.querySelectorAll('.split');
  var charCount = 0;
  // split each string into words and then characters
  var splitable, words, chars, html, word, wordContent;
  for ( var i=0, len = splitables.length; i < len; i++ ) {
    // reset content
    html = '';
    splitable = splitables[i];
    words = splitable.textContent.split(' ');
    // split word into characters
    for ( var j=0, wordsLen = words.length; j < wordsLen; j++ ) {
      word = words[j];
      wordContent = '<span class="word">';
      // wrap each character in a span
      chars = word.split('');
      for ( var k=0, charsLen = chars.length; k < charsLen; k++ ) {
        wordContent += '<span class="char">' + chars[k] + '</span>';
        charCount++;
      }
      wordContent += '</span>';
      html += wordContent + ' ';
    }
    splitable.innerHTML = html;
  }
  // console.log( charCount );
}


function init() {
  setupCharParticles();
}


window.addEventListener( 'DOMContentLoaded', init, false );


})( window, document );
