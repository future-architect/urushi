/*eslint "vars-on-top" : 0*/
define(
	'fileInput.spec',
	['FileInput', 'jquery', 'templateEngine', 'templateConfig'],
	function(FileInput, $, templateEngine, templateConfig) {
		'use strict';

		var element = document.body.getElementsByClassName('test-create')[0];

		var createFileInput = function (options) {
			var fileInput = new FileInput(options);
			element.appendChild(fileInput.rootNode);
			return fileInput;
		};

		var create$Data = function(fileName) {
			var dummy$Data = {
				files : [{name : fileName || 'テスト.jpg'}],
				context : {
					done : function() {
						dummy$Data.isDone = true;
					},
					fail : function() {
						dummy$Data.isFail = true;
						dummy$Data.isSubmitted = false;
					},
					getRootNode : function() {
						return {
							toString : function() {
								return 'dummyNode';
							}
						};
					},
				},
				submit : function() {
					dummy$Data.isFail = false;
					dummy$Data.isSubmitted = true;
				},
				response : function() {
					return {
						result : 'dummy'
					};
				},
				errorThrown : 'dummy',
				isDone : false,
				isFail : false,
				isSubmitted : false,
			};
			return dummy$Data;
		};

		describe('FileInput Test', function() {

			var fi = createFileInput({
				label : 'テスト',
				url : '/test/uploadManagerTest.json',
				allowedTypes : 'jpeg,jpg,png,gif,wmv'
			});


			it('template engine uploadmanager test', function() {
				templateEngine.renderDocument(document.body.getElementsByClassName('test-template-engine')[0], templateConfig).then(function (result) {
					console.log('testsete', result);
				});
			});

			it('null args', function() {
				createFileInput(null);//エラーにならなければOK
			});
			it('empty args', function() {
				createFileInput({});//エラーにならなければOK
			});

			it('setDisabled()', function() {
				fi.setDisabled(true);
				expect(fi.isDisabled()).toBe(true);

				fi.setDisabled(false);
				expect(fi.isDisabled()).toBe(false);
			});

			it('ファイル選択イベント', function() {
				var spy = jasmine.createSpy('spy');
				fi.setOnAdd(spy);
				fi._add(null, create$Data());
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith(jasmine.any(Object), 'テスト.jpg');
				expect(spy.callCount).toBe(1);

				fi.removeOnAdd();
				fi._add(null, create$Data());
				expect(spy.callCount).toBe(1);

				fi.setOnAdd('callbacktest');
				fi._add(null, create$Data());
				expect(spy.callCount).toBe(1);
			});

			it('不正ファイル選択イベント', function() {
				var spy = jasmine.createSpy('spy');
				fi.setOnNotAllowedtypeAdd(spy);
				fi._add(null, create$Data('テスト.txt'));
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('テスト.txt');
				expect(spy.callCount).toBe(1);

				fi.removeOnNotAllowedtypeAdd();
				fi._add(null, create$Data('テスト.txt'));
				expect(spy.callCount).toBe(1);

				fi.setOnNotAllowedtypeAdd('callbacktest');
				fi._add(null, create$Data('テスト.txt'));
				expect(spy.callCount).toBe(1);
			});

			it('Upload成功イベント', function() {
				var spy = jasmine.createSpy('spy');
				fi.setOnUploadDone(spy);
				fi._done(null, create$Data());
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('dummy', jasmine.any(Object));
				expect(spy.callCount).toBe(1);

				fi.removeOnUploadDone();
				fi._done(null, create$Data());
				expect(spy.callCount).toBe(1);

				fi.setOnUploadDone('callbacktest');
				fi._done(null, create$Data());
				expect(spy.callCount).toBe(1);
			});

			it('Upload失敗イベント', function() {
				var spy = jasmine.createSpy('spy');
				fi.setOnUploadFail(spy);
				fi._fail(null, create$Data());
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('dummy', jasmine.any(Object));
				expect(spy.callCount).toBe(1);

				var data = create$Data();
				data.errorThrown = 'abort';
				fi._fail(null, data);
				expect(spy.callCount).toBe(1);

				fi.removeOnUploadFail();
				fi._fail(null, create$Data());
				expect(spy.callCount).toBe(1);

				fi.setOnUploadFail('callbacktest');
				fi._fail(null, create$Data());
				expect(spy.callCount).toBe(1);
			});

			it('不正なドラッグイベント登録', function() {
				fi.setOnDragEnter('callbacktest');
				fi.setOnDragLeave('callbacktest');

				expect(fi.callbackMap.dragenter).toBeUndefined();
				expect(fi.callbackMap.dragleave).toBeUndefined();
			});

			it('ドラッグイベント', function() {
				var spyE = jasmine.createSpy('spyE');
				var spyL = jasmine.createSpy('spyL');

				fi.setOnDragEnter(spyE);
				fi.setOnDragLeave(spyL);
				fi._dragenter(null);
				expect(spyE.callCount).toBe(1);
				expect(spyL.callCount).toBe(0);

				fi._dragover(null);
				expect(spyE.callCount).toBe(1);
				expect(spyL.callCount).toBe(0);

				fi._dragleave(null);
				fi._dragenter(null);
				//すぐには発火されない
				expect(spyE.callCount).toBe(1);
				expect(spyL.callCount).toBe(0);

				waits(110);

				runs(function() {
					expect(spyE.callCount).toBe(1);
					expect(spyL.callCount).toBe(0);

					fi._dragleave(null);
					fi._dragover(null);
					expect(spyE.callCount).toBe(1);
					expect(spyL.callCount).toBe(0);
				});

				waits(110);

				runs(function() {
					expect(spyE.callCount).toBe(1);
					expect(spyL.callCount).toBe(0);

					fi._dragleave(null);
					fi._dragleave(null);
					expect(spyE.callCount).toBe(1);
					expect(spyL.callCount).toBe(0);
				});

				waits(110);

				runs(function() {
					expect(spyE.callCount).toBe(1);
					expect(spyL.callCount).toBe(1);

					fi._dragleave(null);
				});
			});


			it('destory', function() {
				fi.getRootNode().classList.add('__test_destroy__');

				expect(document.body.getElementsByClassName('__test_destroy__').length).toBe(1);

				fi.destroy();

				expect(document.body.getElementsByClassName('__test_destroy__').length).toBe(0);


				fi.destroy();//二重呼び出しでエラーにならない
			});

			it('dropZone Option', function() {
				createFileInput({
					label : 'DropZoneOption',
					url : '/test/uploadManagerTest.json',
					allowedTypes : 'jpeg,jpg,png,gif,wmv',
					dropZone : document.body
				});
			});

			// For jscover.
			jscoverReport();
		});
	}
);
