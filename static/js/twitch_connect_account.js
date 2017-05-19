var query_string = location.hash.substring(1);
var query_string = location.hash.substring(1);

var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(query_string)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    requestChannelId(params);
}

function requestChannelId(params) {
    if (params['access_token']) {
        var xhr = new XMLHttpRequest();
        api_endpoint = 'https://api.twitch.tv/kraken/user?client_id=dyjm5o0cd24spkozqiyy3gue584olj';
        xhr.open('GET', api_endpoint);
        xhr.setRequestHeader("Authorization", "OAuth " + params['access_token'])
        window.location.replace('')
        xhr.onreadystatechange = function (e) {
            console.log(xhr.response);
            var channel_username = JSON.parse(xhr.response).name;
            updateTwitchChannel(channel_username);
            console.log(channel_username);
        };
        xhr.send(null);
    }
}

function updateTwitchChannel(channel_username) {
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '');
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', 'twitch_username');
    input.setAttribute('value', channel_username);
    form.appendChild(document.getElementsByName('csrfmiddlewaretoken')[0]);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}
