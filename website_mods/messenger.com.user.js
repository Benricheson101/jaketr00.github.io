// ==UserScript==
// @name         Client Nicknames
// @version      1.2.5
// @description  Client Nicknames for Facebook Messenger.  They do not sync with Facebook so the other person will not see these.
// @author       Jake Rosch
// @include      *messenger.com*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  http://jaketr00.github.io/website_mods/messenger.com.user.js
// @updateURL    http://jaketr00.github.io/website_mods/messenger.com.user.js

(function() {
    addEventListener('load', function() {

        var allNameInfo = JSON.parse(GM_getValue('nicknames', '{}')),
            originalNames = {},
            specialIds = {},
            classes = {
                presentation: '_54ni',
                seperator: '_54ak',
                hover: '_54ne'
            },
            syncURL = GM_getValue('syncURL', '');
        console.log(allNameInfo);

        function isValidJSON(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
        function setPopup(e) {
            if (e.target &&
                e.target.hasAttribute('aria-label')) {

                var popup;

                if (e.target.getAttribute('aria-label') === 'Conversation actions') {

                    var id = e.target.parentElement.parentElement.parentElement.getAttribute('aria-describedby').replace(/row_header_id_\w+:/, ''),
                        name = allNameInfo['_'+id] ? allNameInfo['_'+id] : {nickname: "", overrideOriginalName: false};
                    console.log(name);

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
                            presentation.innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (name.nickname ? name.nickname : '<i>No Nickname</i>') + '</span>' + presentationTemplate[2];
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
                                var newnick = prompt('Please enter a name', allNameInfo['_'+id] ? allNameInfo['_'+id].nickname : ''),
                                    override = confirm('Override Original Name?');

                                if (newnick) {

                                    if (!originalNames['_'+id]) {
                                        var name = (document.getElementById('row_header_id_user:'+id) || document.getElementById('row_header_id_thread:'+id)).querySelector('._1ht6');
                                        name = name.children && name.children[0] ? name.children[0].innerHTML : name.innerHTML;
                                        originalNames['_'+id] = name.replace(/<!--.*?-->/g, '');
                                    }

                                    if (!allNameInfo['_'+id])
                                        allNameInfo['_'+id] = {};
                                    allNameInfo['_'+id].nickname = newnick;
                                    allNameInfo['_'+id].overrideOriginalName = override;
                                    GM_setValue('nicknames', JSON.stringify(allNameInfo));

                                } else if (confirm('Are you sure you want to remove the nick?')) {

                                    delete allNameInfo['_'+id];
                                    GM_setValue('nicknames', JSON.stringify(allNameInfo));

                                    (document.getElementById('row_header_id_user:'+id) || document.getElementById('row_header_id_thread:'+id)).querySelector('._1ht6').innerHTML = originalNames['_'+id];

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

                                    delete allNameInfo['_'+id];
                                    GM_setValue('nicknames', JSON.stringify(allNameInfo));

                                    (document.getElementById('row_header_id_user:'+id) || document.getElementById('row_header_id_thread:'+id)).querySelector('._1ht6').innerHTML = originalNames['_'+id];

                                }
                            });

                        } else
                            popup.querySelector('#ClientNickname').innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (name.nickname ? name.nickname : '<i>No Nickname</i>') + '</span>' + presentationTemplate[2];

                    }

                } else if (e.target.getAttribute('aria-label') === 'Settings, privacy policy, help and more') {

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

                            var syncURLButton = document.createElement('li');
                            syncURLButton.setAttribute('class', classes.presentation);
                            syncURLButton.setAttribute('role', 'presentation');
                            syncURLButton.setAttribute('id', 'URL');
                            syncURLButton.innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (syncURL ? syncURL : '<i>No URL</i>') + '</span>' + presentationTemplate[2];
                            popup.querySelector('div > div > div > ul[role=menu]').appendChild(syncURLButton);

                            var exportButton = document.createElement('li');
                            exportButton.setAttribute('class', classes.presentation);
                            exportButton.setAttribute('role', 'presentation');
                            exportButton.innerHTML = presentationTemplate[1] + 'Export Nicknames' + presentationTemplate[2];
                            popup.querySelector('div > div > div > ul[role=menu]').appendChild(exportButton);

                            var importButton = document.createElement('li');
                            importButton.setAttribute('class', classes.presentation);
                            importButton.setAttribute('role', 'presentation');
                            importButton.innerHTML = presentationTemplate[1] + 'Import Nicknames' + presentationTemplate[2];
                            popup.querySelector('div > div > div > ul[role=menu]').appendChild(importButton);

                            syncURLButton.addEventListener('mouseover', function() {
                                syncURLButton.setAttribute('class', classes.presentation + ' ' + classes.hover + ' selected');
                            });
                            syncURLButton.addEventListener('mouseleave', function() {
                                syncURLButton.setAttribute('class', classes.presentation);
                            });
                            syncURLButton.addEventListener('click', function() {
                                alert('This is not set up yet, and does not work');
                                /*var newURL = prompt('Please enter a URL', syncURL ? syncURL : '');

                                if (newURL) {

                                    syncURL = newURL;
                                    GM_setValue('syncURL', syncURL);

                                }*/
                            });

                            exportButton.addEventListener('mouseover', function() {
                                exportButton.setAttribute('class', classes.presentation + ' ' + classes.hover + ' selected');
                            });
                            exportButton.addEventListener('mouseleave', function() {
                                exportButton.setAttribute('class', classes.presentation);
                            });
                            exportButton.addEventListener('click', function() {
                                open('data:text/json;base64,'+btoa(unescape(encodeURIComponent(JSON.stringify(allNameInfo)))));
                            });

                            importButton.addEventListener('mouseover', function() {
                                importButton.setAttribute('class', classes.presentation + ' ' + classes.hover + ' selected');
                            });
                            importButton.addEventListener('mouseleave', function() {
                                importButton.setAttribute('class', classes.presentation);
                            });
                            importButton.addEventListener('click', function() {
                                var imported = prompt('Please paste the JSON from the export'),
                                    merge = imported ? confirm('Merge or Replace? (OK = Merge, Cancel = Replace)') : null;

                                if (imported) {

                                    if (isValidJSON(imported)) {

                                        if (merge) {

                                            var JSONall = JSON.parse(imported),
                                                error = false;
                                            console.log(JSONall);
                                            for (var id in JSONall) {
                                                if (!error) {
                                                    if (typeof JSONall[id].nickname === 'string' && typeof JSONall[id].overrideOriginalName === 'boolean') {
                                                        allNameInfo[id] = JSONall[id];
                                                    } else {
                                                        error = true;
                                                        alert('Invalid JSON');
                                                    }
                                                }
                                            }
                                            if (!error)
                                                GM_setValue('nicknames', JSON.stringify(allNameInfo));

                                        } else {

                                            var oldNicks = allNameInfo;

                                            allNameInfo = JSON.parse(imported);
                                            GM_setValue('nicknames', JSON.stringify(allNameInfo));

                                            for (var oldid in oldNicks)
                                                if (!allNameInfo[oldid])
                                                    (document.getElementById('row_header_id_user:'+oldid.replace('_', '')) || document.getElementById('row_header_id_thread:'+oldid.replace('_', ''))).querySelector('._1ht6').innerHTML = originalNames[oldid];

                                        }

                                    } else
                                        alert('Invalid JSON');

                                }
                            });

                        } else
                            popup.querySelector('#URL').innerHTML = presentationTemplate[1] + 'Client Nickname <span style="font-size:11px">' + (syncURL ? syncURL : '<i>No URL</i>') + '</span>' + presentationTemplate[2];

                    }

                }

            }
        }

        var timestamps = {};
        function setNicks() {//doesn't remove, just adds. broken with import

            for (var thisid in allNameInfo) {
                thisid = thisid.replace('_', '');

                var elem = (document.getElementById('row_header_id_user:'+thisid) || document.getElementById('row_header_id_thread:'+thisid));

                if (elem) {
                    elem = elem.querySelector('._1ht6');

                    if (allNameInfo['_'+thisid].overrideOriginalName) {
                        elem.setAttribute('title', originalNames['_'+thisid]);
                        elem.innerHTML = allNameInfo['_'+thisid].nickname;
                    } else
                        elem.innerHTML = originalNames['_'+thisid] + '<i style="font-size:11px;margin-left:2px;">' + allNameInfo['_'+thisid].nickname + '</i>';
                }

            }

        }

        setInterval(function() {

            if (document.querySelector('._13aa'))
                setPopup({target: document.querySelector('._13aa [aria-label="Conversation actions"]')});

        }, 1000);
        document.addEventListener('click', setPopup);

        setInterval(setNicks, 1000);

        function getOriginalNames() {
            var numNicks = 0,
                doneNicks = 0;
            for (var checkid in allNameInfo) {
                numNicks++;

                var name = (document.getElementById('row_header_id_user:'+checkid.replace('_', '')) || document.getElementById('row_header_id_thread:'+checkid.replace('_', '')));
                if (name && !originalNames[checkid]) {
                    name = name.querySelector('._1ht6');
                    name = name.children && name.children[0] ? name.children[0].innerHTML : name.innerHTML;
                    originalNames[checkid] = name.replace(/<!--.*?-->/g, '');
                    var thisSpecId = (document.getElementById('row_header_id_user:'+checkid.replace('_', '')) || document.getElementById('row_header_id_thread:'+checkid.replace('_', ''))).querySelector('[data-href]').getAttribute('data-href').replace(/https:.*?\/t\//, '');
                    if (thisSpecId && thisSpecId !== checkid.replace('_', ''))
                        specialIds[checkid] = thisSpecId;
                    doneNicks++;
                }

            }
            if (doneNicks < numNicks)
                setTimeout(getOriginalNames, 1000);
        }
        getOriginalNames();
        console.log(originalNames);

    });
})();