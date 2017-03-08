define(
	'Todo',
	[
		'Urushi',
		'Label',
		'text!todoTemplate'
	],
	function(urushi, Label , template) {
		'use strict';
		var CONSTANTS ={
			ID_PREFIX: 'urushi.todo',
			EMBEDDED: {title :''},
			ENTER_KEY: 13
		};
		
		var idNo = 0;

		return Label.extend({

			template: undefined,
			embedded: undefined,

			_initProperties: function(args) {
				this.template = template;
				this.embedded = CONSTANTS.EMBEDDED;
			},
			_attachNode: function() {
				this.closeIconNode = this.rootNode.getElementsByClassName('close')[0];
				this.todoEditNode = this.rootNode.getElementsByClassName('todo-edit')[0];
				this.textAreaNode = this.rootNode.getElementsByClassName('text-area')[0];
				this.checkBoxAreaNode = this.rootNode.getElementsByClassName('check-box-area')[0];
				this.checkBoxNode = this.rootNode.getElementsByClassName('check-box')[0];
				this.todoNode = this.rootNode.getElementsByClassName('todo')[0];
			},
			initOption: function(args) {
				urushi.addEvent(this.closeIconNode, 'click', this, 'destroy');
				urushi.addEvent(this.todoNode, 'dblclick', this, 'edit');
				urushi.addEvent(this.todoEditNode, 'focusout', this, 'update');
				urushi.addEvent(this.todoEditNode, 'keydown', this, 'updateByEnter');
				urushi.addEvent(this.checkBoxNode, 'change', this, 'chnegeTodoStatus');
			},
			_getId: function() {
				return CONSTANTS.ID_PREFIX + idNo++;
			},
			destroy: function() {
				urushi.removeEvent(this.closeIconNode, 'click', this, 'destroy');
				this._super();
			},
			edit : function(){
				this.textAreaNode.style.display = "none";
				this.closeIconNode.style.display = "none";
				this.checkBoxAreaNode.style.display = "none";
				this.todoEditNode.style.display = "inline";
				this.todoEditNode.focus();
				var todoText = this.textAreaNode.textContent;
				this.todoEditNode.value = todoText;
			},
			update : function(){
				this.textAreaNode.style.display = "inline";
				this.closeIconNode.style.display = "inline";
				this.checkBoxAreaNode.style.display = "inline";
				this.todoEditNode.style.display = "none";
				var value = this.todoEditNode.value;
				if(value.length > 0) {
					this.textAreaNode.textContent = value;
				}
			},
			updateByEnter : function(event){
				if(event.which === CONSTANTS.ENTER_KEY) {
					var value = this.todoEditNode.value;
					if(value.length > 0) {
						this.update();
					} else {
						this.destroy();
					}
				}
			},
			chnegeTodoStatus : function(){
				var checkStatus = this.checkBoxNode.checked;
				if(checkStatus == true){
					this.textAreaNode.style.color = "#d9d9d9";
					this.textAreaNode.style.textDecoration = "line-through";
				} else {
					this.textAreaNode.style.color = "";
					this.textAreaNode.style.textDecoration = "";
				}
			}
		});
	}
);