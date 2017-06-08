function CuttleChat(options) {
    switch(options.platform){
        case 'twitch':
            this.chat = new twitchChat(localStorage.getItem('twitch_channel'));
            break;
        case 'youtube':
            this.chat = new youtubeChat(localStorage.getItem('youtube_live_id'));
            break;
    }
}

CuttleChat.prototype.open = function open(){
    localStorage.removeItem('received_messages');
    this.chat.open();
}

CuttleChat.prototype.close = function close(){
    this.chat.close();
}


var twitchChat = function twitchChat(channel){
    this.channel = channel;

    this.username = 'cuttlebay';
    this.password = 'oauth:lvflu1lbn7ewjo3qx2na7jyvc8a9yh';
    this.server = 'irc-ws.chat.twitch.tv';
    this.port = 443;
}

twitchChat.prototype.open = function open(){
    this.webSocket = new WebSocket('wss://' + this.server + ':' + this.port + '/', 'irc');

    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
}

twitchChat.prototype.onError = function onError(message){
    console.log('Error: ' + message);
}

twitchChat.prototype.onMessage = function onMessage(message){
    if(message !== null){
        console.log(message.data);
        var parsed = this.parseMessage(message.data);

        if(parsed !== null){
            received_messages = localStorage.getItem('received_messages');
            console.log('MESSAGE: ' + parsed.message);
            if(received_messages === null){
                var items = [{username: parsed.username, message: parsed.message}];
                localStorage.setItem('received_messages', JSON.stringify(items));
            }
            else {
                console.log(JSON.parse(received_messages));
                items = JSON.parse(received_messages);
                items.push({username: parsed.username, message: parsed.message});
                localStorage.setItem('received_messages', JSON.stringify(items));
            }
        }
    }
}

twitchChat.prototype.onOpen = function onOpen(){
    var socket = this.webSocket;

    if (socket !== null && socket.readyState === 1) {
        console.log('Connecting and authenticating...');

        socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        socket.send('PASS ' + this.password);
        socket.send('NICK ' + this.username);
        socket.send('JOIN ' + this.channel);
    }
}

twitchChat.prototype.onClose = function onClose(){
    console.log('Disconnected from the chat server.');
}

twitchChat.prototype.close = function close(){
    if(this.webSocket){
        this.webSocket.close();
    }
}

twitchChat.prototype.parseMessage = function parseMessage(rawMessage) {
    var parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if(rawMessage[0] === '@'){
        var tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        parsedMessage.tags = rawMessage.slice(0, tagIndex);
        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
    }

    if(parsedMessage.command !== 'PRIVMSG'){
        parsedMessage = null;
    }

    return parsedMessage;
}


var youtubeChat = function youtubeChat(options) {

}
