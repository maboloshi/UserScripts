// ==UserScript==
// @name          GitHub Tab Size (4 spaces)
// @version       0.1
// @namespace     https://github.com/maboloshi/UserScripts
// @description	  将github和gist上的代码缩进设为4个空格
// @author        maboloshi <https://github.com/maboloshi>
// @homepage      https://github.com/maboloshi/UserScripts/blob/master/Github_Tab_Size_4_Spaces.user.js
// @match         https://github.com/*/*
// @match         https://gist.github.com/*/*
// @match         https://raw.githubusercontent.com/*/*
// @run-at        document-start
// ==/UserScript==
//基于https://github.com/sindresorhus/tab-size-on-github
(function() {var css = [
	".tab-size[data-tab-size='2'],",
	".tab-size[data-tab-size='4'],",
	".tab-size[data-tab-size='8'],",
	".inline-review-comment,",
	".gist table.lines,",
	"table.diff-table,",
	".markdown-body pre,",
	"body > pre {",
	"	tab-size: 4 !important;",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
