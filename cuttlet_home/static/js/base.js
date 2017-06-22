var header_dropdown = document.getElementById('header_dropdown');

document.addEventListener('click', checkHiddenOnClick, false);

function checkHiddenOnClick() {
    if(!event.target.closest('#header_user')) {
        if (getComputedStyle(header_dropdown).display === 'block') {
            console.log('kp');
            header_dropdown.classList.toggle('hidden');
        }
    }
}

function showDropdown() {
    header_dropdown.classList.toggle('hidden');
}
