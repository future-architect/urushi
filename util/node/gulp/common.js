module.exports = {
	_writeLine : function(str) {
		//lineの長さを定義
		'use strict';
		var LINE_LENGTH = 60,
			line = '',
			lineStr,
			i;

		// 例外時のデフォルト値を設定
		if (null === str || undefined === str || typeof str !== 'string') {
			lineStr = '*';
		} else {
			lineStr = str.substring(0, 1);
		}
		for (i = 0; i < LINE_LENGTH; i++) {
			line = line + lineStr;
		}
		console.log(line);
	},
	_insertBlankLine : function() {
		'use strict';
		console.log('');
	}
};