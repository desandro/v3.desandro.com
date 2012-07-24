/**
 * desandro.com v3 script
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global requestAnimationFrame: false */

( function( window, document, undefined ) {

'use strict';

var charElems = [];
var charParticles = [];
var mouseX, mouseY;
var isMouseDown = false;
var TWO_PI = Math.PI * 2;
var maxDistance = 270;

// -------------------------- CharParticle -------------------------- //

function CharParticle( elem, index ) {
  this.index = index;
  this.element = elem;
  this.width = elem.offsetWidth;
  this.height = elem.offsetHeight;
  this.originX = elem.offsetLeft + this.width / 2;
  this.originY = elem.offsetTop + this.height / 2;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0;
  this.deltaY = 0;
  this.angle = 0;

  this.velocityX = 0;
  this.velocityY = 0;
  this.velocityR = 0; // rotational velocity

}

CharParticle.prototype.update = function() {

  // Attracted to mouse
  var dx = mouseX - this.x;
  var dy = mouseY - this.y;
  var d = Math.sqrt( dx*dx + dy*dy );

  var angle = 0;
  var targetAngle = 0;

  if ( isMouseDown && d < maxDistance ) {
    // dx = mouseX - p.x;
    // dy = mouseY - p.y;
    var force = (1 - d / maxDistance);

    angle = Math.atan2( dy, dx );

    targetAngle = angle - Math.PI / 2;
    targetAngle *= Math.min( force * 3, 1 );
    // pick the shorter of the two angles
    var absDiff = Math.abs( targetAngle - this.angle );
    if ( Math.abs( (targetAngle - TWO_PI) - this.angle ) < absDiff ) {
      targetAngle -= TWO_PI;
    } else if ( Math.abs( (targetAngle + TWO_PI) - this.angle ) < absDiff ) {
      targetAngle += TWO_PI;
    }


    force *= force * 3;
    this.velocityX += Math.cos( angle ) * -force;
    this.velocityY += Math.sin( angle ) * -force;

  }
  // normalize angle
  this.angle = this.angle % TWO_PI;

  // Attracted to start position
  this.velocityX += ( 0 - this.deltaX ) * 0.005;
  this.velocityY += ( 0 - this.deltaY ) * 0.005;

  this.velocityR += targetAngle - this.angle;

  // Integrate velocity
  this.deltaX += this.velocityX;
  this.deltaY += this.velocityY;
  this.angle += this.velocityR * 0.02;


  // Apply friction
  this.velocityX *= 0.95;
  this.velocityY *= 0.95;
  this.velocityR *= 0.95;

  this.x = this.originX + this.deltaX;
  this.y = this.originY + this.deltaY;

  var deltaD = Math.sqrt( this.deltaX * this.deltaX + this.deltaY * this.deltaY );
  var scale = (deltaD / maxDistance) * 2 + 1;

  this.element.style.WebkitTransform =
    'translate3d(' + this.deltaX + 'px, ' + this.deltaY + 'px, 0 ) ' +
    'scale(' + scale + ') ' +
    'rotate(' + this.angle + 'rad)';

};


// -------------------------- setupCharElems -------------------------- //

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


// -------------------------- animation -------------------------- //

function animate() {
  // console.log('animate');
  // console.log( charParticles );
  for ( var i=0, len = charParticles.length; i < len; i++ ) {
    charParticles[i].update();
  }
  requestAnimationFrame( animate );
  // setTimeout( animate, 20 );
}

// -------------------------- helpers -------------------------- //

function getLink( elem ) {
  // walk up DOM, see if elem is <a>
  while ( elem.nodeType !== 9 ) {
    if ( elem.nodeName.toLowerCase() === 'a' ) {
      return elem;
    }
    elem = elem.parentNode;
  }
  return false;
}

// -------------------------- sparkleShine -------------------------- //

var sparklyLink;
var sparklyChars;

function sparkleShine( link ) {
  // ignore if same link
  if ( link === sparklyLink ) {
    return;
  }
  // set new sparkleShineLink
  sparklyLink = link;
  // get all chars
  sparklyChars = sparklyLink.querySelectorAll('.char');
  console.log( sparklyChars.length );
}

// -------------------------- events -------------------------- //

function onMousedown( event ) {
  // allow clicks on links
  if ( getLink( event.target ) ) {
    return;
  }
  isMouseDown = true;
  mouseX = event.pageX;
  mouseY = event.pageY;
  event.preventDefault();
  window.addEventListener( 'mousemove', onMousemove, false );
  window.addEventListener( 'mouseup', onMouseup, false );
}

function onMousemove( event ) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  // console.log( mouseX, mouseY );
}

function onMouseup( event ) {
  isMouseDown = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}

function onMouseover( event ) {
  // we only care about mouse over <a>, when mouse isn't down
  var link = getLink( event.target );
  if ( isMouseDown || !link ) {
    return;
  }
  sparkleShine( link );
}

// -------------------------- init -------------------------- //

function init() {
  setupCharElems();
  // setup char particles
  var charParticle;
  for ( var i=0, len = charElems.length; i < len; i++ ) {
    charParticle = new CharParticle( charElems[i], i );
    charParticles.push( charParticle );
  }

  document.addEventListener( 'mousedown', onMousedown, false );

  // mouse over
  document.addEventListener( 'mouseover', onMouseover, false );

  animate();

}


window.addEventListener( 'DOMContentLoaded', init, false );


})( window, document );
