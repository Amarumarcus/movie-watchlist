const moviesCont = document.getElementById("watchlist-movies")
let watchlistMovies = []

document.addEventListener("click", e => {
    if (e.target.dataset.imdbid) {
        handleRemoveBtn(e.target.dataset.imdbid)
    }
})

function getMoviesFromLocalStorage() {
    let moviesFromLocalStorage = JSON.parse(localStorage.getItem("watchlist"))
    watchlistMovies = moviesFromLocalStorage
    if (moviesFromLocalStorage.length) {
        renderMovies(watchlistMovies)
    }
}

function renderMovies(movies) {
    let html = ""
    
    movies.map(movie => {
        const {
            Poster,
            Title,
            Ratings,
            Runtime,
            Genre,
            Plot,
            imdbID
        } = movie
        html += `
            <div class="movie-container">
                <div class="poster-container">
                   <img src="${Poster}" alt="poster" class="movie-poster">
                </div>
                <div class="description-container">
                    <div class="title-rating">
                        <h4 class="title">${Title}</h4>
                        <p class="rating">⭐ ${Ratings[0].Value}</p>
                    </div>
                    <div class="length-genres-add">
                        <p class="length">${Runtime}</p>
                        <p class="genres">${Genre}</p>
                        <p class="add fa-solid fa-circle-minus" style="font-family:Inter, FontAwesome; font-weight:500" data-imdbid="${imdbID}"> Remove</p>
                    </div>
                    <div>
                        <p class="description">${Plot}</p>
                    </div>
                </div>
            </div>
        `
    })
    render(html)
}

function render(htmlFeed) {
    moviesCont.innerHTML = htmlFeed
}

function handleRemoveBtn(imdbid) {
    const newMomiesArr = watchlistMovies.filter(movie => {
        if (!(imdbid === movie.imdbID)) {
            return movie
        }
    })
    localStorage.setItem("watchlist", JSON.stringify(newMomiesArr))
    getMoviesFromLocalStorage()
    if (watchlistMovies.length === 0) {
        moviesCont.innerHTML = `
            <div class="placeholder-container">
                <p class="empty">Your watchlist is looking a little empty...</p>
                <a href="/index.html" class="add fa-solid fa-circle-plus" style="font-family:Inter, FontAwesome; font-weight:500; color:white; text-decoration: none;"> Let’s add some movies!</a>
            </div>
        `
    }
}

getMoviesFromLocalStorage()