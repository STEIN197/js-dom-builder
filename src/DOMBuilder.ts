import {Content} from "Content";
import {Map} from "Map";
import {Data} from "Data";

export default class DOMBuilder {

	#nodes: HTMLElement[];

	public get nodes(): HTMLElement[] {
		return this.#nodes;
	}

	public tag(tagName: string, attributes?: object, content?: Content): DOMBuilder;

	public tag(tagName: string, content?: Content, attributes?: object): DOMBuilder;
	
	public tag(tagName: any, a?: any, b?: any): DOMBuilder {
		let tag: HTMLElement = document.createElement(tagName);

		let data = DOMBuilder.get(a, b);

		if (data.attributes)
			for (var key in data.attributes)
				tag.setAttribute(key, data.attributes[key]);

		if (data.content) {
			if (typeof data.content === "function") {
				let childBuilder = new DOMBuilder();
				let result = data.content(childBuilder);
				let childBuilderNodes = childBuilder.#nodes;

				for (let child of childBuilderNodes)
					tag.appendChild(child);

				if (result !== undefined && result !== null)
					tag.append(result);
			} else if (data.content instanceof DOMBuilder) {
				let contentNodes = data.content.#nodes;

				for (let child of contentNodes)
					tag.appendChild(child);
			} else {
				tag.textContent = data.content.toString();
			}
		}

		this.#nodes.push(tag);
		return this;
	}

	public toString(): string {
		return DOMBuilder.minify(this.#nodes);
	}

	private static minify(data: HTMLElement[]): string {
		let result = "";

		for (let element of data) {
			let tagName = element.tagName.toLowerCase();
			let attributes: string[] = Array
				.from(element.attributes)
				.map(v => `${v.nodeName}="${v.value}"`);
			let strAttributes: string = attributes.length ? ` ${attributes.join(" ")}` : "";
			result += `<${tagName + strAttributes}>${element.children.length ? DOMBuilder.minify(Array.from(element.children)) : element.textContent}</${tagName}>`;
		}

		return result;
	}

	private static get(a?: Content | object, b?: Content | object): Data {
		let result: Data = {attributes: null, content: null};

		if (DOMBuilder.isContent(a)) {
			result.content = a as Content;
			if (b)
				result.attributes = b as Map;
		} else {
			result.attributes = a as Map;
			if (b)
				result.content = b as Content;
		}

		return result;
	}

	private static isContent(arg: any): boolean {
		return ["function", "string"].includes(typeof arg) || arg instanceof DOMBuilder;
	}
}
