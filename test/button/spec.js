define(
	'button.spec',
	['Urushi', 'Button', 'templateEngine', 'templateConfig'],
	function (Urushi, Button, templateEngine, templateConfig) {
		'use strict';

		var id = 'c-button',
			button1 = new Button({id : id}),
			button2,
			buttons,
			validMousedownEvent = {type : 'mousedown', pageX : 1000, pageY : 1000},
			invalidMousedownEvent = {type : 'touchend', pageX : 1000, pageY : 1000},
			unknownMousedownEvent = {type : 'mousedown'},
			validTouchEvent = {originalEvent : {
				type : 'touchstart',
				touches : [{pageX : 1000, pageY : 1000}]
			}},
			invalidTouchEvent = {originalEvent : {
				type : 'click',
				touches : [{}, {}]
			}},
			temp,
			isTouchDummy = function () {return true;},
			hasTransitionSupportTrue = function () {return true;},
			hasTransitionSupportFalse = function () {return false;};

		describe('Button test', function () {
			it('button test', function () {
				// creation.
				button2 = new Button();
				expect(button2.id).toBe('urushi.button0');
				expect(button2.destroy()).toBe();

				// getRootNode()
				expect(button1.getRootNode().id).toBe(id);

				// setDisabled()
				button1.setDisabled();
				expect(button1.getRootNode().classList.contains('disabled')).toBe(false);
				button1.setDisabled(true);
				expect(button1.getRootNode().classList.contains('disabled')).toBe(true);
				button1.setDisabled(true);
				expect(button1.getRootNode().classList.contains('disabled')).toBe(true);
				button1.setDisabled(false);
				expect(button1.getRootNode().classList.contains('disabled')).toBe(false);
				button1.setDisabled(false);
				expect(button1.getRootNode().classList.contains('disabled')).toBe(false);

				// isDisabled()
				button1.setDisabled(false);
				expect(button1.isDisabled()).toBe(false);
				button1.setDisabled(true);
				expect(button1.isDisabled()).toBe(true);
				button1.setDisabled(false);
			});

			it('Ripple test', function() {
				var wrapper,
					relX,
					relY,
					rippleColor,
					ripple,
					validArgument;

				// _createRippleWrapperElement()
				document.getElementById('script-modules').appendChild(button1.getRootNode());
				wrapper = button1._createRippleWrapperElement();
				expect(wrapper.tagName).toBe('DIV');
				expect(button1._createRippleWrapperElement()).toBe(wrapper);

				// _getX()
				expect(isNaN(button1._getX(button1.getRootNode(), validMousedownEvent))).toBe(false);
				temp = Urushi.isTouch;
				Urushi.isTouch = isTouchDummy;
				expect(isNaN(button1._getX(button1.getRootNode(), invalidTouchEvent))).toBe(true);
				expect(isNaN(button1._getX(button1.getRootNode(), validTouchEvent))).toBe(false);
				Urushi.isTouch = temp;
				relX = button1._getX(button1.getRootNode(), validMousedownEvent);

				// _getY()
				expect(isNaN(button1._getY(button1.getRootNode(), validMousedownEvent))).toBe(false);
				temp = Urushi.isTouch;
				Urushi.isTouch = isTouchDummy;
				expect(isNaN(button1._getY(button1.getRootNode(), invalidTouchEvent))).toBe(true);
				expect(isNaN(button1._getY(button1.getRootNode(), validTouchEvent))).toBe(false);
				Urushi.isTouch = temp;
				relY = button1._getY(button1.getRootNode(), validMousedownEvent);

				// _getRippleColor()
				expect(button1._getRippleColor()).toBe('rgba(5, 2, 0, 0.729412)');
				button1.getRootNode().setAttribute('data-ripple-color', 'test');
				expect(button1._getRippleColor()).toBe('test');
				button1.getRootNode().removeAttribute('data-ripple-color');
				rippleColor = button1._getRippleColor();

				// _createRippleElement()
				ripple = button1._createRippleElement(relX, relY, rippleColor);

				// _onRippleStart()
				expect(button1._onRippleStart(invalidMousedownEvent)).toBe(false);
				expect(button1._onRippleStart(unknownMousedownEvent)).toBe(false);
				expect(button1._onRippleStart(validMousedownEvent)).toBe(true);
				temp = Urushi.isTouch;
				Urushi.isTouch = isTouchDummy;
				button1._onRippleStart(validMousedownEvent);
				button1._onRippleStart(validTouchEvent);
				Urushi.isTouch = temp;

				// _onRippleMouseup()
				validArgument = {ripple : ripple, wrapper : wrapper};
				wrapper.removeAttribute('data-ripple-mousedown');
				expect(button1._onRippleMouseup()).toBe();
				expect(button1._onRippleMouseup({})).toBe();
				expect(button1._onRippleMouseup({ripple : ripple, wrapper : null})).toBe();
				expect(button1._onRippleMouseup(validArgument)).toBe();
				ripple.setAttribute('data-ripple-animate', 'off');
				expect(button1._onRippleMouseup(validArgument)).toBe();
				ripple.removeAttribute('data-ripple-mousedown');
				ripple.removeAttribute('data-ripple-animate');

				// _rippleOn()
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(button1._rippleOn(ripple)).toBe();
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(button1._rippleOn(ripple)).toBe();
				Urushi.hasTransitionSupport = temp;

				// _rippleOut()
				temp = Urushi.hasTransitionSupport;
				Urushi.hasTransitionSupport = hasTransitionSupportTrue;
				expect(button1._rippleOut(ripple, wrapper)).toBe();
				Urushi.hasTransitionSupport = hasTransitionSupportFalse;
				expect(button1._rippleOut(ripple, wrapper)).toBe();
				Urushi.hasTransitionSupport = temp;

				// _rippleAnimationEnd()
				ripple.removeAttribute('data-ripple-mousedown');
				expect(button1._rippleAnimationEnd(ripple, wrapper)).toBe();
				ripple.setAttribute('data-ripple-mousedown', 'off');
				expect(button1._rippleAnimationEnd(ripple, wrapper)).toBe();
				ripple.removeAttribute('data-ripple-mousedown');
			});

			describe('Template engine', function () {
				var flag = false;
				beforeEach(function (done) {
					templateEngine.renderDocument(document.body, templateConfig).then(function (result) {
						flag = true;
						done();
					}).otherwise(function (error) {
						flag = false;
						done();
					});
				});
				it('template engine test', function () {
					expect(flag).toBe(true);
				});
			});

			// For jscover.
			jscoverReport();
		});
	}
);
