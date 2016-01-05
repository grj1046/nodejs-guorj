/*based on browser, don't use it in nodejs*/
(function(){
	'use strict';
	
	window.jstools = {
		/*
		* 在新窗口POST
		* action: form的action属性，要post的地址(url)
		* data: form中的数据，数据格式为 [{name: "", value: ""}, {name: "", value: ""}]
		* data的值可以使用jQuery的方法 $("#form1").serializeArray()获得。
		*/
		openInNewWindow: function(action, data){
			var _doc = document;
			var _form = _doc.createElement("form");
			_form.method = "POST";
			_form.target = "_blank";
			_form.action = action;
            
			data = data || {};
			data.forEach(function(element) {
				var _input = _doc.createElement("input");
				_input.type = "hidden";
				_input.name = element.name;
				_input.value = element.value;
				_form.appendChild(_input);
			});
			_doc.body.appendChild(_form);
			_form.submit();
			_doc.body.removeChild(_form);
		}
	};
})();