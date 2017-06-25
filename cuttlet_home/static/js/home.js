// FIXME: Revise all style.display = 'block', so that they agree with our style
var header_is_live = document.getElementById('header_is_live');

var button_login_twitch = document.getElementById('button_login_twitch');
var button_login_youtube = document.getElementById('button_login_youtube');

var button_start_array = document.getElementsByClassName('button_start');
var button_offline_array = document.getElementsByClassName('button_start_offline');

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
    } else {
        toggleDivsInArrays(button_offline_array, button_start_array);
    }
    setTimeout(updateButtonsAvailable, 3000);
}

function isJuiceEnough(required_juice, callback) {
    var xhr = new XMLHttpRequest();
    var url = '/?';
    var params = 'q=juice';
    xhr.open('GET', url + params);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.getResponseHeader('Content-Type') == 'application/json') {
                console.log(xhr.response);
                var response = JSON.parse(xhr.response);
                var result = false;
                console.log(response.juice);
                if (required_juice <= response.juice) {
                    result = true;
                }
                callback.apply(result);
            }
        }
    };
    xhr.send(null);
}

// This post request has to be made through a form, if it is a plain XMLHttpRequest
// the response wont be registered in the global instance.
function startWay(url, cost) {
    if (header_is_live.dataset.islive === 'true') {
        isJuiceEnough(cost, function () {
            if (this) {
                var form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', url);
                var params = {
                    'csrfmiddlewaretoken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
                };
                completeAndSubmitForm(params, form);
            }
        });
    } else {
        alert('Channel is not live');
    }
}

window.onload = function () {
    if (header_is_live) setTimeout(updateButtonsAvailable, 1000);
}
