var chat = new CuttleChat({
    platform: localStorage.getItem('use_connected_account')
});

chat.open();
