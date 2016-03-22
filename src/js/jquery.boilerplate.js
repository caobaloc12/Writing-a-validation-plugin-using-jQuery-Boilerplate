// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variables rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
	var pluginName = "testValidate",
        defaults = {
            class: ".testValidate",
            required: '<div class="error"><span>$name is required </span></div>',
            minlength: '<div class="error"><span>$name must be at least $value characters long</span></div>',
            maxlength: '<div class="error"><span>$name can only be $value characters long</span></div>',
            email: '<div class="error"><span>$name is not valid</span></div>',
            phone: '<div class="error"><span>$name is not valid</span></div>',
            agree: '<div class="error"><span>please agree our policy</span></div>',
            confirmpassword: '<div class="error"><span>password does not match</span></div>'
        },
        self,
        valid,
        phoneRegex,
        emailRegex;

		// The actual plugin constructor
        function Plugin(element, options) {
            self = this;
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
			    // call them like the example below
			    valid = true;
			    phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                emailRegex = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
			},
		    
			validate: function (form) {
			    $(form).find(this.settings.class).each(function (e) {
			        if ($(this).attr('data-validate')) {
			            var args = $(this).attr('data-validate').split(",");
			            for (var i = 0; i < args.length; i++) {
			                if (args[i].indexOf("=") == -1) {
			                    valid = self['check' + args[i]](this);
			                } else {
			                    valid = self['check' + args[i].substr(0, args[i].indexOf('='))](this, args[i].substr(args[i].indexOf('=') + 1));
			                }			                
			            }
			        }
			    });
			    return valid;
			},

		    //set error
			setErrorMessage: function (input, type, value, min, max) {
			    var errorMsg = self.settings[type]
                    .replace('$name', $(input).attr('name'))
                    .replace('$value', value)
                    .replace('$min', min)
			        .replace('$max', max);
			    $(input).parent().append(errorMsg);
			    
			},

		    // validate required fields
			checkrequired: function (input) {
			    switch (input.type) {
			        case "checkbox":			        
			            if (!input.checked) {
			                self.setErrorMessage(input, "required");
			                $(input).focus();
			                return false;
			            }
			            return true;
			            break;
			        case "radio":
			            if (!$('input[name=gender]:checked').val()) {
							$('.radio-inline > .error').empty();
			                self.setErrorMessage(input, "required");
			                $(input).focus();
			                return false;
			            }
			            return true;
			            break;
			        default:
			            if ($(input).val() == "" || $(input).val().length == 0) {
			                self.setErrorMessage(input, "required");
			                $(input).focus();
			                return false;
			            }
			            return true;
			    }
		        
		    },
		    // validate max length
		    checkmaxlength: function (input, value) {

		        if ($(input).val().length > value) {
		            self.setErrorMessage(input, "maxlength", value);
		            $(input).focus();
		            return false;
		        }
		        return true;
		    },

		    // validate min length
		    checkminlength: function (input, value) {
		        if ($(input).val().length < value && $(input).val() != "") {
		            self.setErrorMessage(input, "minlength", value);
		            $(input).focus();
		            return false;
		        }
		        return true;
		    },

		    // validate email
		    checkemail: function (input) {
		        if (!emailRegex.test($(input).val()) && $(input).val() != "") {
		            self.setErrorMessage(input, "email");
		            $(input).focus();
		            return false;
		        }
		        return true;
		    },
		    // validate phone
		    checkphone: function (input) {
		        if (!phoneRegex.test($(input).val()) && $(input).val() != "") {
		            self.setErrorMessage(input, "phone");
		            $(input).focus();
		            return false;
		        }
		        return true;
		    },

		    // validate confirm password
		    checkconfirmpassword: function (input) {
		        //get passwrd and confirm passwrd element
		        var allPasswrdElm = $('input[type=password]');
		        var confirmPasswordElm = $(input);

		        var passwrd = allPasswrdElm.filter(function (index) {
		            return allPasswrdElm[index].id != $(input)[0].id;
		        });

		        if ($(input).val() !== $('#' + passwrd[0].id).val()) {
		            self.setErrorMessage(input, "confirmpassword");
		            $(input).focus();
		            return false;
		        }
		        return true;
		    },
		});
		
		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
				$(this).submit(function () {
				    $('.error').empty();
				    if (!self.validate(this)) {
				        return false;
				    } else {
				        alert("Validate successfully!");
				    }
				});
			});
			
		};

} )( jQuery, window, document );
