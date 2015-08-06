/**
 * 
 */

"use strict";

var MarkdownIt = require('markdown-it');
var _ = require('lodash');
var config = require('../config');
var validator = require('validator');
var jxsxx = require('xss');

// set default optioins
var md = new MarkdownIt();

md.set({
	html:        true, // enable HTML tags in source
	xHtmlOut:    true, //user '/' to close single tags (<br />)
	breaks:      true, // convert '\n' in paragraphs into <br>
	linkify:     true, //autoconvert URL-like text to links
	typographer: true, //enable smartypants and other sweet transforms
});

md.renderer.rules.fence = function (tokens, idx) {
	var token = tokens[idx];
	var language = token.params && ('language-' + token.params) || '';
	language = validator.escape(language);
	
	return '<pre class="prettyprint' + language + '">'
	  + '<code>' + validator.escape(token.content) + '</code>'
	  + '</pre>';
};

md.renderer.rules.code_block = function (tokens, idx) {
	var token = tokens[idx];
	var language = tokens.params && ('language-' + token.params) || '';
	language = validator.escape(language);
	
	return '<pre class="prettyprint' + language + '">'
	  + '<code>' + validator.escape(token.content) + '</code>'
	  + '</pre>';
};

md.renderer.code_inline = function (tokens, idx) {
	return '<code>' + validator.escape(tokens[idx]) + '</code>';
};

var  myxss = new jxsxx.FilterXSS({
	onIgnoreAttr: function (tag, name, value, isWhiteAttr) {
	  //让 prettyprint 可以工作
	  if (tag === 'pre' && name === 'class') {
		  return name + '="' + jsxss.escapeAttrValue(value) + '"';
	  }
	}
});

exports.markdown = function (text) {
	return '<div class="markdown-text">' + myxss.process(md.render(text || ''));
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