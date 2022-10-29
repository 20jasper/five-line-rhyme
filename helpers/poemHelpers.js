// replace &, <, and > with appropriate HTML entity
exports.sanitizeHTML = (string) => {
	const entityHashMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
	};

	return string.replace(/&|<|>/g, (str) => entityHashMap[str]);
};
