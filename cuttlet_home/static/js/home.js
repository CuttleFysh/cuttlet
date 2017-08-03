var button_header_login = document.getElementById('button_header_login');
var overlay_login = document.getElementById('overlay_login');
var overlay_login_close = document.getElementById('overlay_login_close');

var header_is_live = document.getElementById('header_is_live');
var header_ml = document.getElementById('header_ml');

var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');

var button_start_array = document.getElementsByClassName('button_start');
var button_offline_array = document.getElementsByClassName('button_start_offline');

var label_cost_way = document.getElementsByClassName('label_cost_way');

if (button_header_login) {
    button_header_login.addEventListener('click', function () {
        overlay_login.style.display = 'block';
    }, false);
    overlay_login_close.addEventListener('click', function () {
        overlay_login.style.display = 'none';
    }, false);
}

if (button_login_twitch) button_login_twitch.addEventListener('click', loginTwitch, false);
if (button_login_youtube) button_login_youtube.addEventListener('click', loginYoutube, false);

function completeAndSubmitForm(params, form) {
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
}

function toggleDivsInArrays(array_show, array_hide) {
    for (var i = 0; i < array_show.length; i++) {
        array_show[i].style.display = 'block';
    }
    for (var i = 0; i < array_hide.length; i++) {
        array_hide[i].style.display = 'none';
    }
}

function loginTwitch() {
    console.log('Logging into Twitch');
    var twitch_oauth2_endpoint = 'https://api.twitch.tv/kraken/oauth2/authorize';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', twitch_oauth2_endpoint);
    var params = {
        'client_id': 'dyjm5o0cd24spkozqiyy3gue584olj',
        'redirect_uri': 'http://localhost:8000/twitch_login',
        'response_type': 'token',
        'scope': 'user_read',
        'force_verify': 'true',
    }
    completeAndSubmitForm(params, form);
}

function loginYoutube() {
    console.log('Logging into YouTube');
    var youtube_oauth2_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', youtube_oauth2_endpoint);
    var params = {
        'client_id': '1050192004499-7vn2paspfb0r96m5kvh18hi5h2q68k2g.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:8000/youtube_login',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'prompt': 'select_account consent',
    };
    completeAndSubmitForm(params, form);
}

function updateButtonsAvailable() {
    if (header_is_live.dataset.islive === 'true') {
        toggleDivsInArrays(button_start_array, button_offline_array);
        for (var i = 0; i < label_cost_way.length; i++) {
            if (label_cost_way[i].dataset.ml <= header_ml.dataset.ml) {
                label_cost_way[i].className = 'label_cost_way';
            }
        }
    } else {
        toggleDivsInArrays(button_offline_array, button_start_array);
        for (var i = 0; i < label_cost_way.length; i++) {
            label_cost_way[i].className = 'label_cost_way label_cost_off';
        }
    }
    setTimeout(updateButtonsAvailable, 3000);
}

// This post request has to be made through a form, if it is a plain XMLHttpRequest
// the response wont be registered in the global instance.
function startWay() {
    if (header_is_live.dataset.islive === 'true') {
        return true;
    } else {
        alert('Channel is not live');
        return false;
    }
}

window.onload = function () {
    if (header_is_live) setTimeout(updateButtonsAvailable, 1000);
}
