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
var mStruct = function (name, text, isSys, info) {
    return {
        name: name,
        message: text,
        id: Id(),
        isSys: isSys,
        info: info
    };
};
var mlist = [];

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
    var textarea = document.getElementById('todoMes');
    textarea.addEventListener('keydown', onTextClick);
    textarea.addEventListener('keyup', onTextUnClick);
    var login = document.getElementById('login');
    login.addEventListener('keydown', onSaveButtonClick);
}

function writeHistory(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].isSys) {
            sendSysMes(list[i].message);
        } else {
            var userMsg = createItem(list[i].message, list[i].name, false, list[i].info);
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
            onSendButtonClick(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('sender') && place !== null) {
            editMessage(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('lsavebut')) {
            onSaveButtonClick(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('leditbut')) {
            onEditButtonClick(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('delete')) {
            deleteMes(evtObj);
        }
        if (evtObj.type === 'click' && evtObj.target.classList.contains('edit')) {
            editMes(evtObj);
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

function onTextClick(evtObj) {
    if (evtObj.keyCode === 13) {
        if (!isShift) {
            if (place === null) {
                onSendButtonClick(evtObj);
            } else {
                editMessage(evtObj);
            }
            evtObj.preventDefault();
        } else {
            if (document.getElementById('todoMes').value !== '') {
                document.getElementById('todoMes').value = document.getElementById('todoMes').value + '\r\n';
            }
            document.getElementById('todoMes').scrollTop = document.getElementById('todoMes').scrollHeight;
            evtObj.preventDefault();
        }
    }
    if (evtObj.keyCode === 16) {
        isShift = true;
    }
}

function onTextUnClick(evtObj) {
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

function editMessage() {
    var text = document.getElementById('todoMes');
    if (text.value !== '' && text.value !== place.value) {
        place.value = text.value;
        place.parentNode.firstChild.firstChild.childNodes[3].firstChild.value = '<edited>';
        var id = place.attributes['message-id'].value;
        for (var i = 0; i < mlist.length; i++) {
            if (mlist[i].id === id) {
                mlist[i].message = place.value;
                mlist[i].info = '<edited>';
                store(mlist);
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

function deleteMes(evtObj) {
    var mes = evtObj.target.parentNode.parentNode.parentNode.parentNode;
    var id = mes.childNodes[1].attributes['message-id'].value;
    for (var i = 0; i < mlist.length; i++) {
        if (mlist[i].id === id) {
            mlist[i].message = '';
            mlist[i].info = '<deleted>';
            store(mlist);
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
    mes.firstChild.firstChild.childNodes[1].firstChild.value = '<deleted>';
    document.getElementById('todoMes').focus();
}

function editMes(evtObj) {
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

function onEditButtonClick() {
    document.getElementById('login').value = Login.value;
    document.getElementById('login').focus();
}

function onSaveButtonClick(evtObj) {
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
        logIn.focus();
        mesbox.scrollTop = mesbox.scrollHeight;
    }
    localStorage.setItem('login', Login.value);
}

function onSendButtonClick() {
    var todoText = document.getElementById('todoMes');
    if (!todoText.value) {
        return;
    }
    var item = createItem(todoText.value, Login.value, true, '');
    mesbox.appendChild(item);
    todoText.value = '';
    todoText.focus();
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(text, name, isMine, info) {
    var msg = mStruct(name, text, false, info);
    mlist.push(msg);
    store(mlist);
    var message = document.createElement('div');
    var table = document.createElement('table');
    var row = document.createElement('tr');
    if (isMine) {
        var cell1 = document.createElement('td');
        cell1.classList.add('itd');
        var ic1 = document.createElement('img');
        ic1.src = 'img/pencil.png';
        ic1.classList.add('edit');
        var cell = document.createElement('td');
        cell.classList.add('itd');
        var ic2 = document.createElement('img');
        ic2.src = 'img/trashcan.png';
        ic2.classList.add('delete');
        cell.appendChild(ic1);
        cell1.appendChild(ic2);
        row.appendChild(cell);
        row.appendChild(cell1);
    }
    var cell2 = document.createElement('td');
    cell2.classList.add('ntd');
    cell2.appendChild(document.createTextNode(name + ": "));
    row.appendChild(cell2);
    var cell0 = document.createElement('td');
    cell0.appendChild(document.createElement('textarea'));
    cell0.firstChild.classList.add('minfo');
    cell0.firstChild.value = info;
    cell0.firstChild.readOnly = true;
    row.appendChild(cell0);
    table.appendChild(row);
    message.appendChild(table);
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
    mlist.push(mStruct('', text, true));
    store(mlist);
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