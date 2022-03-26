window.addEventListener("load", initPage);
var menuTabs = [];
var menuCenter;
var genresLine;
var movieGenresCount;
var genreSpans = [];
var movieLine;
var moviesCurrentIds = [];
var movieCards = [];
var movieTitle;
var movieInfo;

var genreChange;
var movieChange;

var pageLoad = new Event('pageLoad');
var navElements = [];
var elementNodes;
var currentNode;

function initPage(){
    menuCenter = document.getElementById("menu-center");
    menuTabs = document.getElementsByClassName("menu-tab");
    genresLine = document.getElementById("genres-line");
    movieLine = document.getElementById("movies-line");
    movieGenresCount = movieGenres.length;
    movieTitle = document.getElementById("movie-title");
    movieInfo = document.getElementById("movie-info");

    genreChange = new Event('genreChange');
    window.addEventListener("genreChange", onGenreChange);
    movieChange = new Event('movieChange');
    window.addEventListener("movieChange", onMovieChange);


    navElements[0] = menuCenter;
    //  1st element is the last menuTab, cause it's settings tab
    //  and we don't need to add it in the next loop
    navElements[1] = menuTabs[menuTabs.length - 1];
    for (var i = 0; i < menuTabs.length - 1; i++) {
        navElements[navElements.length] = menuTabs[i];
    }
    navElements[navElements.length] = genresLine;
    for (var i = 0; i < movieGenres.length; i++) {
        var newSpan = document.createElement("span");
        newSpan.innerText = newSpan.innerHTML = newSpan.textContent = movieGenres[i];
        newSpan.classList.add("genre");
        genreSpans[i] = newSpan;
        genresLine.insertAdjacentElement("beforeend", newSpan);
        navElements[navElements.length] = newSpan;
    }
    //  cards will be created and added to navElements on every genreChange,
    //  but for navigation test we'll do it now
    movieCards = document.getElementsByClassName("movie-card");
    for (var i = 0; i < movieCards.length; i++) {
        navElements[navElements.length] = movieCards[i];
    }
    document.dispatchEvent(pageLoad);
    console.log(navElements);
    // movieTitle.innerText = movies[6].getMovieTitle();
    // movieInfo.innerHTML = movies[6].getMovieInfo();
}


//  when genre changes need to update current movie cards
//  and navigation elements with nodes
function onGenreChange() {
    // console.log('Genre Change occurred, current genre is: ' +
    //     movieGenres[currentNode.id - genresNodeId-1]);
    elementNodes.removeNodes(moviesNodeId + 1, moviesCurrentIds.length);
    var currentGenre = movieGenres[currentNode.id - genresNodeId-1];
    //  find fitting movies
    var i = 0;
    moviesCurrentIds = [];
    for (var j=0; j < movies.length; j++) {
        var hasCurrentGenre = false;
        for (var k = 0; k < movies[j].genres.length; k++) {
            if (movies[j].genres[k] === currentGenre)
            {
                hasCurrentGenre = true;
                moviesCurrentIds[i] = j;
                i++;
                break;
            }
        }
    }
    movieLine.innerHTML = "";
    movieCards = [];
    for (var i = 0; i < moviesCurrentIds.length; i++) {
        var newMovieCard = document.createElement('div');
        newMovieCard.classList.add('movie-card');
        // newMovieCard.style.background = "no-repeat center contain";
        newMovieCard.style.backgroundImage = "url('"+movies[moviesCurrentIds[i]].image+"')";
        movieLine.insertAdjacentElement("beforeend", newMovieCard);
        movieCards[i] = newMovieCard;
        navElements[navElements.length] = newMovieCard;
    }
    //  fill nodes with new cards
    //  movie-cards nodes creation
    for (var i = 0; i < movieCards.length; i++) {
        var newNodeLeft = (i === 0) ? - 1 : elementNodes.nodes.length - 1;
        var newNodeRight = (i === (movieCards.length - 1)) ? -1 : elementNodes.nodes.length + 1;
        elementNodes.addNode("movie-card-" + i, genresNodeId, newNodeRight, -1,newNodeLeft);
        elementNodes.nodes[moviesNodeId-1].addChild(elementNodes.nodes.length - 1);
    }
    console.log(elementNodes.nodes[moviesNodeId-1]);
}

function onMovieChange() {
    console.log('Movie Change occurred, current movie is: ' +
        movieCards[currentNode.id-moviesNodeId-1]);
}