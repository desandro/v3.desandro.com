/**
 * charParticles - particles from characters
**/

/*jshint asi: false, curly: true, devel: false, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global Modernizr: false, requestAnimationFrame: false */


( function( window, document, DD, Modernizr, undefined ) {

'use strict';

var mouseX, mouseY;
var TWO_PI = Math.PI * 2;
var maxDistance = 285;
var transformProp = Modernizr.prefixed('transform');
DD.areAllCharParticlesSettled = true;
DD.isCursorActive = false;

var charParticles = DD.charParticles = [];

// -------------------------- sniff -------------------------- //

/* please forgive me for this, but Firefox is too slow to use transforms */

var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

// -------------------------- CharParticle -------------------------- //

var charParticleIndex = 0;

function CharParticle( elem ) {
  this.index = charParticleIndex;
  this.element = elem;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.scale = 1;

  this.velocityX = 0;
  this.velocityY = 0;
  this.velocityR = 0; // rotational velocity

  this.isSettled = true;
  this.wasSettled = true;

  this.updatePosition();

  charParticleIndex++;
}

CharParticle.prototype.updatePosition = function() {
  var elem = this.element;
  this.width = elem.offsetWidth;
  this.height = elem.offsetHeight;
  this.originX = elem.offsetLeft + this.width / 2;
  this.originY = elem.offsetTop + this.height / 2;
};

// update position and transform based on animation and cursor interaction
CharParticle.prototype.update = function() {

  // Attracted to mouse
  var dx = mouseX - ( this.originX + this.x );
  var dy = mouseY - ( this.originY + this.y );
  var d = Math.sqrt( dx*dx + dy*dy );


  var angle = 0;
  var targetAngle = 0;

  if ( DD.isCursorActive && d < maxDistance ) {
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
  this.velocityX += ( 0 - this.x ) * 0.005;
  this.velocityY += ( 0 - this.y ) * 0.005;

  this.velocityR += targetAngle - this.angle;

  // Integrate velocity
  this.x += this.velocityX;
  this.y += this.velocityY;
  this.angle += this.velocityR * 0.02;


  // Apply friction
  this.velocityX *= 0.95;
  this.velocityY *= 0.95;
  this.velocityR *= 0.95;

  var deltaD = Math.sqrt( this.x * this.x + this.y * this.y );
  this.scale = (deltaD / maxDistance) * 2 + 1;

  // check if particle is back in its original place
  var isSettled = Math.abs( this.x ) < 0.03 && Math.abs( this.y ) < 0.03 &&
    Math.abs( this.angle ) < 0.004 && Math.abs( this.scale - 1 ) < 0.03;


  // settled = settled this frame AND settled last frame
  this.isSettled = this.wasSettled && isSettled;
  // check if particles are settled for this frame
  if ( isThisFrameSettled ) {
    isThisFrameSettled = this.isSettled;
  }
  // next time, for previous frame
  this.wasSettled = isSettled;


  this.render();

};

CharParticle.prototype.render = !Modernizr.csstransforms || isFirefox ?
  // absolute left/top positioning
  function() {
    this.element.style.left = this.x + 'px';
    this.element.style.top  = this.y + 'px';
  } : Modernizr.csstransforms3d ?
  // 3d transforms
  function() {
    this.element.style[ transformProp ] = this.isSettled ? 'none' :
      'translate3d(' + this.x + 'px, ' + this.y + 'px, 0 ) ' +
      'scale(' + this.scale + ') ' +
      'rotate(' + this.angle + 'rad)';
  } :
  // 2d transforms
  function() {
    this.element.style[ transformProp ] = this.isSettled ? 'none' :
      'translate(' + this.x + 'px, ' + this.y + 'px ) ' +
      'scale(' + this.scale + ') ' +
      'rotate(' + this.angle + 'rad)';
  };

// -------------------------- events -------------------------- //

var isListeningForCursors = false;

// ----- cursor start ----- //

function onMousedown( event ) {
  cursorStart( event, event );
}

var pivotTouchIdentifier;
var cursorTouchIdentifier;

// allow displacement when two fingers are down, on second touch
function onTouchstart( event ) {
  // cursorStart( event.changedTouches[0], event );
  var touch;
  for ( var i=0, len = event.changedTouches.length; i < len; i++ ) {
    touch = event.changedTouches[i];
    if ( !pivotTouchIdentifier ) {
      pivotTouchIdentifier = touch.identifier;
      // console.log('pivot touch started', touch.identifier );
      window.addEventListener( 'touchend', onPivotTouchend, false );
    } else if ( !cursorTouchIdentifier ) {
      cursorStart( touch, event );
    }
    // cursorStart( touch, touch.identifier, event );
  }
}

function cursorStart( cursor, event ) {
  // don't trigger displacement on text
  if ( DD.getTaggedElem( cursor.target, 'span' ) ) {
    return;
  }
  // console.log('cursor started' );
  DD.isCursorActive = true;
  DD.areAllCharParticlesSettled = false;
  mouseX = cursor.pageX;
  mouseY = cursor.pageY;

  if ( cursor.identifier ) {
    cursorTouchIdentifier = cursor.identifier;
  }
  event.preventDefault();
  if ( DD.isTouch ) {
    window.addEventListener( 'touchmove', onTouchmove, false );
    window.addEventListener( 'touchend', onTouchend, false );
  } else {
    window.addEventListener( 'mousemove', onMousemove, false );
    window.addEventListener( 'mouseup', onMouseup, false );
  }
}

// ----- cursor move ----- //

function onMousemove( event ) {
  cursorMove( event );
}

function onTouchmove( event ) {
  // cursorMove( event.changedTouches[0] )
  var touch;
  // only move cursor if it matches
  for ( var i=0, len = event.changedTouches.length; i < len; i++ ) {
    touch = event.changedTouches[i];
    if ( cursorTouchIdentifier && touch.identifier === cursorTouchIdentifier ) {
      cursorMove( touch );
    }
  }
}

function cursorMove( cursor ) {
  // console.log('cursor move ' + cursor.pageX + ' ' + cursor.pageY );
  mouseX = parseInt( cursor.pageX, 10 );
  mouseY = parseInt( cursor.pageY, 10 );
}

// ----- cursor end ----- //

function onMouseup( event ) {
  DD.isCursorActive = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}

function onPivotTouchend( event ) {
  var touch;
  for ( var i=0, len = event.changedTouches.length; i < len; i++ ) {
    touch = event.changedTouches[i];
    // if pivot touch ends, end it all
    if ( touch.identifier === pivotTouchIdentifier ) {
      pivotTouchIdentifier = null;
      cursorEnd();
      // console.log('pivot touch ended');
      window.removeEventListener( 'touchend', onPivotTouchend, false );
    }
  }
}

function onTouchend( event ) {
  var touch;
  for ( var i=0, len = event.changedTouches.length; i < len; i++ ) {
    touch = event.changedTouches[i];
    if ( touch.identifier === cursorTouchIdentifier ) {
      cursorEnd();
    }
  }
}

function cursorEnd() {
  DD.isCursorActive = false;
  cursorTouchIdentifier = null;
  // console.log('cursor ended');
  if ( DD.isTouch ) {
    window.removeEventListener( 'touchmove', onTouchmove, false );
    window.removeEventListener( 'touchend', onTouchend, false );
  } else {
    window.removeEventListener( 'mousemove', onMousemove, false );
    window.removeEventListener( 'mouseup', onMouseup, false );
  }
}

// -------------------------- animation -------------------------- //

var isThisFrameSettled = false;

function animate() {
  // console.log('animate');
  // console.log( charParticles );
  if ( !DD.areAllCharParticlesSettled ) {
    isThisFrameSettled = true;
    for ( var i=0, len = charParticles.length; i < len; i++ ) {
      charParticles[i].update();
    }
    DD.areAllCharParticlesSettled = isThisFrameSettled;
  }
  requestAnimationFrame( animate );
}

// -------------------------- initCharParticles -------------------------- //

var areCharParticlesInited = false;


DD.addCharParticles = function( charElems ) {
  var charParticle;
  var newCharParticles = [];
  for ( var i=0, len = charElems.length; i < len; i++ ) {
    charParticle = new CharParticle( charElems[i] );
    newCharParticles.push( charParticle );
    charParticles.push( charParticle );
  }
  return newCharParticles;
};

DD.initCharParticles = function () {
  // if already inited, just update positions
  if ( areCharParticlesInited ) {
    for ( var j=0, particlesLen = charParticles.length; j < particlesLen; j++ ) {
      charParticles[j].updatePosition();
    }
    return;
  }

  // console.log('init char particles');
  // setup initial char particles
  DD.addCharParticles( DD.initialParticleElems );


  // listen for mouse down
  if ( DD.isTouch ) {
    document.addEventListener( 'touchstart', onTouchstart, false );
  } else {
    document.addEventListener( 'mousedown', onMousedown, false );
  }
  
  // start animation
  animate();

  areCharParticlesInited = true;

};


})( window, document, window.DD, Modernizr );
