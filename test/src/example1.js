/*!
 * Project
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
/*jshint eqeqeq: true, noempty: true, strict: true, undef: true, expr: true, smarttabs: true, browser: true */
/*global jQuery:false */
;(function ($, undefined) {
	'use strict';

	// Plugin "class"
	function Plugin(add){

		// Alias for this
		var self = this;

		/**
		 * Do something.
		 *
		 * @param  {Mixed} arg
		 *
		 * @return {Void}
		 */
		self.foo = function(arg){
			self.bar(arg);
		};

		/**
		 * Do something.
		 *
		 * @param  {Mixed} arg
		 *
		 * @return {Void}
		 */
		self.bar = function(arg){
			baz(arg);
		};

		/**
		 * Do something.
		 *
		 * @param  {Mixed} arg
		 *
		 * @return {Void}
		 */
		function baz(arg){
			return arg + add;
		}
	}

	// jQuery plugin extension
	$.fn.pluginName = function(adder){
		// Call plugin on all elements
		return this.each(function(i, element){
			// Plugin call with prevention against multiple instantiations
			if (!$.data(element, 'pluginName')) {
				$.data(element, 'pluginName', new Plugin(adder));
			}
		});
	};

	// Default options
	$.fn.pluginName.defaults = {
		limit:    5,     // Limit comment
		positive: true,  // Positive comment
		negative: false  // Negative comment
	};
}(jQuery));