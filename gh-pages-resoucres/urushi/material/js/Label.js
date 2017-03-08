define(
	'Label',
	[
		'Urushi',
		'Base',
		'text!labelTemplate'
	],

	function(urushi,Base,template){
		'use strict';

		var CONSTANTS = {
			ID_PREFIX : 'urushi.Label',
			EMBEDDED : {labelClass : '',additionalClass : '',title :''}
		};

		var idNo = 0;

		return Base.extend({

			template : undefined,
			embedded : undefined,

			_initProperties : function(args){
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			_attachNode : function () {
				this.titleNode = this.rootNode.getElementsByClassName('label-title')[0];
			},
			_getId : function(){
				return CONSTANTS.ID_PREFIX + idNo ++;
			}
		});
	}
);