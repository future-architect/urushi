function jasmineReport () {
	var env = jasmine.getEnv();
	env.addReporter(new jasmine.HtmlReporter);
	env.execute();
	// env.end();
}

function jscoverReport () {
	// localからの起動はport8989を指定しているため。
	// localのテストではカバレッジのログを自動保存しない。
	if ('8989' === location.port) {
		return;
	}
	if(window.jscoverage_report){
		jscoverage_report();
	}
}
