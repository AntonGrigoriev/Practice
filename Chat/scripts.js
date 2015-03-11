var place;
var server;
var mesbox;
var isShift;

function run() {
    isShift = false;
    place = null;
    server = true;
    mesbox = document.getElementsByClassName('messageslist')[0];
    sendSysMes('Server connected');
    var appContainer = document.getElementsByClassName('wrapper')[0];
    appContainer.addEventListener('click', delegateEvent);
    var textarea = document.getElementById('todoMes');
    textarea.addEventListener('keydown', onTextClick);
    textarea.addEventListener('keyup', onTextUnClick);
}

function delegateEvent(evtObj) {
    if (server === true) {
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
        clientOff(evtObj);
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

function clientOff() {
    var infobar = document.getElementsByClassName('infobar1')[0];
    document.getElementsByClassName('msg')[0].disabled = server;
    document.getElementsByClassName('login-form')[0].disabled = server;
    infobar.removeChild(infobar.firstChild);
    if (server === true) {
        infobar.appendChild(document.createTextNode('Server: OFF'));
        sendSysMes('Server disconnected');
    } else {
        infobar.appendChild(document.createTextNode('Server: ON'));
        sendSysMes('Server connected');
        document.getElementById('todoMes').focus();
    }
    server = !server;
    mesbox.scrollTop = mesbox.scrollHeight;
}

function editMessage() {
    var text = document.getElementById('todoMes');
    if (text.value !== '') {
        place.value = text.value;
    }
    text.value = '';
    place.classList.remove('sys');
    text.focus();
    resizeMessages();
    if (place.parentNode === mesbox.lastChild) {
        mesbox.scrollTop = mesbox.scrollHeight;
    }
    place = null;
}

function deleteMes(evtObj) {
    var pl = evtObj.target.parentNode.parentNode.parentNode.parentNode.childNodes[1];
    if (pl === place) {
        document.getElementById('todoMes').value = '';
        place = null;
    }
    var mes = evtObj.target.parentNode.parentNode.parentNode.parentNode;
    mes.removeChild(mes.childNodes[0]);
    mes.removeChild(mes.childNodes[0]);
    var txt = document.createTextNode('Deleted');
    mes.appendChild(txt);
    mes.classList.add('sys');
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
    document.getElementById('login').value = document.getElementsByClassName('login')[0].firstChild.nodeValue;
    document.getElementById('login').focus();
}

function onSaveButtonClick() {
    var logIn = document.getElementById('login');
    if (!logIn.value) {
        return;
    }
    var login = document.getElementsByClassName('login')[0];
    if (login.firstChild.nodeValue !== logIn.value) {
        sendSysMes(login.firstChild.nodeValue + " change name to " + logIn.value);
        login.removeChild(login.childNodes[0]);
        login.appendChild(document.createTextNode(logIn.value));
    }
    logIn.value = '';
    logIn.focus();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function onSendButtonClick() {
    var todoText = document.getElementById('todoMes');
    if (!todoText.value) {
        return;
    }
    var item = createItem(todoText.value);
    mesbox.appendChild(item);
    todoText.value = '';
    todoText.focus();
    resizeMessages();
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(text) {
    var message = document.createElement('div');
    var table = document.createElement('table');
    var row = document.createElement('tr');
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
    var cell2 = document.createElement('td');
    cell2.classList.add('ntd');
    var login = document.getElementsByClassName('login')[0];
    cell2.appendChild(document.createTextNode(login.firstChild.nodeValue + ": "));
    var txt = document.createElement('textarea');
    txt.value = text;
    txt.classList.add('mes');
    txt.readOnly = true;
    row.appendChild(cell);
    row.appendChild(cell1);
    row.appendChild(cell2);
    table.appendChild(row);
    message.appendChild(table);
    message.appendChild(txt);
    return message;
}

function sendSysMes(text) {
    var mes = document.createElement('div');
    var txt = document.createTextNode(text);
    mes.classList.add('system');
    mes.appendChild(txt);
    mesbox.appendChild(mes);
}