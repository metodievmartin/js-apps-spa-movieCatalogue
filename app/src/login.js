import {showHome} from "./home.js";
import {displayUserNavigation} from "./navigation.js";

let main;
let section;

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const response = await fetch('http://localhost:3030/users/login', {
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

export function successfulLogin(data) {
    sessionStorage.setItem('email', data.email)
    sessionStorage.setItem('userId', data._id)
    sessionStorage.setItem('authToken', data.accessToken);

    displayUserNavigation(data.email);

    showHome();
}

export function setupLogin(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;

    const form = section.querySelector('form');
    form.addEventListener('submit', onSubmit);
}

export async function showLogin() {
    main.innerHTML = '';

    main.appendChild(section);

    document.getElementById('homeLink').textContent = '⋖ Back to Movies';
}