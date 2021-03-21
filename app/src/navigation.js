import {showCreate} from "./create.js";
import {showHome} from "./home.js";

export function setupNavigation(links) {
    const email = sessionStorage.getItem('email');

    if (email !== null) {
        displayUserNavigation(email);
    } else {
        displayGuestNavigation();
    }

    document.querySelector('nav').addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.tagName === 'A') {
            const view = links[event.target.id];
            if (typeof view === 'function') {
                view();
            }
        }
    });

    document.getElementById('createMovieLink').addEventListener('click', (event) => {
        event.preventDefault();
        if (sessionStorage.getItem('authToken') === null) {
            return alert('You need be a user to add movies. Please register or log in!');
        }
        showCreate();
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);
}

async function logout(ev) {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {'X-Authorization': token}
    });

    if (response.ok) {
        sessionStorage.removeItem('email')
        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('authToken');

        displayGuestNavigation();

        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}

export function displayUserNavigation(email) {
    document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;
    [...document.querySelectorAll('nav .user')].forEach(li => li.style.display = 'block');
    [...document.querySelectorAll('nav .guest')].forEach(li => li.style.display = 'none');
}

export function displayGuestNavigation() {
    [...document.querySelectorAll('nav .user')].forEach(li => li.style.display = 'none');
    [...document.querySelectorAll('nav .guest')].forEach(li => li.style.display = 'block');
}