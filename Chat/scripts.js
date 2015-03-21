var place;
var server;
var mesbox;
var isShift;
var Login;
var Id = function () {
    var date = new Date().getTime();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
};
var mStruct = function (name, text, time, isSys, info) {
    return {
        name: name,
        message: text,
        time: time,
        id: Id(),
        isSys: isSys,
        info: info
    };
};
var messagesList = [];

function run() {
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
    var history = restore();
    if (history !== null) {
        writeHistory(history);
    }
    var appContainer = document.getElementsByClassName('wrapper')[0];
    appContainer.addEventListener('click', delegateEvent);
    var messageForm = document.getElementById('todoMes');
    messageForm.addEventListener('keydown', onKeyClick);
    messageForm.addEventListener('keyup', onKeyUnClick);
    var loginForm = document.getElementById('login');
    loginForm.addEventListener('keydown', saveLogin);
}

function writeHistory(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].isSys) {
            sendSysMes(list[i].message);
        } else {
            var userMsg = createItem(false, list[i].time, list[i].name, list[i].message, list[i].info);
            userMsg.lastChild.classList.add('sys');
            mesbox.appendChild(userMsg);
        }
    }
    mesbox.appendChild(document.createElement('hr'));
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
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
    if (evtObj.type === 'click' && evtObj.target.classList.contains('infobar1')) {
        clientSwitch(evtObj);
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

function clientSwitch() {
    infobar = document.getElementsByClassName('infobar1')[0];
    document.getElementsByClassName('msg')[0].disabled = server;
    document.getElementsByClassName('login-form')[0].disabled = server;
    if (server) {
        infobar.value = 'Server: OFF';
        sendSysMes('Server disconnected');
    } else {
        infobar.value = 'Server: ON';
        sendSysMes('Server connected');
        document.getElementById('todoMes').focus();
    }
    server = !server;
    mesbox.scrollTop = mesbox.scrollHeight;
}

function changeMessage() {
    var text = document.getElementById('todoMes');
    if (text.value !== '' && text.value !== place.value) {
        var info = '<edited at ' + getCorrectTime() + '>';
        place.value = text.value;
        place.parentNode.firstChild.firstChild.childNodes[4].firstChild.value = info;
        var id = place.attributes['message-id'].value;
        for (var i = 0; i < messagesList.length; i++) {
            if (messagesList[i].id === id) {
                messagesList[i].message = place.value;
                messagesList[i].info = info;
                store(messagesList);
                break;
            }
        }
    }
    text.value = '';
    place.classList.remove('sys');
    text.focus();
    resizeMessages();
    place = null;
}

function deleteMessage(evtObj) {
    var mes = evtObj.target.parentNode.parentNode.parentNode.parentNode;
    var id = mes.childNodes[1].attributes['message-id'].value;
    var info = '<deleted at ' + getCorrectTime() + '>';
    for (var i = 0; i < messagesList.length; i++) {
        if (messagesList[i].id === id) {
            messagesList[i].message = '';
            messagesList[i].info = info;
            store(messagesList);
            break;
        }
    }
    if (mes.childNodes[1] === place) {
        document.getElementById('todoMes').value = '';
        place = null;
    }
    mes.removeChild(mes.childNodes[1]);
    mes.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild);
    mes.firstChild.firstChild.removeChild(mes.firstChild.firstChild.firstChild);
    mes.firstChild.firstChild.childNodes[2].firstChild.value = info;
    document.getElementById('todoMes').focus();
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
    var item = createItem(true, getCorrectTime(), Login.value, todoText.value, '');
    mesbox.appendChild(item);
    todoText.value = '';
    todoText.focus();
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(isMine, time, name, text, info) {
    var message = document.createElement('div');
    var table = document.createElement('table');
    var row = document.createElement('tr');
    if (isMine) {
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
    var msg = mStruct(name, text, time, false, info);
    messagesList.push(msg);
    store(messagesList);
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

function sendSysMes(text) {
    var mes = document.createElement('div');
    var txt = document.createTextNode(text);
    mes.classList.add('system');
    mes.appendChild(txt);
    mesbox.appendChild(mes);
    messagesList.push(mStruct('', text, '', true));
    store(messagesList);
}

function store(listToSave) {
    if (typeof (Storage) === "undefined") {
        alert('Something wrong...');
        return;
    }
    localStorage.setItem("Message history", JSON.stringify(listToSave));
}

function restore() {
    if (typeof (Storage) === "undefined") {
        alert('Something wrong...');
        return;
    }
    var item = localStorage.getItem("Message history");
    return item && JSON.parse(item);
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