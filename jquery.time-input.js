/*
 * jQuery Time Input 1.0.0
 *
 * Developed by Kimberly Grey
 * https://github.com/querkmachine
 *
 * Licensed under the MIT licence:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

;(function($, window, document, undefined) {
	'use strict';
	const pluginName = 'timepicker';
	const defaults = {
		debug: false,
		timeFormat: '12hr',
		placeholder: '',
		interval: 15
	};
	function Plugin(element, options) {
		this.$element = $(element);
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this._id = `${pluginName}-${Math.random().toString(36).substring(6)}`;
		if(typeof this.$element.data(`${pluginName}-init`) !== 'undefined') {
			return;
		};
		this.callbacks = [];
		this.init();
	};
	$.extend(Plugin.prototype, {
		init: function() {
			this.$element.data(`${this._name}-init`, true);

			// Set up callbacks
			if(this.settings.onChange) {
				this.callbacks['onChange'] = this.settings.onChange;
			};

			// Create datalist
			const $datalist = $('<datalist/>', {
				'id': `${this._id}-datalist`
			});
			$.each(this.datalistOptions(), (i, time) => {
				$datalist.append($('<option/>').val(time));
			});
			this.$element.after($datalist);

			// Fiddle with the input
			this.$element.attr('type', 'text').attr('list', `${this._id}-datalist`).attr('placeholder', this.settings.placeholder);
		},
		datalistOptions: function() {
			const returns = [];
			const minutes = 60;
			if(this.settings.timeFormat === '12hr') {
				const meridians = ['am', 'pm'];
				const hours = 12;
				$.each(meridians, (k, meridian) => {
					for(let i = 0; i < hours; i++) {
						let hour = (i > 0) ? i : 12;
						for(let j = 0; j < minutes; j += this.settings.interval) {
							returns.push(`${this.leftPad(hour)}:${this.leftPad(j)}${meridian}`);
						}
					}
				});
			}
			else {
				const hours = 24;
				for(let i = 0; i < hours; i++) {
					for(let j = 0; j < minutes; j += this.settings.interval) {
						returns.push(`${this.leftPad(i)}:${this.leftPad(j)}`);
					}
				}
			}
			return returns;
		},
		leftPad: function(input = '', size = 2, pad = 0) {
			input = input + '';
			return (input.length >= size) ? input : new Array(size - input.length + 1).join(pad) + input;
		}
	});
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, `plugin_${pluginName}`)) {
				$.data(this, `plugin_${pluginName}`, new Plugin(this, options));
			};
		});
	};
})(jQuery, window, document);