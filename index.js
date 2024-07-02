const searchInput = document.getElementById("search-input")
let moviesDataToRender = []
let watchlistMovies = []

document.addEventListener("click", (e) => {
    if (e.target.id === "search-btn") {
        e.preventDefault()
        moviesDataToRender = []
        getMovie(searchInput.value)
    } else if (e.target.dataset.imdbid) {
        handleWatchlistBtn(e.target.dataset.imdbid)
    }
})

async function getMovie(movieToSearch) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=79b38451&s=${movieToSearch}`);
    const data = await response.json()
    console.log(data)
    const moviesArr = data.Search
    
    moviesArr.map( async (id) => {
        const response = await fetch(`http://www.omdbapi.com/?apikey=79b38451&i=${id.imdbID}`)
        const data = await response.json()
        moviesDataToRender.push(data)
        if (moviesDataToRender.length === moviesArr.length) {
            renderMovies(moviesDataToRender)
        }
    }) 

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
                        <p class="add fa-solid fa-circle-plus" style="font-family:Inter, FontAwesome; font-weight:500" data-imdbid="${imdbID}"> Watchlist</p>
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
    document.getElementById("searched-movies").innerHTML = htmlFeed
}


function handleWatchlistBtn(imdbid) {
    const checkWatchList = watchlistMovies.find(movie => imdbid === movie.imdbID)
    if (checkWatchList) {
        console.log("Already in a playlist")
    } else {
        moviesDataToRender.find(movieToWach => {
            if (imdbid === movieToWach.imdbID) {
                watchlistMovies.push(movieToWach)
                localStorage.setItem("watchlist", JSON.stringify(watchlistMovies))
            }
        })
    }
}

function getMoviesFromLocalStorage() {
    let moviesFromLocalStorage = JSON.parse(localStorage.getItem("watchlist"))
    if (moviesFromLocalStorage) {
        watchlistMovies = moviesFromLocalStorage
    }
}

getMoviesFromLocalStorage()


// watchlist functions






