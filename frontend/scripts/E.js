var E = {
    DIV: function () {
        return E_c('div');
    },
	SCRIPT:function(){
		return E_c('script');
	},
    IMG: function () { return E_c('img'); },
    CANVAS: function () { return E_c('canvas'); },
    TABLE: function () {
        return E_c('table');
    },
    THEAD: function () {
        return E_c('thead');
    },
    TBODY: function () {
        return E_c('tbody');
    },
    TFOOT: function () {
        return E_c('tfoot');
    },
    TR: function () {
        return E_c('tr');
    },
    TD: function () {
        return E_c('td');
    },
    TH: function () {
        return E_c('th');
    },
    H4: function () {
        return E_c('h4');
    },
    H3: function () {
        return E_c('h3');
    },
    H2: function () {
        return E_c('h2');
    },
    H1: function () {
        return E_c('h1');
    },
    UL: function () {
        return E_c('ul');
    },
    LI: function () {
        return E_c('li');
    },
    P: function () {
        return E_c('p');

    },
    VIDEO: function () {
        return E_c('video');
    },
    CHECKBOX: function () {
        return E_i('input', 'checkbox');
    },
    TEXT: function () {
        var a = E_i('input', 'text');
        (function (a) {
            var selectedIndexOnMouseDown;
            var selectedIndexOnKeyDown;
            a.addEventListener('keydown', function (e) {
                if (e.keyCode == '37') {
                    var newIndex = a.selectionStart - 1;
                    a.selectionStart = newIndex;
                    a.selectionEnd = newIndex;
                }
                else if (e.keyCode == '39') {
                    var newIndex = a.selectionStart + 1;
                    a.selectionStart = newIndex;
                    a.selectionEnd = newIndex;
                }
            });
            a.addEventListener('mousedown', function () {
                setTimeout(function () {
                    selectedIndexOnMouseDown = a.selectionStart;
                }, 0);
            });
            a.addEventListener('mouseup', function () {
                var selectionStart = a.selectionStart;
                if (selectedIndexOnMouseDown == selectionStart) {
                    a.select();
                    setTimeout(function () {
                        a.selectionStart = selectionStart;
                        a.selectionEnd = selectionStart;
                    }, 0);
                }
            });
        })(a);
        return a;
    },
    PASSWORD: function () {
        return E_i('input', 'password');
    },
    TEXTAREA: function () {
        return E_c('textarea');
    },
    SPAN: function () {
        return E_c('span');
    },
    SELECT: function () {
        return E_c('select');
    },
    OPTION: function () {
        return E_c('option');
    },
    COLGROUP: function () {
        return E_c('colgroup');
    },
    COL: function () {
        return E_c('col');
    },
    BUTTON: function () {
        return E_c('button');
    },
    A: function () {
        return E_c('a');
    },
    LABEL: function () {
        return E_c('label');
    },
	TEXT_NODE:function(str){
		return document.createTextNode(str);
	},
    FILE: function () {
        return E_i('input', 'file');
    }
};
function E_i(name, type) {
    var i = E_c(name);
    i['type'] = type;
    return i;
}
function E_c(name) {
    var element = document.createElement(name);
    if (!element.addEventListener)
        element.addEventListener = element.attachEvent;
    return element;
}