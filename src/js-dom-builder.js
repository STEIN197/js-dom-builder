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

	this.toString = function() {
		return getMinified(this.nodes);
	}

	var getMinified = function(data) {
		var result = "";
		for (var i in data) {
			var element = data[i];
			var tagName = element.tagName.toLowerCase();
			var attributes = element.attributes
			var strAttributes = [];
			for (var i = 0; i < attributes.length; i++) {
				strAttributes.push(attributes[i].nodeName + "=\"" + attributes[i].value + "\"");
			}
			if (strAttributes.length) {
				strAttributes = " " + strAttributes.join(" ");
			}
			result += "<" + tagName + strAttributes + ">";
			if (element.children.length) {
				result += getMinified(Array.prototype.slice.call(element.children));
			} else {
				result += element.textContent;
			}
			result += "</" + tagName + ">";
		}
		return result;
	}
}
