 
var ClickMenu = new (function () {
	var OptionEntry=(function(){
		var _OptionEntry=function(params){
			EventEnabledBuilder(this);
			var self = this;
			var text = params.text;
			var tooltip = params.tooltip;
			var ui = new UI({text:text, tooltip:tooltip});
			this[S.GET_ELEMENT] = ui[S.GET_ELEMENT];
			ui[S.GET_ELEMENT]().addEventListener('click', click);
			function click(){
				params.callback();
				dispatchHide();
			}
			function dispatchHide(){
				self.dispatchEvent({type:'hide'});
			}
		};
		return _OptionEntry;
		function UI(params){
			var element = E.DIV();
			element.classList.add('option-entry');
			element.innerHTML = params.text;
			this[S.GET_ELEMENT] = function(){return element;};
		}
	})();
	var _ClickMenu= function(params){
		EventEnabledBuilder(this);
		var self = this;
		if(params.options)setOptions(params.options);
		var currentOptionEntries=[];
		var popup = new Popup();
		var element = popup[S.GET_ELEMENT]();
		document.body.appendChild(element);
		var ui = new UI({element:element});
		this.show = function(params){
			if(params.options){
				clearOptions();
				setOptions(params.options);
			}
			popup.show();
		};
		this.setPosition = popup.setPosition;
		function dispatchSelected(option){
			self.dispatchEvent({type:'selected', option:option});
		}
		function setOptions(options){
			each(options, function(option){
				var optionEntry=new OptionEntry(option);
				ui.addOptionEntry(optionEntry);
				optionEntry.addEventListener('hide', hide);
				currentOptionEntries.push(optionEntry);
			});
		}
		function clearOptions(){
			each(currentOptionEntries, function(optionEntry){
				ui.removeOptionEntry(optionEntry);
			});
			currentOptionEntries=[];
		}
		function hide(e){
			popup.hide();
		}
	};
	return _ClickMenu;
	function UI(params){
		var element = params.element;
		element.classList.add('click-menu');
		this.removeOptionEntry=function(optionEntry){
			element.removeChild(optionEntry[S.GET_ELEMENT]());
		};
		this.addOptionEntry=function(optionEntry){
			element.appendChild(optionEntry[S.GET_ELEMENT]());
		};
	}
})();