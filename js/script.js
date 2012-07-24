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

var hueIndex = 0;


function SparkleShineLink( elem ) {
  this.element = elem;
  this.chars = elem.querySelectorAll('.char');
  this.charsLen = this.chars.length;
  this.endIndex = 0;
  this.startIndex = 0;
  this.hueIndex = Math.floor( Math.random() * 360 );
  this.colors = [];
  this.isHovered = true;
  this.isSparkling = true;
  this.sparkle();
  // console.log( 'new sparkle shine link');

  // detect when hover is over
  document.addEventListener( 'mouseover', this, false );
}

// allow eventnameHandlers for addEventListener( eventname, this, )
SparkleShineLink.prototype.handleEvent = function( event ) {
  var method = event.type + 'Handler';
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};


SparkleShineLink.prototype.mouseoverHandler = function( event ) {
  // keep listening if we have only hovered over a descendent element
  if ( this.element.contains( event.target ) ) {
    return;
  }
  // console.log('end hover');
  this.isHovered = false;
  document.removeEventListener('mouseover', this, false );
};

// ----- actions ----- //

SparkleShineLink.prototype.sparkle = function() {

  this.endIndex = Math.min( this.endIndex + 1, this.charsLen );

  // add colors

  var hue = ( this.hueIndex * 20 ) % 360;
  var nextColor = this.isHovered ? 'hsl(' + hue +', 100%, 50% )' : 'white';
  // // move next color to the front
  this.colors.unshift( nextColor );
  // change colors of characters
  for ( var i = this.startIndex; i < this.endIndex; i ++ ) {
    this.chars[i].style.color = this.colors[i];
  }

  if ( this.isHovered ) {
    this.hueIndex++;
  } else {
    // increment startIndex, so that rainbow runs through rest of chars
    this.startIndex = Math.min( this.startIndex + 1, this.charsLen );
  }

  // stop sparkling if there are no more chars to change
  this.isSparkling = this.startIndex !== this.charsLen;

  // keep sparkling
  if ( this.isSparkling ) {
    requestAnimationFrame( this.sparkle.bind( this ) );
  } else {
    this.die();
    // console.log('stop sparkling');
  }

};

// sparkling has ended, do some clean-up
// prolly unecessary
SparkleShineLink.prototype.die = function() {
  for ( var prop in this ) {
    delete this[ prop ];
  }
};

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

  new SparkleShineLink( link );

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
