function throttle (callback, limit) {
	  var wait = false;                 // Initially, we're not waiting
	  return function () {              // We return a throttled function
	    if (!wait) {                  // If we're not waiting
	      callback.call();          // Execute users function
	      wait = true;              // Prevent future invocations
	      setTimeout(function () {  // After a period of time
	          wait = false;         // And allow future invocations
	      }, limit);
	    }
	  }
	}

jQuery(document).ready(function($) {
   sg.utility.init();

   $(window).resize(function(){ sg.utility.resize(); });
   $(window).scroll(function(){ sg.utility.onScroll(); });
});


/*
=============================================================================
	FUNCTION DECLARATIONS
=============================================================================
*/

var sg = (function($) {

	/*
		Utility
		
		Various utility functions that load/unload/route data,
		call other functions, etc.
	*/

	var utility = (function() {

		var debug = false;

		var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

		var init = function() { // Called on page load, calls all other functions that should occur on page load
			
			// PLUGINS CALLS / DEVICE FIXES
			

			if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) { // Disable scaling until user begins a gesture (prevents zooming when user rotates to landscape mode)
				var viewportmeta = document.querySelector('meta[name="viewport"]');
				if (viewportmeta) {
					viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
					document.body.addEventListener('gesturestart', function () {
						viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
					}, false);
				}
			}

			// FUNCTIONS
			

			
			// REPEATING FUNCTIONS
			// var example = setInterval(function(){
			// 	// do stuff
			// }, 200);


			/*
				USER INTERACTION
			*/
			$("a[href*=#]").click(function(e) {
				e.preventDefault();
				if ($(window).width() >= 826) { // If we're at sticky nav dimensions, offest should include nav height.
					smoothScroll($(this), - $('nav').outerHeight());
				}
				else { 
					smoothScroll($(this),-40);
				}
			});
			
		};

		var onScroll = function() { // Called when the browser window is scrolled
			// Functions
		};

		var resize = function() { // Called when the browser window is resized
			// Functions
		};

		var responsiveState = function(req) { // Returns what responsive state we're at. Values based on CSS media queries.
			// Below is an idiotic bug fix.
			// Chrome & Safari exclude scrollbars from window width for CSS media queries.
			// Firefox, Opera and IE include scrollbars in window width for CSS media queries, but not in JS.
			// So we have to add some px to the window width for Firefox, Opera and IE so that breakpoints
			// match up between CSS and JS. What a world.
			if ($('html').hasClass('chrome') || $('html').hasClass('safari')) {
				var winWidth = $(window).width();
			}
			else {
				var winWidth = $(window).width() + 17;
			}

			if (typeof req === 'undefined' || req === 'state') {
				// MODIFY THESE IF STATEMENTS TO MATCH YOUR RESPONSIVE WIDTHS
				if (winWidth >= 1025) {
					return 'full';
				}
				if (winWidth >= 768 && winWidth <= 1024) {
					return 'compressed';
				}
				if (winWidth <= 767) {
					return 'oneCol';
				}
				// STOP MODIFYING HERE.
			}
			else {
				return winWidth;
			}
		};

		var smoothScroll = function(el,o) {
			// Setup variables
			var target = el.attr('href');
			var offset = (function(){
				if (typeof o != 'undefined') {
					return o;
				}
				else {
					return 0;
				}
			})();
			// Perform scroll
			$(target).velocity("scroll", { 
				duration: 500,
				offset: offset,
				easing: "easeInOutQuart",
				begin: function() { 
					isAnimating = true;
				},
				complete: function() { 
					isAnimating = false;
					// Set URL hash
					if (history.pushState) {
						history.pushState(null, null, target);
					}
					else { // Fallback for old browsers
						location.hash = target;
					}
				}
			}); 
		};

		/*var interval = window.setInterval(function(){
			stickyNav.init();
		}, 50);*/

		return  {
			init: init,
			onScroll: onScroll,
			resize: resize,
			responsiveState: responsiveState
		}
	})();



	/* 
		Sticky navigation

		Sticks the navigation to the top of the page if the user scrolls down and stuff.
	*/
	var stickyNav = (function() {

		// Object to hold various distances.
		var distances = {
			navOffset: 
				(function(){
					return $('nav').offset();
				})(),
		};

		var init = function(){
			if ($(window).width() <= 825) { // Only stick the nav when it can be one row.
				destroy(); // Nav can't be in one row, destroy.
			}
			else { // Nav can be in one row, stick it.
				if ($(window).scrollTop() >= distances.navOffset.top) {
					stickNav();
				}
				else {
					destroy();
				}
			}
		};

		var destroy = function() {
			$('nav').removeAttr('style');
			$('.spaceTaker').remove();
		};

		var stickNav = function() {
			// Postition the nav
			$('nav').css({
				position: 'fixed',
				top: '0',
				right: '0',
				left: '0',
				zIndex: '99999'
			});
			// Append an element to take up the space that the nav is leaving behind
			if (document.getElementsByClassName('spaceTaker').length === 0) {
				$('nav').after('<div class="spaceTaker" style="height: ' + $('nav').outerHeight() + 'px;"></div>');
			}
			// Check to see if the browser has been resized since the first init.
			// If it has, content will have moved the nav's original location.
			if ($('.spaceTaker').offset().top !== distances.navOffset.top) {
				distances.navOffset.top = $('.spaceTaker').offset().top; // Reset distances
			}
		};

		// public
		return {
			init: init
		};
	})(); // var stickyNav = (function() {


	

	// public
	return {
		utility: utility,
		stickyNav: stickyNav,
	};
})(jQuery); // var cs = (function() {


/* =================================================================
                             SCROLL SPY MODULE
====================================================================  */
var scrollspy = (function(){

  //
  // Cached jQuery selectors
  // Variables used throughout the module 
  //
  var contentBlocksClass  = 'guideline-wrapper';
  var contentSections     = [];
  var isAnimating         = false;
  var menuID              = 'main-nav';

  var $w                  = $(window);
  var $stickyMenu         = $('#js-sticky-menu');
  var $stickyWrapper      = $('#js-sticky-wrapper');
  var $scrollSpyLink      = $('.nav-link');

  //
  // Initialize our methods
  // Event handlers
  //
  function init () {
    // Create an object containing our nav targets
    contentInventory(contentBlocksClass);

    // Scroll event handler
    $(window).scroll(function() { 
      throttle(setActiveNav(), 300 );
      throttle(sg.stickyNav.init(), 300 );
    });

    // Link handler
    // any link on this page (href="#*")
    $("a[href*=#]").click(function(e) {
    	e.preventDefault();
    	if ($(window).width() >= 826) { // If we're at sticky nav dimensions, offest should include nav height.
    		smoothScroll($(this), - $('nav').outerHeight());
    	}
    	else { 
    		smoothScroll($(this),-40);
    	}
    });
  }  

  function throttle (callback, limit) {
    var wait = false;                 // Initially, we're not waiting
    return function () {              // We return a throttled function
      if (!wait) {                  // If we're not waiting
        callback.call();          // Execute users function
        wait = true;              // Prevent future invocations
        setTimeout(function () {  // After a period of time
            wait = false;         // And allow future invocations
        }, limit);
      }
    }
  }

  //
  // Stick the nav when user scrolls passed
  // 
  function contentInventory (className) {
    var contentSectionElements = document.getElementsByClassName(className); //sections with "main parent" are the top-level nav.  They may have children
    for (var i = contentSectionElements.length - 1; i >= 0; i--) {
      //  
      contentSections.push({  
          id: contentSectionElements[i].id, 
          percentVisible: 0, 
      });
    };  
    return contentSections;
  }

  //
  // How much is visible?
  // Checks how much of an element is visible by comparing its position and height with window height.
  //
  function howMuchVisible (el) { // 
      // Get dimensions
      var windowHeight = $w.height(),
          scrollTop = $w.scrollTop(),
          elHeight = el.outerHeight(),
          elOffset = el.offset().top,
          elFromTop = (elOffset - scrollTop),
          elFromBottom = windowHeight - (elFromTop + elHeight);
      // console.table([{windowHeight:windowHeight, scrollTop:scrollTop, elHeight:elHeight, elOffset:elOffset, elFromTop:elFromTop, elFromBottom:elFromBottom}]);
      // Check if the item is at all visible
      if (
          (elFromTop <= windowHeight && elFromTop >= 0) || (elFromBottom <= windowHeight && elFromBottom >= 0) || (elFromTop <= 0 && elFromBottom <= 0 && elHeight >= windowHeight)) {
          // console.log('Item is in view.');
          // If full element is visible...
          if (elFromTop >= 0 && elFromBottom >= 0) {
              var o = {
                  pixels: elHeight, // Height of element that is visible (pixels), in this case = to elHeight since the whole thing is visible
                  percent: (elHeight / windowHeight) * 100 // Percent of window height element takes up.
              };
              return o; // Return the height of the element
          }
          // If only the TOP of the element is visible...
          else if (elFromTop >= 0 && elFromBottom < 0) {
              var o = {
                  pixels: windowHeight - elFromTop, // Height of element that is visible (pixels)
                  percent: ((windowHeight - elFromTop) / windowHeight) * 100 // Percent of window height element takes up.
              };
              return o;
          }
          // If only the BOTTOM of the element is visible...
          else if (elFromTop < 0 && elFromBottom >= 0) {
              var o = {
                  pixels: windowHeight - elFromBottom, // Height of element that is visible (pixels)
                  percent: ((windowHeight - elFromBottom) / windowHeight) * 100 // Percent of window height element takes up.
              };
              return o;
          }
          // If the element is bigger than the window and only a portion of it is being shown...
          else if (elFromTop <= 0 && elFromBottom <= 0 && elHeight >= windowHeight) {
              var o = {
                  pixels: windowHeight, // Height of element that is visible (pixels)
                  percent: 100 // Percent of window height element takes up. 100 b/c it's covering the window.
              };
              return o;
          }
      } else {
          // console.log('Item is NOT in view.');
          var o = { // Item isn't visible, so return 0 for both values.
              pixels: 0,
              percent: 0
          };
          return o;
      }
  }

  //
  //  update our contentSections object with percentages of how visible each section is
  //
  function checkVisibility () { // 
      for (var i = contentSections.length - 1; i >= 0; i--) // check each section
      {
          sectionVisibility = howMuchVisible($('#' + contentSections[i].id)); // use howMuchVisable to determine this section's visibility
          contentSections[i].percentVisible = sectionVisibility.percent;
          //console.log(contentSections[i].id + " " + contentSections[i].percentVisible);
      }
      //console.table(contentSections);
  }

  //
  // set active nav
  //
  function setActiveNav () {
    var navArr = contentSections;
    var currentSection;

    checkVisibility();

    navArr.sort(function(a, b) {
      return parseFloat(b.percentVisible) - parseFloat(a.percentVisible)
    });
 
    //console.log(isAnimating);
    if ((currentSection != navArr[0].id) && (isAnimating === false)) {  
      $scrollSpyLink.removeClass('active');
      $('.nav-link[href="#' + navArr[0].id + '"').addClass('active');
      currentSection = navArr[0].id;
      if(history.pushState) {
          history.pushState(null, null, '#'+currentSection);
      }
      else {
          location.hash = '#'+currentSection;
      }
    }
  }

  function smoothScroll (el,o) {
    // Setup variables
    var target = el.attr('href');
    var offset = (function(){
      if (typeof o != 'undefined') {
      	return o;
      }
      else {
      	return 0;
      }
    })();
    // Perform scroll
    $(target).velocity("scroll", { 
      duration: 500,
      offset: offset,
      easing: "easeInOutQuart",
      begin: function() { 
         //console.log('animation begin');
      	isAnimating = true;
      },
      complete: function() { 
      	isAnimating = false;
        setActiveNav();
      }
    }); 
  };
  
  return {
    init: init,
    checkVisibility: checkVisibility,
    setActiveNav: setActiveNav,
    menuID: menuID
  };
})();

//
// Call our module!
//
if (document.getElementById(scrollspy.menuID)) {
  scrollspy.init();
  sg.stickyNav.init();
}
