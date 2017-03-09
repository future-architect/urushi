define(
	'TodoInput',
	[
		'Urushi',
		'Input',
		'text!todoInputTemplate',
		'Todo',
		'Base'
	],
	function(urushi, Input, template, Todo ,Base) {
		'use strict';
		
		var CONSTANTS = {
			ID_PREFIX : 'urushi.todoInput',
			EMBEDDED: {},
			ENTER_KEY: 13
		};

		var idNo = 0;

		return Base.extend({

			template: undefined,
			embedded: undefined,

			_initProperties: function(args) {
				var input = new Input({placeholder : "What needs to be done?"});
				this.inputNode = input.getRootNode();
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			_attachNode: function() {
				this.todoAreaNode = this.rootNode.getElementsByClassName('todo-area')[0];
				this.todoInputAreaNode = this.rootNode.getElementsByClassName('todo-input-area')[0];
			},
			initOption: function(args) {
				this.todoInputAreaNode.appendChild(this.inputNode);
				urushi.addEvent(this.inputNode.getElementsByClassName('form-control')[0],'keydown',this, 'createTodo');
			},
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			createTodo : function(event) {
				if(event.which === CONSTANTS.ENTER_KEY){
					var value = this.inputNode.getElementsByClassName('form-control')[0].value
					if(value.length > 0 ) {
						var todo = new Todo();
						var todoRootNode = todo.getRootNode();
						todoRootNode.getElementsByClassName('text-area')[0].textContent = value;
						this.todoAreaNode.appendChild(todoRootNode);
						this.inputNode.getElementsByClassName('form-control')[0].value = "";
					}
				}
			},
		});
	}
);