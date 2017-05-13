var query_string = location.hash.substring(1);

var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(query_string)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    exchangeOAuth2Token(params);
}

function exchangeOAuth2Token(params) {
    // URI Received from YouTube must have
    // access_token, token_type, and expires_in
    if (params['access_token'] && params['token_type'] && params['expires_in']) {
        var oauth2_endpoint ='https://www.googleapis.com/oauth2/v3/tokeninfo';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', oauth2_endpoint + '?access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
            var response = JSON.parse(xhr.response);
            if (xhr.readyState == 4 &&
                xhr.status == 200 &&
                response['aud'] &&
                response['aud'] == '1050192004499-7vn2paspfb0r96m5kvh18hi5h2q68k2g.apps.googleusercontent.com'
                ) {
                requestChannelId(params['access_token']);
            } else if (xhr.readyState == 4) {
                console.log ('Token was invalid');
            }
        };
        xhr.send(null);
    }
}

function requestChannelId(access_token) {
    var xhr = new XMLHttpRequest();
    api_endpoint = 'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&';
    xhr.open('GET', api_endpoint + 'access_token=' + access_token);
    xhr.onreadystatechange = function (e) {
        console.log(xhr.response);
        var channel_id = JSON.parse(xhr.response).items[0].id;
        console.log(channel_id);
    };
    xhr.send(null);
}
