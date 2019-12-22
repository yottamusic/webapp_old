/** WiFi & Miscellaneous Configuration JS */


// Get SSID List
function getSSIDList() {
    var url = "/cgi-bin/getSSIDList.cgi";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    var SSIDList = xmlHttp.responseText;
    return SSIDList.split(',');
}

// Render SSID Dropdown Selection
function renderSSIDDropDownList() {
    $('#ssid-list-container').html(function () {
        $('#ssid-list-base > label').text('Select SSID');

        $('#ssid-list-base > input').removeAttr('disabled');

        var list = '';
        var listArray = getSSIDList();
        for (var i = 0; i < listArray.length; i++) {
            list += '<li>' + listArray[i] + '</li>';
        }
        if ('' != list) return list;
    });
}

function httpGET(url) {
    console.log("API Query");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true); // false: wait respond
    xmlHttp.send(null);
    return url + " " + xmlHttp.responseText;
}

function saveWiFiSettings() {
    var url = "/cgi-bin/saveWiFiConfig.cgi?" + document.getElementById('username').value + ";" + document.getElementById('password').value;
    document.getElementById('info-div').innerHTML = httpGET(url);
}

function saveBTSettings() {
    var url = "/cgi-bin/saveBTConfig.cgi";
    document.getElementById('info-div').innerHTML = "BT Paired" + httpGET(url);
}

function restartRenderer() {
    var url = "/cgi-bin/restartRenderer.cgi";
    document.getElementById('info-div').innerHTML = "Restart Renderer" + httpGET(url);
}

function rescanDrives() {
    var url = "/cgi-bin/rescanDrives.cgi";
    document.getElementById('info-div').innerHTML = "Rescan Drives" + httpGET(url);
}

function updateTextBox() {
    var select = document.getElementById("selectWifi");
    if (select.options.length > 0 || select.options[select.selectedIndex].value == 0) {
        console.log("Text: " + select.options[select.selectedIndex].text + "\nValue: " + select.options[select.selectedIndex].value);
        document.getElementById("username").value = select.options[select.selectedIndex].text;
    } else if (select.options.length < 0) {
        window.alert("Select box is empty");
    }
}