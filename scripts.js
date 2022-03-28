window.addEventListener("load", initPage);
var bgContainer;
var interfaceContainer;
var underline1;
var underline2;
var loaderWrapper;
var leftGuide = 0.15;
var menuTabs = [];
var menuCenter;
var genresLine;
var movieGenresCount;
var genreSpans = [];
var moviesLine;
var moviesCurrentIds = [];
var movieCards = [];
var movieTitle;
var movieInfo;

var keysEnabled;
var genreChange;
var movieChange;

var pageLoad = new Event('pageLoad');
var navElements = [];
var elementNodes;
var currentNode;

//  init elements and put 'em in navElements array, except for movie cards
//  they're loaded every time genre changes
function initPage(){
    bgContainer = document.getElementById("bg-container");
    interfaceContainer = document.getElementById("interface");
    underline1 = document.getElementById("underline1");
    underline2 = document.getElementById("underline2");
    loaderWrapper = document.getElementById("loader-wrapper");
    menuCenter = document.getElementById("menu-center");
    menuTabs = document.getElementsByClassName("menu-tab");
    genresLine = document.getElementById("genres-line");
    moviesLine = document.getElementById("movies-line");
    movieGenresCount = movieGenres.length;
    movieTitle = document.getElementById("movie-title");
    movieInfo = document.getElementById("movie-info");

    keysEnabled = true;
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
    //  then invoke nodes initialization initNodes() in navigation.js
    document.dispatchEvent(pageLoad);
}

function findGenreMovies(currentGenre) {
    var i = 0, foundMoviesIds = [];
    for (var j=0; j < movies.length; j++) {
        var hasCurrentGenre = false;
        for (var k = 0; k < movies[j].genres.length; k++) {
            if (movies[j].genres[k] === currentGenre)
            {
                hasCurrentGenre = true;
                foundMoviesIds[i] = j;
                i++;
                break;
            }
        }
    }
    return foundMoviesIds;
}
//  when genre changes need to update current movie cards
//  and their navigation elements with nodes
function onGenreChange() {
    //  for the movies loading time we turn off the keys and show a loader overlay
    keysEnabled = false;
    loaderWrapper.classList.remove("display-none");

    //  remove old movie cards from navElements and their nodes
    navElements.splice(moviesNodeId+1, moviesCurrentIds.length);
    elementNodes.removeNodes(moviesNodeId+1, moviesCurrentIds.length);
    elementNodes.nodes[moviesNodeId].lastSelectedChildId = moviesNodeId + 1;

    var currentGenre = movieGenres[currentNode.id - genresNodeId-1];
    //  find fitting movies
    moviesCurrentIds = findGenreMovies(currentGenre);
    //  and create card for them
    moviesLine.innerHTML = "";
    movieCards = [];
    for (var i = 0; i < moviesCurrentIds.length; i++) {
        var newMovieCard = document.createElement('div');
        newMovieCard.classList.add('movie-card');
            newMovieCard.style.backgroundImage = "url('"+movies[moviesCurrentIds[i]].image+"')";
        moviesLine.insertAdjacentElement("beforeend", newMovieCard);
        movieCards[i] = newMovieCard;
        navElements[navElements.length] = newMovieCard;
    }
    //  fill nodes with new cards
    //  movie-cards nodes creation
    for (var i = 0; i < movieCards.length; i++) {
        var newNodeLeft = (i === 0) ? - 1 : elementNodes.nodes.length - 1;
        var newNodeRight = (i === (movieCards.length - 1)) ? -1 : elementNodes.nodes.length + 1;
        elementNodes.addNode("movie-card-" + i, genresNodeId, newNodeRight, -1,newNodeLeft);
        elementNodes.nodes[moviesNodeId].addChild(elementNodes.nodes.length - 1);
    }
    //  long loading simulation
    setTimeout(function (){
        keysEnabled = true;
        loaderWrapper.classList.add("display-none");
    }, moviesCurrentIds.length * moviesCurrentIds.length * 10);
}

function onMovieChange() {
    movieTitle.innerText = movies[moviesCurrentIds[currentNode.id-moviesNodeId-1]].getMovieTitle();
    movieInfo.innerHTML = movies[moviesCurrentIds[currentNode.id-moviesNodeId-1]].getMovieInfo();
    bgContainer.style.backgroundImage = "url('"+movies[moviesCurrentIds[currentNode.id-moviesNodeId-1]].imageBg+"')";
    interfaceContainer.style.backgroundImage = "url('./img/black-bg-opacity-50.png')";
}