// replace &, <, and > with appropriate HTML entity
exports.sanitizeHTML = (string) => {
	const entityHashMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
	};

	return string.replace(/&|<|>/g, (str) => entityHashMap[str]);
};

exports.getLineCount = (string) => {
	const newLineCount = string.split(/\r/g).length;
	return newLineCount;
};
