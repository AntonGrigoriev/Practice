var place = null;
var delPlace = null;
var server = true;
var isShift = false;
var clientId;
var mesbox;
var Login;
var textField;
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
    document.getElementsByClassName('infobar1')[0].value = 'Server: ON';
    Login = document.getElementsByClassName('login')[0];
    Login.value = localStorage.getItem('login');
    if (Login.value === '') {
        Login.value = 'User';
    }
    mesbox = document.getElementsByClassName('messageslist')[0];
    textField = document.getElementById('todoMes');
    var appContainer = document.getElementsByClassName('wrapper')[0];
    var loginForm = document.getElementById('login');

    appContainer.addEventListener('click', delegateEvent);
    textField.addEventListener('keydown', onKeyClick);
    textField.addEventListener('keyup', onKeyUnClick);
    loginForm.addEventListener('keydown', saveLogin);

    clientSwitch(true);
    restoreHistory();
}

function delegateEvent(evtObj) {
    if (server) {
        if (evtObj.type === 'click' && evtObj.target.classList.contains('sender')) {
            onSendButtonClick(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('lsavebut')) {
            saveLogin(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('leditbut')) {
            editLogin(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('delete')) {
            onDeleteButtonClick(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('edit')) {
            onEditButtonClick(evtObj);
        }
    }
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
            sendSystemMessage(Login.value + " change name to " + logIn.value, true);
            Login.value = logIn.value;
        }
        logIn.value = '';
        mesbox.scrollTop = mesbox.scrollHeight;
    }
    localStorage.setItem('login', Login.value);
}

function onSendButtonClick() {
    if (textField.value === '') {
        if (place !== null) {
            place.classList.remove('sys');
            place = null;
        }
        return;
    }
    var msg = mStruct(Login.value, normalizeText(textField.value), getCorrectTime(), Id(), clientId, '');
    if (place === null) {
        sendMessage(msg, true, false);
        messagesList.push(msg);
        doPost(mainUrl, msg);
    } else {
        msg.info = 'edit';
        msg.id = place.attributes['message-id'].value;
        changeMessage(msg, true);
        textField.value = '';
        textField.focus();
        place.classList.remove('sys');
        place = null;
        doPut(mainUrl, msg);
    }
    resizeMessages();
}

function sendMessage(msg, isMine, isHistory) {
    var item = createItem(msg, isMine);
    if (isHistory) {
        item.childNodes[1].classList.add('sys');
    }
    mesbox.appendChild(item);
    if (isMine) {
        textField.value = '';
        textField.focus();
    }
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(msg, isMine) {
    var message = document.createElement('div');
    message.classList.add('message');
    var string = '<table><tr>';
    if (isMine) {
        string += '<td class=\'itd\'><img src=\'img/pencil.png\' class=\'edit\'></td>';
        string += '<td class=\'itd\'><img src=\'img/trashcan.png\' class=\'delete\'></td>';
    }
    string += '<td class=\'time\'>' + msg.time + '</td>';
    string += '<td class=\'ntd\'>' + msg.name + ': </td>';
    string += '<td><textarea class=\'minfo\' readonly>' + msg.info + '</textarea></td></tr></table>';
    string += '<textarea class=\'mes\' message-id=\'' + msg.id + '\' readonly>' + msg.message + '</textarea>';
    message.innerHTML = string;
    return message;
}

function changeMessage(msg, isMine) {
    var mes;
    var index;
    if (isMine) {
        mes = place;
        index = 4;
    } else {
        var messages = document.getElementsByClassName('mes');
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].attributes['message-id'].value === msg.id) {
                mes = messages[i];
                break;
            }
        }
        index = 2;
    }
    if (msg.message !== mes.value) {
        var info = '<edited at ' + msg.time + '>';
        mes.value = msg.message;
        mes.parentNode.firstChild.firstChild.firstChild.childNodes[index].firstChild.value = info;
        for (var i = 0; i < messagesList.length; i++) {
            if (messagesList[i].id === msg.id) {
                messagesList[i].message = msg.message;
                messagesList[i].info = info;
                break;
            }
        }
    }
}

function onEditButtonClick(evtObj) {
    if (place !== null) {
        place.classList.remove('sys');
    }
    var mes = evtObj.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1];
    if (mes !== place) {
        mes.classList.add('sys');
        textField.value = mes.value;
        place = mes;
    } else {
        textField.value = '';
        mes.classList.remove('sys');
        place = null;
    }
    textField.focus();
}

function onDeleteButtonClick(evtObj) {
    delPlace = evtObj.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    var msg = mStruct(Login.value, '', getCorrectTime(), delPlace.childNodes[1].attributes['message-id'].value, clientId, 'delete');
    deleteMessage(msg, true);
    doDelete(mainUrl, msg);
}

function deleteMessage(msg, isMine) {
    var mes;
    if (isMine) {
        mes = delPlace;
    } else {
        var messages = document.getElementsByClassName('mes');
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].attributes['message-id'].value === msg.id) {
                mes = messages[i].parentNode;
                break;
            }
        }
    }
    var info = '<deleted at ' + msg.time + '>';
    if (isMine) {
        mes.firstChild.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild.firstChild);
        mes.firstChild.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild.firstChild);
        textField.focus();
    }
    mes.removeChild(mes.childNodes[1]);
    mes.firstChild.firstChild.firstChild.childNodes[2].firstChild.value = info;
    for (var i = 0; i < messagesList.length; i++) {
        if (messagesList[i].id === msg.id) {
            messagesList[i].message = '';
            messagesList[i].info = info;
            break;
        }
    }
}

function sendSystemMessage(text, toPost) {
    var mes = document.createElement('div');
    var txt = document.createTextNode(text);
    mes.classList.add('system');
    mes.appendChild(txt);
    mesbox.appendChild(mes);
    var msg = mStruct(Login.value, text, '', '', clientId, 'system');
    if (toPost) {
        doPost(mainUrl, msg);
    }
}

function clientSwitch(isStart) {
    infobar = document.getElementsByClassName('infobar1')[0];
    document.getElementsByClassName('msg')[0].disabled = server;
    document.getElementsByClassName('login-form')[0].disabled = server;
    if (server) {
        infobar.value = 'Server: OFF';
        if (!isStart)
            sendSystemMessage('Server disconnected', false);
    } else {
        infobar.value = 'Server: ON';
        if (!isStart)
            sendSystemMessage('Server connected', false);
        textField.focus();
    }
    server = !server;
    mesbox.scrollTop = mesbox.scrollHeight;
}

function onKeyClick(evtObj) {
    if (evtObj.keyCode === 13) {
        if (!isShift) {
            onSendButtonClick(evtObj);
        } else {
            if (textField.value !== '') {
                textField.value = textField.value + '\r\n';
            }
            textField.scrollTop = textField.scrollHeight;
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

function resizeMessages() {
    var arr = document.getElementsByClassName('mes');
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        arr[i].style.height = '0px';
        arr[i].style.height = arr[i].scrollHeight + 'px';
    }
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
    doGet(url, function (responseText) {
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
        doGet(url, function (responseText) {
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

function doGet(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}

function doPost(url, data, continueWith, continueWithError) {
    while (data.message !== data.message.replace("\n", "\\n")) {
        data.message = data.message.replace("\n", "\\n");
    }
    ajax('POST', url, JSON.stringify(data), continueWith, continueWithError);
}

function doPut(url, data, continueWith, continueWithError) {
    while (data.message !== data.message.replace("\n", "\\n")) {
        data.message = data.message.replace("\n", "\\n");
    }
    ajax('PUT', url, JSON.stringify(data), continueWith, continueWithError);
}

function doDelete(url, data, continueWith, continueWithError) {
    ajax('DELETE', url, JSON.stringify(data), continueWith, continueWithError);
}

function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();
    continueWith = continueWith || defaultContinueWith;
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

function defaultContinueWith(responseText){
    console.log(responseText);
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
        switch (mes.info) {
            case "edit":
                changeMessage(mes, false);
                break;
            case "delete":
                deleteMessage(mes, false);
                break;
            case "system":
                sendSystemMessage(mes.message, false);
                break;
            default:
                sendMessage(mes, false, isHistory);
                mesbox.scrollTop = mesbox.scrollHeight;
                break;
        }
        resizeMessages();
    }
}

function isError(text) {
    if (text === "")
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