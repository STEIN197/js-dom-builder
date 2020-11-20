function DOMBuilder() {

	this.nodes = [];

	this.tag = function(tagName, attributes, content) {
		var tag = document.createElement(tagName);
		for (var key in attributes)
			tag.setAttribute(key, attributes[key]);
		if (content) {
			if (typeof content === "function") {
				var childBuilder = new DOMBuilder();
				var result = content(childBuilder);
				if (result === undefined) {
					for (var i in childBuilder.nodes) {
						tag.appendChild(childBuilder.nodes[i])
					}
				} else {
					tag.textContent = result;
				}
			} else {
				tag.textContent = content;
			}
		}
		this.nodes.push(tag);
		return this;
	}

	this.getTree = function() {
		return this.nodes;
	}
}
