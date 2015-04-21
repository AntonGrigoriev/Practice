var place;
var server;
var mesbox;
var isShift;
var Login;
var clientId;
var Id = function () {
    var date = new Date().getTime();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
};
var mStruct = function (name, text, time, id, cId, info) {
    return {
        cId: cId,
        id: id,
        time: time,
        name: name,
        message: text,
        info: info
    };
};
var mainUrl = 'http://localhost:999/chat';
var messagesList = [];
var token = 'TE11EN';

function run() {
    clientId = Id();
    Login = document.getElementsByClassName('login')[0];
    Login.value = localStorage.getItem('login');
    if (Login.value === '') {
        Login.value = 'User';
    }
    isShift = false;
    place = null;
    server = true;
    document.getElementsByClassName('infobar1')[0].value = 'Server: ON';
    mesbox = document.getElementsByClassName('messageslist')[0];
    var appContainer = document.getElementsByClassName('wrapper')[0];
    var messageForm = document.getElementById('todoMes');
    var loginForm = document.getElementById('login');
    appContainer.addEventListener('click', delegateEvent);
    messageForm.addEventListener('keydown', onKeyClick);
    messageForm.addEventListener('keyup', onKeyUnClick);
    loginForm.addEventListener('keydown', saveLogin);

    clientSwitch(true);
    restoreHistory();
}

function delegateEvent(evtObj) {
    if (server) {
        if (evtObj.type === 'click' && evtObj.target.classList.contains('sender') && place === null) {
            sendMessage(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('sender') && place !== null) {
            changeMessage(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('lsavebut')) {
            saveLogin(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('leditbut')) {
            editLogin(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('delete')) {
            deleteMessage(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('edit')) {
            editMessage(evtObj);
        }
    }
}

function resizeMessages() {
    var arr = document.getElementsByClassName('mes');
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i].style.height = '0px';
        arr[i].style.height = arr[i].scrollHeight + 'px';
    }
}

function onKeyClick(evtObj) {
    if (evtObj.keyCode === 13) {
        if (!isShift) {
            if (place === null) {
                sendMessage(evtObj);
            } else {
                changeMessage(evtObj);
            }
        } else {
            if (document.getElementById('todoMes').value !== '') {
                document.getElementById('todoMes').value = document.getElementById('todoMes').value + '\r\n';
            }
            document.getElementById('todoMes').scrollTop = document.getElementById('todoMes').scrollHeight;
        }
        evtObj.preventDefault();
    }
    if (evtObj.keyCode === 16) {
        isShift = true;
    }
}

function onKeyUnClick(evtObj) {
    if (evtObj.keyCode === 16) {
        isShift = false;
    }
}

function clientSwitch(isFirst) {
    infobar = document.getElementsByClassName('infobar1')[0];
    document.getElementsByClassName('msg')[0].disabled = server;
    document.getElementsByClassName('login-form')[0].disabled = server;
    if (server) {
        infobar.value = 'Server: OFF';
        if (!isFirst)
            sendSysMes('Server disconnected', true);
    } else {
        infobar.value = 'Server: ON';
        if (!isFirst)
            sendSysMes('Server connected', true);
        document.getElementById('todoMes').focus();
    }
    server = !server;
    mesbox.scrollTop = mesbox.scrollHeight;
}

function changeMessage(evtObj, Id, Message, Info) {
    var id;
    var info;
    var message;
    if (evtObj !== null) {
        var text = document.getElementById('todoMes');
        message = normalizeText(text.value);
        if (message === place.value) {
            message = '';
        }
        if (message !== '' && message !== place.value) {
            info = '<edited at ' + getCorrectTime() + '>';
            place.value = message;
            place.parentNode.firstChild.firstChild.childNodes[4].firstChild.value = info;
            id = place.attributes['message-id'].value;
            var msg = mStruct('', message, '', id, clientId, info);
            post(mainUrl, msg);
        }
        text.value = '';
        place.classList.remove('sys');
        text.focus();
        place = null;
    } else {
        id = Id;
        message = Message;
        info = Info;
        var mes;
        var messages = document.getElementsByClassName('message');
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].childNodes.length === 2 && messages[i].childNodes[1].attributes['message-id'].value === id) {
                mes = messages[i];
                break;
            }
        }
        mes.firstChild.firstChild.childNodes[2].firstChild.value = info;
        mes.childNodes[1].value = message;
    }
    if (message !== '') {
        for (var i = 0; i < messagesList.length; i++) {
            if (messagesList[i].id === id) {
                messagesList[i].message = message;
                messagesList[i].info = info;
                break;
            }
        }
    }
    resizeMessages();
}

function deleteMessage(evtObj, Id, Info) {
    var id;
    var info;
    var mes;
    if (evtObj !== null) {
        mes = evtObj.target.parentNode.parentNode.parentNode.parentNode;
        id = mes.childNodes[1].attributes['message-id'].value;
        info = '<deleted at ' + getCorrectTime() + '>';
        var msg = mStruct('', '', '', id, clientId, info);
        post(mainUrl, msg);
        if (mes.childNodes[1] === place) {
            document.getElementById('todoMes').value = '';
            place = null;
        }
        mes.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild);
        mes.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild);
        document.getElementById('todoMes').focus();
    } else {
        info = Info;
        id = Id;
        var messages = document.getElementsByClassName('message');
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].childNodes.length === 2 && messages[i].childNodes[1].attributes['message-id'].value === id) {
                mes = messages[i];
                break;
            }
        }
    }
    mes.removeChild(mes.childNodes[1]);
    mes.firstChild.firstChild.childNodes[2].firstChild.value = info;
    for (var i = 0; i < messagesList.length; i++) {
        if (messagesList[i].id === id) {
            messagesList[i].message = '';
            messagesList[i].info = info;
            break;
        }
    }
}

function editMessage(evtObj) {
    if (place !== null) {
        place.classList.remove('sys');
    }
    var mes = evtObj.target.parentNode.parentNode.parentNode.parentNode.childNodes[1];
    if (mes !== place) {
        mes.classList.add('sys');
        document.getElementById('todoMes').value = mes.value;
        place = mes;
    } else {
        document.getElementById('todoMes').value = '';
        mes.classList.remove('sys');
        place = null;
    }
    document.getElementById('todoMes').focus();
}

function editLogin() {
    document.getElementById('login').value = Login.value;
    document.getElementById('login').focus();
}

function saveLogin(evtObj) {
    if (evtObj.keyCode === 13 || evtObj.keyCode === 0) {
        var logIn = document.getElementById('login');
        if (!logIn.value) {
            return;
        }
        if (Login.value !== logIn.value) {
            sendSysMes(Login.value + " change name to " + logIn.value);
            Login.value = logIn.value;
        }
        logIn.value = '';
        mesbox.scrollTop = mesbox.scrollHeight;
    }
    localStorage.setItem('login', Login.value);
}

function sendMessage() {
    var todoText = document.getElementById('todoMes');
    if (!todoText.value) {
        return;
    }
    var item = createItem(true, clientId, Id(), getCorrectTime(), Login.value, todoText.value, '');
    mesbox.appendChild(item);
    todoText.value = '';
    todoText.focus();
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(isMine, cId, id, time, name, text, info) {
    var message = document.createElement('div');
    message.classList.add('message');
    var table = document.createElement('table');
    var row = document.createElement('tr');
    if (cId === clientId) {
        var editCell = document.createElement('td');
        editCell.classList.add('itd');
        var ic1 = document.createElement('img');
        ic1.src = 'img/pencil.png';
        ic1.classList.add('edit');
        var deleteCell = document.createElement('td');
        deleteCell.classList.add('itd');
        var ic2 = document.createElement('img');
        ic2.src = 'img/trashcan.png';
        ic2.classList.add('delete');
        deleteCell.appendChild(ic1);
        editCell.appendChild(ic2);
        row.appendChild(deleteCell);
        row.appendChild(editCell);
    }
    if (time !== '') {
        var timeCell = document.createElement('td');
        timeCell.classList.add('time');
        timeCell.appendChild(document.createTextNode(time));
        row.appendChild(timeCell);
    }
    var nameCell = document.createElement('td');
    nameCell.classList.add('ntd');
    nameCell.appendChild(document.createTextNode(name + ": "));
    row.appendChild(nameCell);
    var infoCell = document.createElement('td');
    infoCell.appendChild(document.createElement('textarea'));
    infoCell.firstChild.classList.add('minfo');
    infoCell.firstChild.value = info;
    infoCell.firstChild.readOnly = true;
    row.appendChild(infoCell);
    table.appendChild(row);
    message.appendChild(table);
    var msg = mStruct(name, normalizeText(text), time, id, cId, info);
    messagesList.push(msg);
    if (isMine) {
        post(mainUrl, msg);
    }
    if (text !== '') {
        var txt = document.createElement('textarea');
        txt.value = text;
        txt.classList.add('mes');
        txt.readOnly = true;
        txt.setAttribute('message-id', msg.id);
        message.appendChild(txt);
    }
    return message;
}

function normalizeText(text) {
    while (text !== text.replace("\\n", "\n")) {
        text = text.replace("\\n", "\n");
    }
    var arr = text.split('\n');
    text = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== '') {
            text += '\n' + arr[i];
        }
    }
    return text;
}

function sendSysMes(text, isMine) {
    var mes = document.createElement('div');
    var txt = document.createTextNode(text);
    mes.classList.add('system');
    mes.appendChild(txt);
    mesbox.appendChild(mes);
    var msg = mStruct('', text, '', '', clientId, 'system');
    messagesList.push(msg);
    if (!isMine) {
        post(mainUrl, msg);
    }
}

function getCorrectTime() {
    var date = new Date();
    var time = addZero(date.getHours()) + ":" +
            addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
    return time;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function restoreHistory() {
    var url = mainUrl + '?token=' + token;
    get(url, function (responseText) {
        if (!server) {
            clientSwitch();
        }
        var response = JSON.parse(responseText);
        token = response.token;
        addMessages(response.messages, true);
        setTimeout(listenMessages, 1000);
    }, function (error) {
        if (server) {
            clientSwitch();
        }
        defaultErrorHandler(error);
        setTimeout(listenMessages, 1000);
    });
}

function listenMessages() {
    function loop() {
        var url = mainUrl + '?token=' + token;
        get(url, function (responseText) {
            if (!server) {
                clientSwitch();
            }
            var response = JSON.parse(responseText);
            token = response.token;
            addMessages(response.messages, false);
            setTimeout(loop, 1000);
        }, function (error) {
            if (server) {
                clientSwitch();
            }
            defaultErrorHandler(error);
            setTimeout(loop, 1000);
        });
    }

    loop();
}

function get(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
    while (data.message !== data.message.replace("\n", "\\n")) {
        data.message = data.message.replace("\n", "\\n");
    }
    ajax('POST', url, JSON.stringify(data), continueWith, continueWithError);
}

function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();
    continueWith = continueWith || function () {
    };
    continueWithError = continueWithError || defaultErrorHandler;
    xhr.open(method || 'GET', url, true);
    xhr.onload = function () {
        if (xhr.readyState !== 4)
            return;
        if (xhr.status !== 200) {
            continueWithError('Error on the server side, response ' + xhr.status);
            return;
        }

        if (isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            return;
        }

        continueWith(xhr.responseText);
    };
    xhr.ontimeout = function () {
        continueWithError('Server timed out!');
    };
    xhr.onerror = function (e) {
        continueWithError('Server disconnected');
    };
    xhr.send(data);
}

function defaultErrorHandler(message) {
    console.log("Error: " + message);
}

function addMessages(messages, isHistory) {
    if (messages.length !== 0) {
        for (var i = 0; i < messages.length; i++)
            pushMessage(messages[i], isHistory);
        if (isHistory)
            mesbox.appendChild(document.createElement('hr'));
    }
}

function pushMessage(mes, isHistory) {
    mes.message = normalizeText(mes.message);
    if (mes.clientId !== clientId) {
        if (mes.name === '' && mes.info !== 'system') {
            if (mes.message === '') {
                deleteMessage(null, mes.id, mes.info);
            } else {
                changeMessage(null, mes.id, mes.message, mes.info);
            }
        } else {
            if (mes.info !== 'system') {
                var item = createItem(false, mes.clientId, mes.id, mes.time, mes.name, mes.message, mes.info);
                if (isHistory)
                    item.childNodes[1].classList.add('sys');
                mesbox.appendChild(item);
            }
            if (mes.info === 'system') {
                sendSysMes(mes.message, true);
            }
        }
    }
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function isError(text) {
    if (text == "")
        return false;
    try {
        var obj = JSON.parse(text);
    } catch (ex) {
        return true;
    }
    return !!obj.error;
}

window.onerror = function (err) {
    defaultErrorHandler(err.toString());
};