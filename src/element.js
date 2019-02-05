export function svg(type, { style = {}, text, class: className, ...attr } = {}, ...nodes) {
	const src = document.createElementNS("http://www.w3.org/2000/svg", type);
	className && (src.className.baseVal = className);
	if (text) {
		if (text.split("\n").length > 1) {
			text.split("\n").map((text, i, arr) => src.append(svg("tspan", {
				text,
				x: 0,
				dy: !i ? "-0.5em" : "1.1em"
			})));
		} else {
			src.textContent = text;
		}
	}
	Object.keys(style).map(key => src.style[key] = style[key]);
	Object.keys(attr).map(key => src.setAttribute(key, attr[key]));
	nodes.filter(n => n).map(ch => src.append(ch));
	return src;
}

export function html(type, { style = {}, text, class: className, ...attr } = {}, ...nodes) {
	const src = document.createElement(type);
	className && (src.className = className);
	if (text) {
		src.textContent = text;
	}
	Object.keys(style).map(key => src.style[key] = style[key]);
	Object.keys(attr).map(key => src.setAttribute(key, attr[key]));
	nodes.filter(n => n).map(ch => src.append(ch));
	return src;
}