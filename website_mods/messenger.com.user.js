// ==UserScript==
// @name         Client Nicknames
// @version      1.0
// @description  Client Nicknames for Facebook Messenger.  They do not sync with Facebook so the other person will not see these.
// @author       Jake Rosch
// @include      *messenger.com*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  http://jaketr00.github.io/website_mods/messenger.com.user.js
// @updateURL    http://jaketr00.github.io/website_mods/messenger.com.user.js
// ==/UserScript==

(function() {
    addEventListener('load', function() {

        var nicknames = JSON.parse(GM_getValue('nicknames', '{}')),
            overrideOriginalName = JSON.parse(GM_getValue('overrideOriginalName', '{}')),
            originalNames = {},
            classes = {
                presentation: '_54ni',
                seperator: '_54ak',
                hover: '_54ne'
            };

        function setPopup(e) {
            if (e.target &&
                e.target.hasAttribute('aria-label') &&
                e.target.getAttribute('aria-label') === 'Conversation actions') {

                var popup,
                    id = e.target.parentElement.parentElement.parentElement.getAttribute('aria-describedby').replace('row_header_id_user:', '');

                for (var i = 0; document.querySelectorAll('.uiContextualLayerPositioner.uiLayer').length > i; i++)
                    if (document.querySelectorAll('.uiContextualLayerPositioner.uiLayer')[i].getAttribute('class').split(' ').indexOf('hidden_elem') === -1)
                        popup = document.querySelectorAll('.uiContextualLayerPositioner.uiLayer')[i];

                if (popup) {

                    console.info(popup.querySelector('div > div > div > ul[role=menu]'));

                    var presentationTemplate = /^(<.*?>)[\w ]+(<\/.*?>)$/.exec(popup.querySelector('div > div > div > ul[role=menu] > *[role=presentation]').innerHTML);

                    if (!popup.querySelector('#ClientNickname')) {
                        var seperator = document.createElement('li');
                        seperator.setAttribute('class', classes.seperator);
                        seperator.setAttribute('role', 'seperator');
                        popup.querySelector('div > div > div > ul[role=menu]').appendChild(seperator);

                        var presentation = document.createElement('li');
                        presentation.setAttribute('class', classes.presentation);
                        presentation.setAttribute('role', 'presentation');
                        presentation.setAttribute('id', 'ClientNickname');
                        presentation.innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (nicknames['_'+id] ? nicknames['_'+id] : '<i>No Nickname</i>') + '</span>' + presentationTemplate[2];
                        popup.querySelector('div > div > div > ul[role=menu]').appendChild(presentation);

                        var clearNick = document.createElement('li');
                        clearNick.setAttribute('class', classes.presentation);
                        clearNick.setAttribute('role', 'presentation');
                        clearNick.setAttribute('id', 'ClientNickname');
                        clearNick.innerHTML = presentationTemplate[1] + 'Clear Nickname' + presentationTemplate[2];
                        popup.querySelector('div > div > div > ul[role=menu]').appendChild(clearNick);

                        presentation.addEventListener('mouseover', function() {
                            presentation.setAttribute('class', classes.presentation + ' ' + classes.hover + ' selected');
                        });
                        presentation.addEventListener('mouseleave', function() {
                            presentation.setAttribute('class', classes.presentation);
                        });
                        presentation.addEventListener('click', function() {
                            var newnick = prompt('Please enter a name', nicknames['_'+id] ? nicknames['_'+id] : ''),
                                override = confirm('Override Original Name?');

                            if (newnick) {

                                nicknames['_'+id] = newnick;
                                overrideOriginalName['_'+id] = override;
                                GM_setValue('nicknames', JSON.stringify(nicknames));
                                GM_setValue('overrideOriginalName', JSON.stringify(overrideOriginalName));

                                if (!originalNames['_'+id]) {
                                    var name = document.getElementById('row_header_id_user:'+id).querySelector('._1ht6');
                                    name = name.children && name.children[0] ? name.children[0].innerHTML : name.innerHTML;
                                    originalNames['_'+id] = name.replace(/<!--.*?-->/g, '');
                                }

                            }
                        });

                        clearNick.addEventListener('mouseover', function() {
                            clearNick.setAttribute('class', classes.presentation + ' ' + classes.hover + ' selected');
                        });
                        clearNick.addEventListener('mouseleave', function() {
                            clearNick.setAttribute('class', classes.presentation);
                        });
                        clearNick.addEventListener('click', function() {
                            if (confirm('Are you sure?')) {

                                delete nicknames['_'+id];
                                delete overrideOriginalName['_'+id];
                                GM_setValue('nicknames', JSON.stringify(nicknames));
                                GM_setValue('overrideOriginalName', JSON.stringify(overrideOriginalName));

                                document.getElementById('row_header_id_user:'+id).querySelector('._1ht6').innerHTML = originalNames['_'+id];

                            }
                        });

                    } else
                        popup.querySelector('#ClientNickname').innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (nicknames['_'+id] ? nicknames['_'+id] : '<i>No Nickname</i>') + '</span>' + presentationTemplate[2];

                }

            }
        }

        function setNicks() {

            for (var thisid in nicknames) {
                thisid = thisid.replace('_', '');

                var thisname;
                if (overrideOriginalName['_'+thisid])
                    thisname = nicknames['_'+thisid];
                else
                    thisname = originalNames['_'+thisid]+'<i style="font-size:11px;margin-left:2px;">'+nicknames['_'+thisid]+'</i>';

                document.getElementById('row_header_id_user:'+thisid).querySelector('._1ht6').innerHTML = thisname;

                /*if (location.pathname.replace('/t/', '') === thisid) {
                    document.querySelector('#js_6 ._3oh-').innerHTML = thisname;

                    if (overrideOriginalName['_'+thisid])
                        document.querySelector('#js_6 ._3oh-').setAttribute('title', originalNames['_'+thisid]);
                    else if (document.querySelector('#js_6 ._3oh-').hasAttribute('title'))
                        document.querySelector('#js_6 ._3oh-').removeAttribute('title');
                }*/

            }

        }

        setInterval(function() {

            if (document.querySelector('._13aa'))
                setPopup({target: document.querySelector('._13aa [aria-label="Conversation actions"]')});

        }, 1000);
        document.addEventListener('click', setPopup);

        setInterval(setNicks, 1000);

        for (var checkid in nicknames) {

            var name = document.getElementById('row_header_id_user:'+checkid.replace('_', '')).querySelector('._1ht6');
            name = name.children && name.children[0] ? name.children[0].innerHTML : name.innerHTML;
            originalNames[checkid] = name.replace(/<!--.*?-->/g, '');

        }
        console.log(originalNames)

    });
})();