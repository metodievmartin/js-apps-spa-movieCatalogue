import {showHome} from "./home.js";

let main;
let section;

export function setupEdit(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

async function onSubmit(ev, id) {
    ev.preventDefault();
    const formData = new FormData(ev.target);
    const movie = {
        title: formData.get('title'),
        description: formData.get('description'),
        img: formData.get('imageUrl')
    }

    if (movie.title.trim() === '' ||
        movie.description.trim() === '' ||
        movie.img.trim() === '') {
        return alert('All fields are required!');
    }

    const response = await fetch('http://localhost:3030/data/movies/' + id, {
        method: 'put',
        headers: {
            'X-Authorization': sessionStorage.getItem('authToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movie),
    });

    if (response.ok) {
        alert('Movie updated successfully!')
        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }

}

export async function showEdit(ev, id) {
    main.innerHTML = '';
    main.appendChild(section);

    document.getElementById('homeLink').textContent = '⋖ Back to Movies';

    const form = section.querySelector('form');
    form.addEventListener('submit', (ev) => onSubmit(ev, id));

    const response = await fetch('http://localhost:3030/data/movies/' + id);

    const movie = {
        title: form.querySelector('input[name="title"]'),
        description: form.querySelector('textarea[name="description"]'),
        img: form.querySelector('input[name="imageUrl"]')
    }

    if (response.ok) {
        const data = await response.json();
        movie.title.value = data.title;
        movie.description.value = data.description;
        movie.img.value = data.img;
    } else {
        const error = await response.json();
        alert(error.message);
    }
}