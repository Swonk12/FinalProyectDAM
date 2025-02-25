// Optional JS functionality
const form = document.querySelector('.login-form');
form.addEventListener('submit', (event) => {
    const email = form.email.value;
    const password = form.password.value;
    if (!email || !password) {
        event.preventDefault();
        alert('Please fill out all fields.');
    }
});