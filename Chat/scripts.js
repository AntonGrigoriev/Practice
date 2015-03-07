var place;
var server;
var mesbox;

function run() {
    place = null;
    server = true;
    mesbox = document.getElementsByClassName('messageslist')[0];
    mesbox.appendChild(createSysMes('Server connected'));
    var appContainer = document.getElementsByClassName('wrapper')[0];
    appContainer.addEventListener('click', delegateEvent);
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

function clientOff() {
    var infobar = document.getElementsByClassName('infobar1')[0];
    if (server === true) {
        mesbox.appendChild(createSysMes('Server disconnected'));
        mesbox.scrollTop = mesbox.scrollHeight;
        document.getElementsByClassName('msg')[0].disabled = true;
        document.getElementsByClassName('login-form')[0].disabled = true;
        infobar.removeChild(infobar.firstChild);
        infobar.appendChild(document.createTextNode('Server: OFF'));
        server = false;
    } else {
        mesbox.appendChild(createSysMes('Server connected'));
        mesbox.scrollTop = mesbox.scrollHeight;
        document.getElementsByClassName('msg')[0].disabled = false;
        document.getElementsByClassName('login-form')[0].disabled = false;
        infobar.removeChild(infobar.firstChild);
        infobar.appendChild(document.createTextNode('Server: ON'));
        server = true;
    }
}

function editMessage() {
    var text = document.getElementById('todoMes');
    if (text.value !== '') {
        place.removeChild(place.firstChild);
        place.appendChild(document.createTextNode(text.value));
    }
    text.value = '';
    place.classList.remove('sys');
    place = null;
}

function deleteMes(evtObj) {
    var mes = evtObj.target.parentNode.parentNode.parentNode;
    mes.removeChild(mes.firstChild);
    createDelMes(mes, 'Deleted');
}

function editMes(evtObj) {
    if (place !== null) {
        place.classList.remove('sys');
    }
    var mes = evtObj.target.parentNode.parentNode.childNodes[2];
    if (mes !== place) {
        mes.classList.add('sys');
        document.getElementById('todoMes').value = mes.firstChild.nodeValue;
        place = mes;
    } else {
        document.getElementById('todoMes').value = '';
        mes.classList.remove('sys');
        place = null;
    }
}

function createDelMes(evtObj, text) {
    var row = document.createElement('tr');
    var cell3 = document.createElement('td');
    cell3.classList.add('mtd');
    cell3.classList.add('sys');
    cell3.appendChild(document.createTextNode(text));
    row.appendChild(cell3);
    evtObj.appendChild(row);
}

function onEditButtonClick() {
    document.getElementById('login').value = document.getElementsByClassName('login')[0].firstChild.nodeValue;
}

function onSaveButtonClick() {
    var login = document.getElementById('login');
    addLogin(login.value);
    login.value = '';
}

function addLogin(value) {
    if (!value) {
        return;
    }
    var login = document.getElementsByClassName('login')[0];
    if (login.firstChild.nodeValue !== value) {
        var text = login.firstChild.nodeValue + " change name to " + value;
        mesbox.appendChild(createSysMes(text));
        mesbox.scrollTop = mesbox.scrollHeight;
        login.removeChild(login.childNodes[0]);
        login.appendChild(document.createTextNode(value));
    }
}

function onSendButtonClick() {
    var todoText = document.getElementById('todoMes');
    addTodo(todoText.value);
    todoText.value = '';
}

function addTodo(value) {
    if (!value) {
        return;
    }
    var item = createItem(value);
    mesbox.appendChild(item);
    mesbox.scrollTop = mesbox.scrollHeight;
}

function createItem(text) {
    var table = document.createElement('table');
    var row = document.createElement('tr');
    var cell1 = document.createElement('td');
    var ic1 = document.createElement('img');
    ic1.src='img/pencil.png';
    ic1.classList.add('edit');
    var ic2 = document.createElement('img');
    ic2.src='img/trashcan.png';
    ic2.classList.add('delete');
    cell1.appendChild(ic1);
    cell1.appendChild(ic2);
    var cell2 = document.createElement('td');
    cell2.classList.add('ntd');
    var login = document.getElementsByClassName('login')[0];
    cell2.appendChild(document.createTextNode(login.firstChild.nodeValue + ": "));
    var cell3 = document.createElement('td');
    cell3.classList.add('mtd');
    cell3.appendChild(document.createTextNode(text));
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    table.appendChild(row);
    return table;
}
function createSysMes(text) {
    var table = document.createElement('table');
    var row = document.createElement('tr');
    var cell3 = document.createElement('td');
    cell3.classList.add('mtd');
    cell3.classList.add('sys');
    cell3.appendChild(document.createTextNode(text));
    row.appendChild(cell3);
    table.appendChild(row);
    return table;
}