import {e} from "./dom.js";
import {showHome} from "./home.js";
import {showEdit} from "./edit.js";

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const data = await response.json();

    return data;
}

async function getLikesByMovieId(id) {
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22&distinct=_ownerId&count`);
    const data = await response.json();

    return data;
}

async function getOwnLikesByMovieId(id) {
    const userId = sessionStorage.getItem('userId');
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${id}%22%20and%20_ownerId%3D%22${userId}%22`);
    const data = await response.json();

    return data;
}

async function deleteMovie(ev, id) {
    ev.preventDefault();
    const confirmed = confirm('Are you sure you\'d like to delete this movie?');

    if (confirmed) {
        const response = await fetch('http://localhost:3030/data/movies/' + id, {
            method: 'delete',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken')
            }
        });
        if (response.ok) {
            alert('Movie deleted successfully!');
            showHome();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    }

}

function createMovieCard(movie, likes, ownLike) {
    const controls = e('div', {className: 'col-md-4 text-center'},
        e('h3', {className: 'my-3'}, 'Movie Description'),
        e('p', {}, movie.description)
    );

    const userId = sessionStorage.getItem('userId');
    const likesSpan = e('span', {className: 'btn enrolled-span'}, likes + ' like' + (likes === 1 ? '' : 's'));
    controls.appendChild(likesSpan);

    if (userId !== null) {
        if (userId === movie._ownerId) {
            controls.appendChild(e('a', {className: 'btn btn-danger', href: '#', onclick: (ev) => deleteMovie(ev, movie._id)}, 'Delete'));
            controls.appendChild(e('a', {className: 'btn btn-warning', href: '#', onclick: (ev) => showEdit(ev, movie._id)}, 'Edit'));
        } else if (ownLike.length === 0){
            controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onclick: likeMovie}, 'Like'));
        } else if (ownLike.length === 1){
            controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onclick: dislikeMovie}, 'Dislike'));
        }
    }



    const element = e('div', {className: 'container'},
        e('div', {className: 'row bg-light text-dark'},
            e('h1', {id: 'movie-description-title'}, `Movie title: ${movie.title}`),
            e('div', {className: 'col-md-8'},
                e('img', {className: 'img-thumbnail', src: movie.img}, '')),
            controls
        )
    );

    async function likeMovie(event) {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({movieId: movie._id})
        });

        if (response.ok) {
            event.target.remove();
            likes++
            likesSpan.textContent = likes + ' like' + (likes === 1 ? '' : 's');
            controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onclick: dislikeMovie}, 'Dislike'));
        }
    }

    async function dislikeMovie(event) {
        const fetchedLikeArr = await getOwnLikesByMovieId(movie._id);
        const likeId = fetchedLikeArr[0]._id;
        const response = await fetch('http://localhost:3030/data/likes/' + likeId, {
            method: 'delete',
            headers: {
                'X-Authorization': sessionStorage.getItem('authToken'),
            },
        });

        if (response.ok) {
            event.target.remove();
            likes--
            likesSpan.textContent = likes + ' like' + (likes === 1 ? '' : 's');
            controls.appendChild(e('a', {className: 'btn btn-primary', href: '#', onclick: likeMovie}, 'Like'));
        } else {
            const error = await response.json();
        }

    }

    return element;
}

let main;
let section;

export function setupDetails(mainTarget, sectionTarget) {
    main = mainTarget;
    section = sectionTarget;
}

export async function showDetails(id) {
    section.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    document.getElementById('homeLink').textContent = '⋖ Back to Movies';

    const [movie, likes, ownLike] = await Promise.all([
        getMovieById(id),
        getLikesByMovieId(id),
        getOwnLikesByMovieId(id)
    ]);
    const card = createMovieCard(movie, likes, ownLike);

    section.appendChild(card);
}