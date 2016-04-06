require.config(requireConfig);

require(["Button", "urushi", "Deferred", "xhr"], function(Button, urushi, Deferred, xhr) {
	window.urushi = urushi;
	
	var head = document.createElement("h2");
	head.innerHTML = "Defererd test";
	document.body.appendChild(head);

	// Button
	var button = new Button({
		label : "Fire",
		additionalClass : "button-layout"
	});
	document.body.appendChild(button.rootNode);
});
