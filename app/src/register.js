import {successfulLogin} from "./login.js";

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('repeatPassword');

    if (email.trim() === '' || password.trim() === '') {
        alert('All fields are required!');
        return;
    } else if (password !== rePass) {
        alert('Passwords don\'t match!');
        return;
    }

    const response = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (response.ok) {
        event.target.reset();

        const data = await response.json();
        successfulLogin(data);
    } else {
        const error = await response.json();
        alert(error.message);
    }
}

let main;
let section;

export function setupRegister(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showRegister() {
    main.innerHTML = '';
    main.appendChild(section);

    document.getElementById('homeLink').textContent = '⋖ Back to Movies';
}