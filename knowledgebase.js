document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll('.knowledge-item');

    items.forEach(item => {
        item.addEventListener('click', () => {
            if (item.querySelector('.knowledge-title').innerText == 'Printer Guide') {
                window.location.href = 'exampleknowledge.html';
                return;
            } else {
                alert(`You clicked on: ${item.querySelector('.knowledge-title').innerText}`);
            }   
        });
    });
});
