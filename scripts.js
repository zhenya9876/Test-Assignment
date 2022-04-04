window.addEventListener("load", initPage);
var bgContainer;
var interfaceContainer;
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

var menuCenterObj;
var menuRightObj;
var menuTabSearch;
var menuTabLive;
var menuTabVod;
var menuTabApps;
var menuTabSettings;
var genresMenu;
var moviesMenu;

//  init elements and put 'em in navElements array, except for movie cards
//  they're loaded every time genre changes
function initPage(){
    var screenMiddle = window.innerWidth * .5;
    bgContainer = document.getElementById("bg-container");
    interfaceContainer = document.getElementById("interface");
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

    initTopMenu();
    initGenresMenu();
    initMoviesMenu();
    //  then invoke nodes initialization initNodes() in navigation.js
    initNav();
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
function initTopMenu() {
    menuCenterObj = new MenuObject(menuCenter.id, menuCenter);
    menuRightObj = new MenuObject();
    menuTabSearch = new MenuTab(menuTabs[0].id, menuTabs[0]);
    menuTabLive = new MenuTab(menuTabs[1].id, menuTabs[1]);
    menuTabVod = new MenuTab(menuTabs[2].id, menuTabs[2]);
    menuTabApps = new MenuTab(menuTabs[3].id, menuTabs[3]);
    menuTabSettings = new MenuTab(menuTabs[4].id, menuTabs[4]);

    menuCenterObj.pressLeft = function (){menuCenterObj.selectPrev()};
    menuCenterObj.pressDown = function (){
        this.lastSelectedTab.isFocused = false;
        menuCenterObj.deactivate();
        menuRightObj.deactivate();
        menuCenterObj.lastSelectedTab.element.classList.add("last-pressed");
        genresMenu.activate();
        if (genresMenu.lastSelectedTab === null)
            genresMenu.changeFocusInside(genresMenu.menuTabs[0]);
        else genresMenu.changeFocusInside(genresMenu.lastSelectedTab);
        focusedMenu = genresMenu;
        focusedElement = genresMenu.lastSelectedTab;
        genresMenu.lastSelectedTab.underlineElement.classList.remove("display-none")
        window.dispatchEvent(genreChange);
    };
    menuCenterObj.pressRight = function (){menuCenterObj.selectNext()};

    menuTabApps.pressRight = function (){
        focusedMenu = menuRightObj;
        this.isFocused = false;
        menuCenterObj.lastSelectedTab.element.classList.remove("selected");
        menuRightObj.changeFocusInside(menuTabSettings);
    }
    menuTabSettings.pressLeft = function (){
        focusedMenu = menuCenterObj;
        this.isFocused = false;
        menuRightObj.lastSelectedTab.element.classList.remove("selected");
        menuCenterObj.changeFocusInside(menuTabApps);
    }

    menuCenterObj.addMenuTab(menuTabSearch);
    menuCenterObj.addMenuTab(menuTabLive);
    menuCenterObj.addMenuTab(menuTabVod);
    menuCenterObj.addMenuTab(menuTabApps);
    menuRightObj.addMenuTab(menuTabSettings);
    focusedMenu = menuCenterObj;
    focusedElement = menuTabSearch;
    menuCenterObj.changeFocusInside(menuTabSearch);

    movieGenresCount = movieGenres.length;
}
function initGenresMenu() {
    genresMenu = new MenuObject(genresLine.id, genresLine);
    for (var i = 0; i < movieGenresCount; i++) {
        var newGenreContainer = document.createElement("div");
        var newUnderline = document.createElement("div");
        newGenreContainer.classList.add("genre-container");
        newUnderline.classList.add("underline");
        newUnderline.classList.add("display-none");
        var newSpan = document.createElement("span");
        newSpan.innerText = newSpan.innerHTML = newSpan.textContent = movieGenres[i];
        newSpan.classList.add("genre");
        genreSpans[i] = newSpan;
        newSpan.insertAdjacentElement("beforeend", newUnderline);

        newGenreContainer.insertAdjacentElement("beforeend", newSpan);
        genresLine.insertAdjacentElement("beforeend", newGenreContainer);

        var genreTab = new MenuTab("genre-tab-" + i, newSpan);
        genreTab.underlineElement = newUnderline;
        genresMenu.addMenuTab(genreTab);
    }
    genresMenu.pressLeft = function () {
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        if(this.selectPrev()) {
            window.dispatchEvent(genreChange);
        }
        this.lastSelectedTab.underlineElement.classList.remove("display-none");
    }
    genresMenu.pressRight = function () {
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        if (this.selectNext()) {
            window.dispatchEvent(genreChange);
        }
        this.lastSelectedTab.underlineElement.classList.remove("display-none");
    }
    genresMenu.pressUp = function () {
        focusedMenu = menuCenterObj;
        this.lastSelectedTab.isFocused = false;
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        genresMenu.lastSelectedTab.element.classList.remove("selected");
        genresMenu.deactivate();
        menuCenterObj.activate();
        menuRightObj.activate();
        menuCenterObj.lastSelectedTab.element.classList.remove("last-pressed");
        menuRightObj.lastSelectedTab.element.classList.remove("selected");
        focusedElement = focusedMenu.lastSelectedTab;
    }
    genresMenu.pressDown = function () {
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        this.deactivate();
        this.lastSelectedTab.element.classList.add("selected");
        moviesMenu.lastSelectedTab.isFocused = true;
        focusedMenu = moviesMenu;
        focusedElement = focusedMenu.lastSelectedTab;
        window.dispatchEvent(movieChange);
        focusedMenu.lastSelectedTab.underlineElement.classList.remove("display-none");
        focusedMenu.changeFocusInside(focusedMenu.lastSelectedTab);
    }
    genresMenu.getCurrentGenre = function () {
        return movieGenres[this.lastSelectedTab.index];
    }
}
function initMoviesMenu() {
    var screenMiddle = window.innerWidth * .5;
    moviesMenu = new MenuObject(moviesLine.id, moviesLine);
    //  find fitting movies
    moviesCurrentIds = findGenreMovies(genresMenu.getCurrentGenre());
    //  and create cards for them
    moviesMenu.getCurrentMovie = function () {
        return movies[moviesCurrentIds[this.lastSelectedTab.index]];
    }
    moviesMenu.pressUp = function () {
        moviesLine.style.transform = "translateX(" + (screenMiddle
            - (moviesMenu.lastSelectedTab.index)*(185) - 185/2) + "px";
        this.lastSelectedTab.isFocused = false;
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        this.lastSelectedTab.element.classList.remove("selected");
        genresMenu.activate();
        genresMenu.lastSelectedTab.underlineElement.classList.remove("display-none");
        focusedMenu = genresMenu;
        focusedElement = focusedMenu.lastSelectedTab;
    }
    moviesMenu.pressLeft = function () {
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        if(this.selectPrev()) {
            window.dispatchEvent(movieChange);
        }
        this.lastSelectedTab.underlineElement.classList.remove("display-none");
    }
    moviesMenu.pressRight = function () {
        this.lastSelectedTab.underlineElement.classList.add("display-none");
        if(this.selectNext()) {
            window.dispatchEvent(movieChange);
        }
        this.lastSelectedTab.underlineElement.classList.remove("display-none");
    }
}
//  when genre changes need to update current movie cards
function onGenreChange() {
    //  for the movies loading time we turn off the keys and show a loader overlay
    keysEnabled = false;
    loaderWrapper.classList.remove("display-none");

    //  remove old movie cards
    moviesMenu.menuTabs = [];

    var currentGenre = genresMenu.getCurrentGenre();
    //  find fitting movies
    moviesCurrentIds = findGenreMovies(currentGenre);
    //  and create card for them
    moviesLine.innerHTML = "";
    movieCards = [];
    for (var i = 0; i < moviesCurrentIds.length; i++) {
        var newMovieCard = document.createElement('div');
        newMovieCard.classList.add('movie-card');
        var newUnderline = document.createElement("div");
        newUnderline.classList.add("underline");
        newUnderline.classList.add("display-none");
        newMovieCard.style.backgroundImage = "url('"+movies[moviesCurrentIds[i]].image+"')";
        newMovieCard.insertAdjacentElement("beforeend", newUnderline);
        moviesLine.insertAdjacentElement("beforeend", newMovieCard);
        movieCards[i] = newMovieCard;
        var newMovieTab = new MenuTab("movie-card-"+i, newMovieCard);
        newMovieTab.underlineElement = newUnderline;
        moviesMenu.addMenuTab(newMovieTab);
    }
    moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
    var screenMiddle = window.innerWidth * .5;
    var genresBounds = genresLine.getBoundingClientRect();
    var genresLeftGuide = window.innerWidth * leftGuide;
    var genresLeftMargin = genresMenu.lastSelectedTab.element.offsetLeft;

    genresLine.style.transform = "translateX(" + (genresLeftGuide - genresLeftMargin) + "px)";

    moviesLine.style.transform = "translateX(" + (screenMiddle - (195)/2 + 2.875) + "px)";
    //  long loading simulation
    setTimeout(function (){
        keysEnabled = true;
        loaderWrapper.classList.add("display-none");
    }, moviesCurrentIds.length * moviesCurrentIds.length * 10);
}

function onMovieChange() {
    var currentMovie = moviesMenu.getCurrentMovie();
    var screenMiddle = window.innerWidth * .5;
    moviesLine.style.transform = "translateX(" + (screenMiddle
        - (moviesMenu.lastSelectedTab.index)*(185)
        - (movieCards[moviesMenu.lastSelectedTab.index].offsetWidth*1.3)/2 - 4) + "px)";

    movieTitle.innerText = currentMovie.getMovieTitle();
    movieInfo.innerHTML = currentMovie.getMovieInfo();
    bgContainer.style.backgroundImage = "url('"+currentMovie.imageBg+"')";
    interfaceContainer.style.backgroundImage = "url('./img/black-bg-opacity-50.png')";
}