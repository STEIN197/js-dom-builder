# JavaScript DOM Builder

## About
This simple script helps to create DOM structure in JS easily. It could be useful if you want to build DOM (i.e. table, list etc.) from AJAX response.

Simple example:
```JavaScript
var builder = new DOMBuilder()
.tag("html", {lang: "en"}, function(html) {
	html
	.tag("head", null, function(head) {
		head
		.tag("script", {src: "/js/js-dom-builder.js"});
	})
	.tag("body", null, "text");
});
/* 
<html lang="en">
	<head>
		<script src="/js/js-dom-builder.js"></script>
	</head>
	<body>text</body>
</html>
*/
```

Elements are created with `tag()` method. It is the only method you will use to create DOM. The first parameter is the tag name, the second - the element attributes (object or falsy value if an element has no attributes) and the third one is its content.

To create attributes, pass them as an object to the second argument:
```JavaScript
var builder = new DOMBuilder()
.tag("div", {class: "example-div"});
/* 
<div class="example-div"></div>
*/
```

The content could be one of these three types - callback, `DOMBuilder` instance and a scalar value (like number or string). If the content is callback, then an instance of `DOMBuilder` is passed to the callback. Any tag calls on it creates a child element of callback parent. It is the way you create a nested structure:
```JavaScript
new DOMBuilder()
.tag("html", null, function(html) {
	html
	.tag("head", null, function(head) {
		head
		.tag("script", {"src": "/js/js-dom-builder.js"});
	});
});
/* 
<html>
	<head>
		<script src="/js/js-dom-builder.js"></script>
	</head>
</html>
*/
```

If you return any non-undefined value from callback, then it will be appended to the end:
```JavaScript
new DOMBuilder()
.tag("div", null, function(div) {
	div
	.tag("p");
	return "another text";
});
/* 
<div>
	<p></p>
	another text
</div>
*/
```

If the content is another builder, then its content will be placed inside the wrapper builder:
```JavaScript
var p = new DOMBuilder()
.tag("p");
var div = new DOMBuilder()
.tag("div", null, p);
/* 
<div>
	<p></p>
</div>
*/
```

And if the content is neither callback nor `DOMBuilder` instance, then it is just placed as an inner text:
```JavaScript
new DOMBuilder()
.tag("div", null, "text");
/* 
<div>text</div>
*/
```

To retrieve the resulting tree and paste it furterly, call `toString()` or `getNodes()` methods. The first one returns minified DOM as a string and the second one returns an array of HTMLElement instances:
```JavaScript
var builder = new DOMBuilder()
.tag("div", null, "text")
.tag("p", null, "another text");
builder.toString(); // <div>text</div><p>another text</p>
builder.getNodes(); // [div, p]
```
