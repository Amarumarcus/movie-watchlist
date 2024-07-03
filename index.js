const searchInput = document.getElementById("search-input")
const messageContainer = document.getElementById("message-container")
const message = document.getElementById("message")
let moviesDataToRender = []
let watchlistMovies = []

// add event listeners
document.addEventListener("click", (e) => {
    if (e.target.id === "search-btn") {
        e.preventDefault()
        moviesDataToRender = []
        getMovie(searchInput.value)
    } else if (e.target.dataset.imdbid) {
        handleWatchlistBtn(e.target.dataset.imdbid)
    }
})

// fetch data from API
async function getMovie(movieToSearch) {
    // get search results
    const response = await fetch(`https://www.omdbapi.com/?apikey=79b38451&s=${movieToSearch}`);
    const data = await response.json()
    // find movies with full info, push to array, call function with this array
    const moviesArr = data.Search
    moviesArr.map( async (id) => {
        const response = await fetch(`https://www.omdbapi.com/?apikey=79b38451&i=${id.imdbID}`)
        const data = await response.json()
        moviesDataToRender.push(data)
        if (moviesDataToRender.length === moviesArr.length) {
            renderMovies(moviesDataToRender)
        }
    }) 
}
// get html, check if movie in watchlist already, get diffrent html results
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
                        ${ watchlistMovies.find(movie => imdbID === movie.imdbID) ? 
                            `<p style="color:green">In watchlist</p>` :
                            `<p class="add fa-solid fa-circle-plus" style="font-family:Inter, FontAwesome; font-weight:500" data-imdbid="${imdbID}" id="${imdbID}"> Watchlist</p>`
                        }
                        
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
// render Html
function render(htmlFeed) {
    document.getElementById("searched-movies").innerHTML = htmlFeed
}

// set movies to localStorage watchlist, toggle classes and messages if movie in watchlist or not
function handleWatchlistBtn(imdbid) {
    const checkWatchList = watchlistMovies.find(movie => imdbid === movie.imdbID)
    if (checkWatchList) {
        message.textContent = "Already in watchlist"
        messageContainer.classList.toggle("active")
        setTimeout(() => {messageContainer.classList.toggle("active")}, 2000)
    } else {
        moviesDataToRender.find(movieToWach => {
            if (imdbid === movieToWach.imdbID) {
                watchlistMovies.push(movieToWach)
                localStorage.setItem("watchlist", JSON.stringify(watchlistMovies))
                message.textContent = "Added to watchlist"
                messageContainer.classList.toggle("active")
                setTimeout(() => {messageContainer.classList.toggle("active")}, 2000)
                document.getElementById(`${imdbid}`).classList.toggle("active")
                document.getElementById(`${imdbid}`).textContent = " In Watchlist"
            }
        })
    }
}
// get movie from localStorage
function getMoviesFromLocalStorage() {
    let moviesFromLocalStorage = JSON.parse(localStorage.getItem("watchlist"))
    if (moviesFromLocalStorage) {
        watchlistMovies = moviesFromLocalStorage
    }
}

getMoviesFromLocalStorage()







