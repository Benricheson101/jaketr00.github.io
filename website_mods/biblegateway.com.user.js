// ==UserScript==
// @name         Auto Capitalize Text/More
// @version      1.0.1
// @description  Auto capitalize/More text in search field
// @author       Jake Rosch
// @include      *biblegateway.com/*
// @grant        none
// @downloadURL  http://jaketr00.github.io/website_mods/biblegateway.com.user.js
// @updateURL    http://jaketr00.github.io/website_mods/biblegateway.com.user.js
// ==/UserScript==

(function() {
    var shortcut = {};
    addEventListener('load', function() {

        function doGetCaretPosition(oField) {

            // Initialize
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // To get cursor position, get empty selection range
                var oSel = document.selection.createRange();

                // Move selection start to 0 position
                oSel.moveStart('character', -oField.value.length);

                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            // Return results
            return iCaretPos;
        }

        function setCaretPosition(elem, caretPos) {

            if (elem !== null) {
                if(elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                }
                else {
                    if(elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    }
                    else
                        elem.focus();
                }
            }
        }

        function setVal(e) {
            setTimeout(function() {

                var pos = doGetCaretPosition(document.querySelector('#quicksearch-field'));

                var value = document.querySelector('#quicksearch-field').value.replace(/[\s ]\w|^\w/g, function(char) {
                    return char.toUpperCase();
                });

                if (value.match(/\d+([: ]\d+)([\- ]\d+){0,1}/)) {

                    var match = value.match(/\d+([: ]\d+)([\- ]\d+){0,1}/g),
                        allReplaces = [];

                    for (var a = 0; match.length > a; a++) {

                        var numbers = match[a].replace(/:{2,}/g, ':').replace(/-{2,}/, '-').replace(/ {2,}/, ' ').split(/ |-|:|, |,/),
                        numbersJoined = '';

                        for (var i = 0; numbers.length > i; i++) {
                            if (i === 1)
                                numbersJoined+= ':';
                            else if (i === 2)
                                numbersJoined+= '-';
                            numbersJoined+= numbers[i];
                        }

                        allReplaces.push(numbersJoined);

                    }

                    var num = 0;
                    value = value.replace(/\d+([: ]\d+)([\- ]\d+){0,1}/g, function() {

                        num++;

                        return allReplaces[num-1];

                    });

                }

                //value = value.replace(/\d [\d\w]/g, function(c) {
                value = value.replace(/[\w\d][ \-:]\d [\w\d]/g, function(c) {

                    if (e.keyCode === 32)
                        pos++;
                    var cs = c.split(' '),
                        cj = '';
                    for (var i = 0; cs.length > i; i++) {
                        if (i === 0)
                            cj+= cs[i];
                        else if (i === cs.length-1)
                            cj+= ', '+cs[i];
                        else
                            cj+= ' '+cs[i];
                    }

                    return cj;

                });

                if (e && (e === 'alreadyVals' || e.type === 'paste' || e.keyCode === 32))
                    value = value.replace(/\w+/g, function(chars) {
                        var charsLow = chars.toLowerCase();
                        if (shortcut['_'+charsLow]) {
                            pos+= shortcut['_'+charsLow].length - charsLow.length;
                            return shortcut['_'+charsLow];
                        }
                        return chars;
                    });

                document.querySelector('#quicksearch-field').value = value;

                setCaretPosition(document.querySelector('#quicksearch-field'), pos);

            }, 1);
        }

        document.querySelector('#quicksearch-field').addEventListener('keypress', setVal);
        document.querySelector('#quicksearch-field').addEventListener('paste', setVal);

        if (document.querySelector('#quicksearch-field').value)
            setVal('alreadyVals');

    });
})();