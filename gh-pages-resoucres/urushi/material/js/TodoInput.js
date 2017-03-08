define(
	'TodoInput',
	[
		'Urushi',
		'Input',
		'text!todoInputTemplate',
		'Todo'
	],
	function(urushi, Input, template, Todo) {
		'use strict';
		
		var CONSTANTS = {
			ID_PREFIX : 'urushi.todoInput',
			EMBEDDED: {},
			ENTER_KEY: 13
		};

		var idNo = 0;

		return Input.extend({

			template: undefined,
			embedded: undefined,

			_initProperties: function(args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			_attachNode: function() {
				this.todoAreaNode = this.rootNode.getElementsByClassName('todo-area')[0];
				this.todoInputNode = this.rootNode.getElementsByClassName('todo-input')[0];
			},
			initOption: function(args) {
				urushi.addEvent(this.todoInputNode,'keydown',this, 'createTodo');
			},
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			createTodo : function(event) {
				if(event.which === CONSTANTS.ENTER_KEY){
					var value = this.rootNode.getElementsByClassName('todo-input')[0].value
					if(value.length > 0 ) {
						var todo = new Todo();
						var todoRootNode = todo.getRootNode();
						todoRootNode.getElementsByClassName('text-area')[0].textContent = value;
						this.todoAreaNode.appendChild(todoRootNode);
						this.todoInputNode.value = "";
					}
				}
			}
		});
	}
);