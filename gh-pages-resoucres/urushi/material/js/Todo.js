define(
	'Todo',
	[
		'Urushi',
		'Label',
		'Input',
		'Checkbox',
		'text!todoTemplate'
	],
	function(urushi, Label, Input, Checkbox, template) {
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
				var input = new Input();
				this.inputNode = input.getRootNode();
				this.inputNode.classList.add('todo-edit');
				this.inputNode.style.display = "none";
				var checkBox = new Checkbox();
				this.checkBoxNode = checkBox.getRootNode();
				console.log(this.checkBoxNode);
				this.checkBoxNode.style.display = "inline";
				this.checkBoxNode.style.cssFloat = "left";
				this.checkNode = this.checkBoxNode.getElementsByTagName('input')[0];
				this.closeIconNode = this.rootNode.getElementsByClassName('close')[0];
				this.textAreaNode = this.rootNode.getElementsByClassName('text-area')[0];
				this.todoNode = this.rootNode.getElementsByClassName('todo')[0];
			},
			initOption: function(args) { 
				this.todoNode.appendChild(this.inputNode);
				this.todoNode.appendChild(this.checkBoxNode);
				urushi.addEvent(this.closeIconNode, 'click', this, 'destroy');
				urushi.addEvent(this.todoNode, 'dblclick', this, 'edit');
				urushi.addEvent(this.inputNode.getElementsByClassName('form-control')[0], 'focusout', this, 'update');
				urushi.addEvent(this.inputNode.getElementsByClassName('form-control')[0], 'keydown', this, 'updateByEnter');
				urushi.addEvent(this.checkNode, 'change', this, 'chnegeTodoStatus');
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
				this.checkBoxNode.style.display = "none";
				this.inputNode.style.display = "block";
				this.inputNode.getElementsByClassName('form-control')[0].focus();
				var todoText = this.textAreaNode.textContent;
				this.inputNode.getElementsByClassName('form-control')[0].value = todoText;
			},
			update : function(){
				this.textAreaNode.style.display = "inline";
				this.closeIconNode.style.display = "inline";
				this.checkBoxNode.style.display = "inline";
				this.inputNode.style.display = "none";
				var value = this.inputNode.getElementsByClassName('form-control')[0].value;
				if(value.length > 0) {
					this.textAreaNode.textContent = value;
				}
			},
			updateByEnter : function(event){
				if(event.which === CONSTANTS.ENTER_KEY) {
					var value = this.inputNode.getElementsByClassName('form-control')[0].value;
					if(value.length > 0) {
						this.update();
					} else {
						this.destroy();
					}
				}
			},
			chnegeTodoStatus : function(){
				var checkStatus = this.checkNode.checked;
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