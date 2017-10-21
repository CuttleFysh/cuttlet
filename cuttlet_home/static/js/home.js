var button_header_login = document.getElementById('button_header_login');
var overlay_login = document.getElementById('overlay_login');
var overlay_login_close = document.getElementById('overlay_login_close');

var header_is_live = document.getElementById('header_is_live');
var header_ml = document.getElementById('header_ml');

var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');

var button_start_array = document.getElementsByClassName('button_start');
var button_offline_array = document.getElementsByClassName('button_start_offline');

var label_cost_app = document.getElementsByClassName('label_cost_app');

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
    var twitch_oauth2_endpoint = 'https://api.twitch.tv/kraken/oauth2/authorize';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', twitch_oauth2_endpoint);
    var params = {
        'client_id': TWITCH_CLIENT_ID,
        'redirect_uri': 'https://www.cuttlebay.com/twitch_login',
        'response_type': 'token',
        'scope': 'user_read',
        'force_verify': 'true',
    }
    completeAndSubmitForm(params, form);
}

function loginYoutube() {
    var youtube_oauth2_endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', youtube_oauth2_endpoint);
    var params = {
        'client_id': '1050192004499-8r20tm8rqaek1p9ej4g8vr8ubekkfbms.apps.googleusercontent.com',
        'redirect_uri': 'https://www.cuttlebay.com//youtube_login',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/youtube.readonly',
        'prompt': 'select_account consent',
    };
    completeAndSubmitForm(params, form);
}

function updateButtonsAvailable() {
    if (header_is_live.dataset.islive === 'true') {
        toggleDivsInArrays(button_start_array, button_offline_array);
        for (var i = 0; i < label_cost_app.length; i++) {
            if (label_cost_app[i].dataset.ml <= header_ml.dataset.ml) {
                label_cost_app[i].className = 'label_cost_app';
            }
        }
    } else {
        toggleDivsInArrays(button_offline_array, button_start_array);
        for (var i = 0; i < label_cost_app.length; i++) {
            label_cost_app[i].className = 'label_cost_app label_cost_off';
        }
    }
    setTimeout(updateButtonsAvailable, 3000);
}

function startApp(cost) {
    if (cost <= header_ml.dataset.ml) {
        return true;
    } else {
        alert('Not enough Juice');
        return false;
    }
}

window.onload = function () {
    if (header_is_live) setTimeout(updateButtonsAvailable, 1000);
}
