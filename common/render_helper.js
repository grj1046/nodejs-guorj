/**
 * 
 */

"use strict";
//highlight.js styles (theme) https://highlightjs.org/static/demo/
var hljs = require('highlight.js');
var MarkdownIt = require('markdown-it');
var _ = require('lodash');
var config = require('../config');
var validator = require('validator');
//var jsxss = require('xss');

// set default optioins
//https://markdown-it.github.io/markdown-it.js
var md = MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }
        return str;
    }
});

md.set({
    //html: true, // enable HTML tags in source notice: must disable html tags
    xHtmlOut: true, //user '/' to close single tags (<br />)
    breaks: true, // convert '\n' in paragraphs into <br>
    linkify: false, //not autoconvert URL-like text to links
    typographer: true, //enable smartypants and other sweet transforms
});

md.renderer.rules.fence = function (tokens, idx, options) {
    var token = tokens[idx];
    var language = token.info || '';
    language = validator.escape(language);
    var highlighted;

    if (options.highlight) {
        highlighted = options.highlight(token.content, language) || token.content;
    } else {
        highlighted = token.content;
    }

    return '<pre class="hljs ' + language + '"><code>'
      + highlighted
      + '</code></pre>\n';
};

md.renderer.rules.code_block = function (tokens, idx) {
    var token = tokens[idx];
    var language = tokens.info || '';
    language = validator.escape(language);

    return '<pre class="hljs ' + language + '">'
      + '<code>' + validator.escape(token.content) + '</code>'
      + '</pre>';
};

md.renderer.code_inline = function (tokens, idx) {
    return '<code>' + validator.escape(tokens[idx]) + '</code>';
};
/*
var myxss = new jsxss.FilterXSS({
  onIgnoreAttr: function (tag, name, value, isWhiteAttr) {
    //让 prettyprint 可以工作
    if (tag === 'pre' && name === 'class') {
      return name + '="' + jsxss.escapeAttrValue(value) + '"';
    }
  }
});
*/
exports.markdown = function (text) {
    return '<div class="markdown-text">' + md.render(text || '') + '</div>';
};

exports.escapeSignature = function (signature) {
    return signature.split('\n').map(function (p) {
        return _.escape(p);
    }).join('<br />');
};

exports.staticFile = function (filePath) {
    if (filePath.indexOf('http') === 0 || filePath.indexOf('//') === 0) {
        return filePath;
    }
    return config.site_static_host + filePath;
};