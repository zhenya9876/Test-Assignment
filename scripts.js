// window.addEventListener("load", initPage);
window.onload = initPage;
var stb;
var bgContainer;
var interfaceContainer;
var loaderWrapper;
var leftGuide = 0.15;
var menuTabs = [];
var menuCenter;
var genresLine;
var movieGenresCount;
var genreSpans = [];
var genreSpansOffsets = [];
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

var debugText;
var j;
var moviesNewMargin;
var commonInterQueue = [];

//  init elements and put 'em in navElements array, except for movie cards
//  they're loaded every time genre changes
function initPage(){

    // stb = gSTB;
    debugText = document.getElementById("debug-text");
    try{stb = gSTB;}
    catch (e){}
    // stb.InitPlayer();

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
    // genreChange = new Event('genrechange');
    // window.addEventListener("genreChange", onGenreChange);
    // movieChange = new Event('moviechange');
    // window.addEventListener("movieChange", onMovieChange);
    initTopMenu();
    initGenresMenu();
    initMoviesMenu();
    //  then invoke nodes initialization initNodes() in navigation.js
    initNav();
    debugText.innerText = '';
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
        Helper.addClassForObject(menuCenterObj.lastSelectedTab.element,'last-pressed');
        genresMenu.activate();
        if (genresMenu.lastSelectedTab === null)
            genresMenu.changeFocusInside(genresMenu.menuTabs[0]);
        else genresMenu.changeFocusInside(genresMenu.lastSelectedTab);
        focusedMenu = genresMenu;
        focusedElement = genresMenu.lastSelectedTab;
        Helper.removeClassForObject(genresMenu.lastSelectedTab.underlineElement, 'display-none');
        if (moviesMenu.menuTabs.length !== 0) {
            moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
        onMovieChange();}
        onGenreChange();
    };
    menuCenterObj.pressRight = function (){menuCenterObj.selectNext()};

    menuTabApps.pressRight = function (){
        focusedMenu = menuRightObj;
        this.isFocused = false;
        Helper.removeClassForObject(menuCenterObj.lastSelectedTab.element,"selected");
        menuRightObj.changeFocusInside(menuTabSettings);
    }
    menuTabSettings.pressLeft = function (){
        focusedMenu = menuCenterObj;
        this.isFocused = false;
        Helper.removeClassForObject(menuRightObj.lastSelectedTab.element,"selected");
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
        newGenreContainer.setAttribute('class', 'genre-container');
        newUnderline.setAttribute('class', 'underline');
        Helper.addClassForObject(newUnderline, 'display-none');
        var newSpan = document.createElement("span");
        newSpan.innerText = newSpan.innerHTML = newSpan.textContent = movieGenres[i];
        newSpan.setAttribute('class', 'genre');
        genreSpans[i] = newSpan;
        newGenreContainer.insertAdjacentElement("beforeend", newSpan);
        newGenreContainer.insertAdjacentElement("beforeend", newUnderline);
        genresLine.insertAdjacentElement("beforeend", newGenreContainer);
        var genreTab = new MenuTab("genre-tab-" + i, newSpan);
        genreTab.underlineElement = newUnderline;
        genresMenu.addMenuTab(genreTab);
    }
    genreSpansOffsets[0] = 0;
    for (var i = 1; i < genreSpans.length; i++) {
        genreSpansOffsets[i] = genreSpans[i-1].offsetWidth + 32 + genreSpansOffsets[i-1];
    }
    genresMenu.pressLeft = function () {
        Helper.addClassForObject(this.lastSelectedTab.underlineElement,"display-none");
        if(this.selectPrev()) {
            onGenreChange();
            if (moviesMenu.menuTabs.length !== 0) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
            onMovieChange();
        }
        Helper.removeClassForObject(this.lastSelectedTab.underlineElement,"display-none");
    }
    genresMenu.pressRight = function () {
        Helper.addClassForObject(this.lastSelectedTab.underlineElement,"display-none");
        if (this.selectNext()) {
            onGenreChange();
            if (moviesMenu.menuTabs.length !== 0) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
            onMovieChange();
        }
        Helper.removeClassForObject(this.lastSelectedTab.underlineElement,"display-none");
    }
    genresMenu.pressUp = function () {
        focusedMenu = menuCenterObj;
        this.lastSelectedTab.isFocused = false;
        Helper.addClassForObject(this.lastSelectedTab.underlineElement, "display-none");
        Helper.removeClassForObject(genresMenu.lastSelectedTab.element, "selected");
        genresMenu.deactivate();
        menuCenterObj.activate();
        menuRightObj.activate();
        Helper.removeClassForObject(menuCenterObj.lastSelectedTab.element, "last-pressed");
        Helper.removeClassForObject(menuRightObj.lastSelectedTab.element, "selected");
        focusedElement = focusedMenu.lastSelectedTab;
    }
    genresMenu.pressDown = function () {
        Helper.addClassForObject(this.lastSelectedTab.underlineElement, "display-none");
        this.deactivate();
        Helper.addClassForObject(this.lastSelectedTab.element,"selected");
        focusedMenu = moviesMenu;
        // if (!moviesMenu.isMenuEntered) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
        focusedElement = moviesMenu.lastSelectedTab;
        Helper.removeClassForObject(moviesMenu.lastSelectedTab.underlineElement,"display-none");
        moviesMenu.changeFocusInside(moviesMenu.lastSelectedTab);
        // debugText.innerText = "changed focus to "+ focusedMenu.lastSelectedTab.idName;
        onMovieChange();
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
        // moviesLine.style.transform = "translateX(" + (screenMiddle
        //     - (moviesMenu.lastSelectedTab.index)*(185) - 185/2) + "px";
        this.lastSelectedTab.isFocused = false;
        Helper.addClassForObject(this.lastSelectedTab.underlineElement,"display-none");
        Helper.removeClassForObject(this.lastSelectedTab.element,"selected");
        genresMenu.activate();
        Helper.removeClassForObject(genresMenu.lastSelectedTab.underlineElement,"display-none");
        focusedMenu = genresMenu;
        focusedElement = focusedMenu.lastSelectedTab;
        onMovieChange();
    }
    moviesMenu.pressLeft = function () {
        Helper.addClassForObject(this.lastSelectedTab.underlineElement,"display-none");
        if(this.selectPrev()) {
            // window.dispatchEvent(movieChange);
            onMovieChange();
        }
        Helper.removeClassForObject(this.lastSelectedTab.underlineElement,"display-none");
    }
    moviesMenu.pressRight = function () {
        Helper.addClassForObject(this.lastSelectedTab.underlineElement,"display-none");
        if(this.selectNext()) {
            // window.dispatchEvent(movieChange);
            onMovieChange();
        }
        Helper.removeClassForObject(this.lastSelectedTab.underlineElement,"display-none");
    }
    moviesMenu.pressEnter = function () {
        debugText.innerText = "pressEnter";
            try {
                if(stb.IsPlaying()) {
                    stb.Stop();
                    stb.DeinitPlayer();
                    debugText.innerText = "pressEnter -";
                } else {
                    stb.InitPlayer();
                    stb.SetPIG(1, 0, 0, 0);
                    stb.EnableServiceButton(true);
                    stb.SetVideoControl(0);
                    stb.EnableVKButton(false);
                    stb.EnableVKButton(0);
                stb.Play("auto http://192.168.0.102:80/videos/NGGYU.mp4");
                    debugText.innerText = stb.IsPlaying();
                // stb.Play("ffrt3 https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                }
            } catch (e) {
                playerManager = stbPlayerManager;
                player = this.playerManager.list[0];
                player.fullscreen = true;
                    debugText.innerText = "failed player init" + e.message;
                }
        }
}
//  when genre changes need to update current movie cards
function onGenreChange() {
    //  for the movies loading time we turn off the keys and show a loader overlay
    keysEnabled = false;

    Helper.removeClassForObject(loaderWrapper,"display-none");

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
        newMovieCard.setAttribute('class','movie-card');
        var newUnderline = document.createElement("div");
        // newUnderline.style.backgroundImage = "url('./img/underline.png')";
        newUnderline.setAttribute('class', 'underline');
        Helper.addClassForObject(newUnderline,'display-none');
        newMovieCard.style.backgroundImage = "url('"+movies[moviesCurrentIds[i]].image+"')";
        newMovieCard.insertAdjacentElement("beforeend", newUnderline);
        moviesLine.insertAdjacentElement("beforeend", newMovieCard);
        movieCards[i] = newMovieCard;
        var newMovieTab = new MenuTab("movie-card-"+i, newMovieCard);
        newMovieTab.underlineElement = newUnderline;
        moviesMenu.addMenuTab(newMovieTab);
    }
    var screenMiddle = window.innerWidth * .5;
    var genresLeftGuide = window.innerWidth * leftGuide;
    var genresLeftMargin = genreSpansOffsets[genresMenu.lastSelectedTab.index];

    genresLine.style.left = (genresLeftGuide - genresLeftMargin) + "px";

    // genresLine.style.transform = "translateX(" + (genresLeftGuide - genresLeftMargin) + "px)";

    moviesLine.style.left = (screenMiddle - (185)/2) + "px"; //+2.875
    //  long loading simulation
    setTimeout(function (){
        Helper.addClassForObject(loaderWrapper, "display-none");
    keysEnabled = true;
    }, moviesCurrentIds.length * 10);
}

function onMovieChange() {
    var moviesOldMargin = parseInt(moviesLine.style.left);
    var moviesMarginLeft = moviesMenu.lastSelectedTab.isFocused ? 20 : 5;
    var screenMiddle = window.innerWidth * .5;
    moviesNewMargin = screenMiddle - moviesMenu.lastSelectedTab.index*185
                - movieCards[moviesMenu.lastSelectedTab.index].offsetWidth/2
                - moviesMarginLeft;
        // var interArr = getInterpolationArray(moviesOldMargin, moviesNewMargin);

        var currentMovie = moviesMenu.getCurrentMovie();
        movieTitle.innerText = currentMovie.getMovieTitle();
        movieInfo.innerHTML = currentMovie.getMovieInfo();
        // bgContainer.style.backgroundImage = "url('"+currentMovie.imageBg+"')";

    // pushToQueue(getInterpolationArray(moviesOldMargin, moviesNewMargin), commonInterQueue);
    commonInterQueue = getInterpolationArray(moviesOldMargin, moviesNewMargin);
    j = 0;
    function translateElement(element, interArr){
        setTimeout(function () {
            element.style.left = interArr[j] + "px";
            j++;
            if(j < commonInterQueue.length){
                translateElement(element, interArr);
            }
        },0);
    }
    translateElement(moviesLine, commonInterQueue);
    // debugText.innerText = commonInterQueue.join('\n') + '\n';
}

function getInterpolationArray (start, end) {
    // var interArr = [.29289, 0.19098, .10899, .04894, .01231, 0];
    var interArr = [.18, .09, .045, .02, .01, 0];

    // var interArr = [.2,.16,.1,.04,0];
    // var step = 0.1;
    // var startStep = 0.5;
            for (var i = 0; i < interArr.length; i++) {
                interArr[i]=start * interArr[i] + end * (1-interArr[i]);
            }
    // debugText.innerText = "s: " + start + " e: "+ end;
    // debugText.innerText += "\n" + interArr.join('\n');
    return interArr;
}
// function pushToQueue(array, queue) {
//     debugText.innerText = 'pushing started';
    // for (var i = 0; i < array.length; i++) {
    //     if(queue.length > 6) {
    //         debugText.innerText = "before shift";
    //         queue.shift();
    //         debugText.innerText = "after shift";
    //     }
    //     queue.push(array[i]);
    //     debugText.innerText = "after push";
    // }
// }
