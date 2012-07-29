/**
 * charParticles - particles from characters
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global Modernizr: false, requestAnimationFrame: false */


( function( window, document, DD, Modernizr ) {

'use strict';

var mouseX, mouseY;
var TWO_PI = Math.PI * 2;
var maxDistance = 285;
var transformProp = Modernizr.prefixed('transform');
DD.areAllCharParticlesSettled = true;
DD.isMouseDown = false;

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

  if ( DD.isMouseDown && d < maxDistance ) {
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

  // check velocities are slowing down
  var isSettled = Math.abs( this.velocityX ) < 0.004 &&
    Math.abs( this.velocityY ) < 0.004 &&
    Math.abs( this.velocityR ) < 0.004;

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

function onMousedown( event ) {
  // don't trigger displacement on text
  if ( DD.getTaggedElem( event.target, 'span' ) ) {
    return;
  }
  DD.isMouseDown = true;
  DD.areAllCharParticlesSettled = false;
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
  DD.isMouseDown = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
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

  console.log('init char particles');
  // setup initial char particles
  DD.addCharParticles( DD.initialCharElems );

  // listen for mouse down
  document.addEventListener( 'mousedown', onMousedown, false );
  // start animation
  animate();

  areCharParticlesInited = true;

};


})( window, document, window.DD, Modernizr, undefined );
