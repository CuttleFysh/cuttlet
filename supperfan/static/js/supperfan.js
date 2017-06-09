var chat = new CuttleChat({
    platform: localStorage.getItem('use_connected_account')
});

chat.open();
setTimeout(function () {
    console.log('closing chat //');
    chat.close();
}, 10000);
