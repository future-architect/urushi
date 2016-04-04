/*eslint "vars-on-top" : 0*/

define(
	'uploadManager.spec',
	['UploadManager', 'jquery', 'templateEngine', 'templateConfig'],
	function(UploadManager, $, templateEngine, templateConfig) {
		'use strict';

		var element = document.body.getElementsByClassName('test-create')[0];

		var createUploadManager = function (options) {
			var uploadManager = new UploadManager(options);
			element.appendChild(uploadManager.rootNode);
			return uploadManager;
		};

		var create$Data = function() {
			var $dummyData = {
				context : {
					done : function() {
						$dummyData.isDone = true;
					},
					fail : function() {
						$dummyData.isFail = true;
						$dummyData.isSubmitted = false;
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
					$dummyData.isFail = false;
					$dummyData.isSubmitted = true;
				},
				response : function() {
					return {
						result : 'dummy'
					};
				},
				isDone : false,
				isFail : false,
				isSubmitted : false,
			};
			return $dummyData;
		};

		describe('UploadManager Test', function() {

			var upm = createUploadManager({
				url : '/test/uploadmanager/test.json',
				allowedTypes : 'jpeg,jpg,png,gif,wmv'
			});

			it('template engine uploadmanager test', function() {
				templateEngine.renderDocument(document.body.getElementsByClassName('test-template-engine')[0], templateConfig).then(function (result) {
					console.log('testsete', result);
				});
			});

			it('null args', function() {
				createUploadManager(null);
			});
			it('empty args', function() {
				createUploadManager({});
			});

			it('countWaitFiles()', function() {
				expect(upm.countWaitFiles()).toBe(0);

				var $dummyData = create$Data();
				upm._onAddFileAction($dummyData, 'dummy.jpg');

				expect(upm.countWaitFiles()).toBe(1);

				upm.items[upm.items.length - 1].upload();
				upm.fileinput._done(null, $dummyData);

				expect(upm.countWaitFiles()).toBe(0);
			});

			it('setDisabled()', function() {
				upm.setDisabled(true);
				expect(upm.isDisabled()).toBe(true);

				upm.setDisabled(false);
				expect(upm.isDisabled()).toBe(false);

				expect(upm.setDisabled()).toBe(false);
			});

			it('Select valid file.', function() {
				var spy = jasmine.createSpy('spy');
				upm.setOnAddFile(spy);
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('dummy.jpg');
				expect(spy.callCount).toBe(1);

				upm.removeOnAddFile();
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				expect(spy.callCount).toBe(1);

				upm.setOnAddFile('callbacktest');
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				expect(spy.callCount).toBe(1);
			});

			it('Select invalid file.', function() {
				var spy = jasmine.createSpy('spy');
				upm.setOnNotAllowedtypeAdd(spy);
				upm._onAddNotAllowedTypeFileAction('dummy.jpg');
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('dummy.jpg');
				expect(spy.callCount).toBe(1);

				upm.removeOnNotAllowedtypeAdd();
				upm._onAddNotAllowedTypeFileAction('dummy.jpg');
				expect(spy.callCount).toBe(1);

				upm.setOnNotAllowedtypeAdd('callbacktest');
				upm._onAddNotAllowedTypeFileAction('dummy.jpg');
				expect(spy.callCount).toBe(1);
			});

			it('onUpload normaly.', function() {
				var spy = jasmine.createSpy('spy'),
					$dummyData = create$Data();
				upm.setOnFileUploadDone(spy);
				upm._onUploadDone('result', $dummyData);
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('result', jasmine.any(Object));
				expect(spy.callCount).toBe(1);
				expect($dummyData.isDone).toBe(true);

				upm.removeOnFileUploadDone();
				upm._onUploadDone('result', create$Data());
				expect(spy.callCount).toBe(1);

				upm.setOnFileUploadDone('callbacktest');
				upm._onUploadDone('result', create$Data());
				expect(spy.callCount).toBe(1);
			});

			it('onUpload abnormaly.', function() {
				var spy = jasmine.createSpy('spy'),
					$dummyData = create$Data();
				upm.setOnFileUploadFail(spy);
				upm._onUploadFail('error', $dummyData);
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith('error', jasmine.any(Object));
				expect(spy.callCount).toBe(1);
				expect($dummyData.isDone).toBe(false);
				expect($dummyData.isFail).toBe(true);

				upm.removeOnFileUploadFail();
				upm._onUploadFail('error', create$Data());
				expect(spy.callCount).toBe(1);

				upm.setOnFileUploadFail('callbacktest');
				upm._onUploadFail('error', create$Data());
				expect(spy.callCount).toBe(1);
			});

			it('onChange', function() {
				var spy = jasmine.createSpy('spy');

				upm.setOnChange(spy);
				upm._onUploadDone('result', create$Data());
				expect(spy.callCount).toBe(1);
				expect(spy.argsForCall[0]).toEqual(['done']);


				upm.items[upm.items.length - 1].cancel();
				expect(spy.callCount).toBe(2);
				expect(spy.argsForCall[1]).toEqual(['cancel']);

				upm.removeOnChange();
				upm._onUploadDone('result', create$Data());
				expect(spy.callCount).toBe(2);

				upm.setOnChange('callbacktest');
				upm._onUploadDone('result', create$Data());
				expect(spy.callCount).toBe(2);
			});

			it('Mouseenter', function() {
				expect($(upm.getRootNode()).find('.dropmessage').is(':visible')).toBe(false);

				upm._onDragEnter();
				expect(upm.getRootNode().classList.contains('upload-manager-dragenter')).toBe(true);

				expect($(upm.getRootNode()).find('.dropmessage').is(':visible')).toBe(true);
			});

			it('Mouseleave', function() {
				expect($(upm.getRootNode()).find('.dropmessage').is(':visible')).toBe(true);

				upm._onDragLeave();
				expect(upm.getRootNode().classList.contains('upload-manager-dragenter')).toBe(false);


				expect($(upm.getRootNode()).find('.dropmessage').is(':visible')).toBe(false);
			});

			it('Fire upload', function() {
				var spy = jasmine.createSpy('spy'),
					$dummyData = create$Data();
				upm.setOnFileUploadStart(spy);

				upm._onAddFileAction($dummyData, 'dummy.jpg');
				upm.items[upm.items.length - 1].upload();
				expect($dummyData.isSubmitted).toBe(true);
				expect(spy).toHaveBeenCalled();
				expect(spy).toHaveBeenCalledWith(jasmine.any(HTMLElement));
				expect(spy.callCount).toBe(1);

				upm.removeOnFileUploadStart();
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				upm.items[upm.items.length - 1].upload();
				expect(spy.callCount).toBe(1);

				upm.setOnFileUploadStart('callbacktest');
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				upm.items[upm.items.length - 1].upload();
				expect(spy.callCount).toBe(1);
			});

			it('Upload → Done → close', function() {
				var $dummyData = create$Data();
				upm._onAddFileAction($dummyData, 'dummy.jpg');
				var item = upm.items[upm.items.length - 1];

				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(false);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(false);

				item.upload();
				expect($dummyData.isSubmitted).toBe(true);

				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(true);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(true);

				upm.fileinput._done(null, $dummyData);

				expect(item.isDone).toBe(true);
				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(true);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(true);

				expect($(item.buttonUpload.getRootNode()).is(':visible')).toBe(false);
				expect($(item.buttonCancel.getRootNode()).is(':visible')).toBe(false);
				expect($(item.buttonClose.getRootNode()).is(':visible')).toBe(true);

				item.close();

				expect($(item.getRootNode()).is(':visible')).toBe(false);
			});

			it('Upload -> Fail', function() {
				var $dummyData = create$Data();
				upm._onAddFileAction($dummyData, 'dummy.jpg');
				var item = upm.items[upm.items.length - 1];

				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(false);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(false);

				item.upload();
				expect($dummyData.isSubmitted).toBe(true);

				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(true);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(true);

				upm.fileinput._fail(null, $dummyData);

				expect(item.buttonUpload.getRootNode().classList.contains('disabled')).toBe(false);
				expect(item.buttonCancel.getRootNode().classList.contains('disabled')).toBe(false);

				expect($(item.buttonUpload.getRootNode()).is(':visible')).toBe(true);
				expect($(item.buttonCancel.getRootNode()).is(':visible')).toBe(true);
				expect($(item.buttonClose.getRootNode()).is(':visible')).toBe(false);
			});

			it('_removeItems()', function() {
				upm._onAddFileAction(create$Data(), 'dummy.jpg');
				upm._removeItems({});
			});

			it('destory', function() {
				upm.getRootNode().classList.add('__test_destroy__');

				expect(document.body.getElementsByClassName('__test_destroy__').length).toBe(1);

				upm.destroy();

				expect(document.body.getElementsByClassName('__test_destroy__').length).toBe(0);


				upm.destroy();
			});

			// For jscover.
			jscoverReport();
		});
	}
);
