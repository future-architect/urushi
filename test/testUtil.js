function startJasmine () {
	var env = window.jasmine.getEnv();
	env.execute();
}

function jscoverReport () {
	// For jscover
	if ('8989' === location.port) {
		return;
	}
	if (window.jscoverage_report) {
		jscoverage_report();
	}
}
