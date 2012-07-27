/**
 * sparkleShine - rainbow-ify links
**/

/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global requestAnimationFrame: false */

( function( window, document, DD ) {

'use strict';

var hoveredLink;
var hueIndex = 0;

// -------------------------- sparkleShine -------------------------- //

function SparkleShineLink( elem ) {
  this.element = elem;
  this.chars = elem.querySelectorAll('.char');
  this.charsLen = this.chars.length;
  // don't procced if no char elems
  if ( !this.charsLen ) {
    return;
  }
  this.endIndex = 0;
  this.startIndex = 0;
  this.hueIndex = Math.floor( Math.random() * 360 );
  this.colors = [];
  this.isHovered = true;
  this.isSparkling = true;
  this.sparkle();
  // console.log( 'new sparkle shine link');

  // only one hoverLink at a time
  hoveredLink = elem;

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
  hoveredLink = null;
  document.removeEventListener('mouseover', this, false );
};

// ----- actions ----- //

SparkleShineLink.prototype.sparkle = function() {

  this.endIndex = Math.min( this.endIndex + 1, this.charsLen );

  // add colors

  var hue = ( this.hueIndex * 10 ) % 360;
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
  }

};


// -------------------------- events -------------------------- //

DD.onMouseover = function ( event ) {
  // we only care about mouse over <a>, when mouse isn't down
  var link = DD.getLink( event.target );
  if ( DD.isMouseDown || !link || link === hoveredLink ) {
    return;
  }

  // sparkle-shine that link
  new SparkleShineLink( link );
};

})( window, document, window.DD, undefined );
