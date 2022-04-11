// window.addEventListener("load", initPage);
window.onload = initPage;
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
var player;

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
var playerMenu;

var stb;
var stbEvent;
var videoInfo;
var debugText;
var j;
var moviesNewMargin;
var commonInterQueue = [];

//  init elements and put 'em in navElements array, except for movie cards
//  they're loaded every time genre changes
function initPage(){

    debugText = document.getElementById("debug-text");
    try{stb = gSTB;
        stbEvent.onEvent = onStbEvent(event);}
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
    player = document.getElementById("player");
    player.style.display = 'none';
    keysEnabled = true;

    loaderWrapper.style.display = 'none';
    initTopMenu();
    initGenresMenu();
    initMoviesMenu();
    initPlayer();
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

        genresMenu.lastSelectedTab.underlineElement.style.display = '';
        if (moviesMenu.menuTabs.length !== 0) {
            moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
        changeMovieFocus(moviesMenu, null);}
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
        newUnderline.style.display = 'none';
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
        this.lastSelectedTab.underlineElement.style.display = 'none';
        if(this.selectPrev()) {
            onGenreChange();
            if (moviesMenu.menuTabs.length !== 0) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
            // changeMovieFocus();
        }
        this.lastSelectedTab.underlineElement.style.display = '';
    }
    genresMenu.pressRight = function () {
        this.lastSelectedTab.underlineElement.style.display = 'none';
        if (this.selectNext()) {
            onGenreChange();
            if (moviesMenu.menuTabs.length !== 0) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
            // changeMovieFocus();
        }
        this.lastSelectedTab.underlineElement.style.display = '';
    }
    genresMenu.pressUp = function () {
        focusedMenu = menuCenterObj;
        this.lastSelectedTab.isFocused = false;
        this.lastSelectedTab.underlineElement.style.display = 'none';
        Helper.removeClassForObject(genresMenu.lastSelectedTab.element, "selected");
        genresMenu.deactivate();
        menuCenterObj.activate();
        menuRightObj.activate();
        Helper.removeClassForObject(menuCenterObj.lastSelectedTab.element, "last-pressed");
        Helper.removeClassForObject(menuRightObj.lastSelectedTab.element, "selected");
        focusedElement = focusedMenu.lastSelectedTab;
    }
    genresMenu.pressDown = function () {
        this.lastSelectedTab.underlineElement.style.display = 'none';
        this.deactivate();
        Helper.addClassForObject(this.lastSelectedTab.element,"selected");
        focusedMenu = moviesMenu;
        // if (!moviesMenu.isMenuEntered) moviesMenu.lastSelectedTab = moviesMenu.menuTabs[0];
        focusedElement = moviesMenu.lastSelectedTab;
        moviesMenu.changeFocusInside(moviesMenu.lastSelectedTab);
        moviesMenu.lastSelectedTab.underlineElement.style.display = '';
        // debugText.innerText = "changed focus to "+ focusedMenu.lastSelectedTab.idName;
        changeMovieFocus(moviesMenu, null, true);
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
        genresMenu.activate();
        genresMenu.lastSelectedTab.underlineElement.style.display = '';
        focusedMenu = genresMenu;
        focusedElement = focusedMenu.lastSelectedTab;
        changeMovieFocus(this, null, false);
        this.lastSelectedTab.underlineElement.style.display = 'none';
        Helper.removeClassForObject(this.lastSelectedTab.element,"selected");
    }
    moviesMenu.pressLeft = function () {
        if(this.canSelectPrev()) {
            this.lastSelectedTab.underlineElement.style.display = 'none';
            changeMovieFocus(this, false, false);
            this.lastSelectedTab.underlineElement.style.display = '';
        }
    }
    moviesMenu.pressRight = function () {
        if(this.canSelectNext()) {
            this.lastSelectedTab.underlineElement.style.display = 'none';
            changeMovieFocus(this, true, false);
            this.lastSelectedTab.underlineElement.style.display = '';
        }
    }
    moviesMenu.pressEnter = function () {
        focusedMenu = playerMenu;
        playerMenu.element.style.display = '';
        debugText.innerText = 'player showed';
        stb.InitPlayer();
        stb.SetPIG(playerMenu.playerMode, 0, 0, 0);
        stb.EnableServiceButton(true);
        stb.SetVideoControl(0);
        stb.EnableVKButton(false);
        stb.EnableVKButton(0);
        stb.Play("auto " + playerMenu.videos[playerMenu.currentVideo]);
        playerMenu.currentAspect = 0;
        stb.SetPosTime(playerMenu.playPosition);
        // setTimeout(, 300);
        updatePIG();
    }
}
function initPlayer() {
    playerMenu = new MenuObject(player.id, player);
    playerMenu.playerMode = 1;
    playerMenu.playSpeed = 1;
    playerMenu.rewindSpeed = 4;
    playerMenu.currentAspect = 0;
    playerMenu.playPosition = 0;
    playerMenu.soundVolume = 100;
    playerMenu.videos = [
        "http://192.168.0.102:80/videos/Moby.mp4",
        "http://192.168.0.102:80/videos/Evolution.mp4"
    ];
    playerMenu.currentVideo = 0;
    playerMenu.fullAspectRatios =
        ["stretch",
        "letterbox",
        "pan&scan",
        "combined",
            "auto",
            "20:9",
            "16:9",
            "4:3"
        ];

    playerMenu.windowAspectRatios = [
        "auto",
        "20:9",
        "16:9",
        "4:3"];

    playerMenu.pressEnter = function () {
        debugText.innerText = "pressEnter";
        try {
            if(this.playSpeed !== 0) {
                this.playSpeed = 0;
                stb.SetSpeed(this.playSpeed);
                stb.Pause();
            } else {
                this.playSpeed = 1;
                stb.SetSpeed(this.playSpeed);
                stb.SetPosTime(stb.GetPosTime());
                stb.Continue();
            }
        } catch (e) {
            debugText.innerText = "failed player init" + e.message;
        }
    }
    playerMenu.pressLeft = function () {
            if (this.playSpeed > 1) {
                this.playSpeed--;
                stb.SetSpeed(this.playSpeed);
                stb.Continue();
            }
                else {
                    stb.Pause();
                    var goToTime = stb.GetPosTime() - this.rewindSpeed;
                    if(goToTime < 0) goToTime = 0;
                    stb.SetPosTime(goToTime);
                    stb.Continue();
            }
    }
    playerMenu.pressRight = function () {
        if (this.playSpeed < 8) {
            this.playSpeed++;
            stb.SetSpeed(this.playSpeed);
        }
    }
    playerMenu.pressUp = function () {
        if (this.currentVideo === this.videos.length - 1)
        {this.currentVideo = 0}
        else this.currentVideo++;
        this.aspectRatio = 0;
        this.playPosition = 0;
        moviesMenu.pressEnter();
    }
    playerMenu.pressDown = function () {
        if (this.currentVideo === 0)
        {this.currentVideo = this.videos.length - 1}
        else this.currentVideo--;
        this.aspectRatio = 0;
        this.playPosition = 0;
        moviesMenu.pressEnter();
    }
    playerMenu.pressExit = function () {
        focusedMenu = moviesMenu;
        stb.Stop();
        stb.DeinitPlayer();
        this.currentAspect = 0;
        this.playPosition = 0;
        playerMenu.element.style.display = 'none';
    }
    playerMenu.pressAspect = function () {
        var aspectsLen;
        if (this.playerMode === 0) aspectsLen = this.windowAspectRatios.length;
        else aspectsLen = this.fullAspectRatios.length;
            if (this.currentAspect >= aspectsLen - 1)
            {this.currentAspect = 0}
            else this.currentAspect++;
            var currentAspectName; if (this.playerMode === 0)
            currentAspectName = this.windowAspectRatios[this.currentAspect]
                else currentAspectName = this.fullAspectRatios[this.currentAspect];
            var currentAspectCode = 0x20;
            switch (currentAspectName) {
                case "stretch":
                    currentAspectCode = 0x20;
                    break;
                case "letterbox":
                    currentAspectCode = 0x30;
                    break;
                case "pan&scan":
                    currentAspectCode = 0x40;
                    break;
                case "combined":
                    currentAspectCode = 0x50;
                    break;
                case "auto":
                    currentAspectCode = 0x02;
                    break;
                case "20:9":
                    currentAspectCode = 0x03;
                    break;
                case "16:9":
                    currentAspectCode = 0x00;
                    break;
                case "4:3":
                    currentAspectCode = 0x10;
                    break;
            }
        stb.SetAspect(currentAspectCode);
        updatePIG();
    }
    playerMenu.pressBack = function () {
        if (this.playerMode === 0)
        this.playerMode = 1;
        else this.playerMode = 0;
        this.playPosition = stb.GetPosTime();
        videoInfo = eval('['+stb.GetVideoInfo()+']');
        var width =  parseInt(videoInfo[0]['pictureWidth']);
        var height =  parseInt(videoInfo[0]['pictureHeight']);
        debugText.innerText = videoInfo[0]['pictureWidth'];
        stb.SetPIG(playerMenu.playerMode, 128, 1280 - .5*width, 720 - .5*height);
        stb.SetPosTime(playerMenu.playPosition);
    }
    playerMenu.pressVolMinus = function () {
        this.soundVolume = parseInt(stb.GetVolume()) - 10;
        if (this.soundVolume < 0) this.soundVolume = 0;
        stb.SetVolume(parseInt(this.soundVolume));
        debugText.innerText = 'vol: '+ this.soundVolume;
    }
    playerMenu.pressVolPlus = function () {
        this.soundVolume = parseInt(stb.GetVolume()) + 10;
        if (this.soundVolume > 100) this.soundVolume = 100;
        stb.SetVolume(this.soundVolume);
        debugText.innerText = 'vol: '+ this.soundVolume;
    }
    playerMenu.pressService = function () {
        stb.SetVideoState(0);
        stb.DeinitPlayer();
        debugText.innerText = 'service pressed';
    }
}
function updatePIG() {
    videoInfo = eval('['+stb.GetVideoInfo()+']');
    var hPAR = parseInt(videoInfo[0]['hPAR']);
    var vPAR = parseInt(videoInfo[0]['vPAR']);
    var width =  parseInt(videoInfo[0]['pictureWidth']);
    var height =  parseInt(videoInfo[0]['pictureHeight']);
    var aspectCoef = (width*hPAR/vPAR)/height;
    // debugText.innerText = aspectCoef;
    stb.SetPIG(playerMenu.playerMode, 128, 1280 - .5 * width, 720 - .5*height);
}
function onStbEvent(data) {
    var eventCode = parseInt(data);
    switch (eventCode) {
        case 1:
            focusedMenu = moviesMenu;
            stb.Stop();
            stb.DeinitPlayer();
            break;
        case 7:
            updatePIG();
            debugText.innerText = 'video info detected';
            break;
        case 0x20:
            alert('HDMI is connected');
            break;
        case 0x21:
            alert('HDMI is disconnected');
            break;
    }
}
//  when genre changes need to update current movie cards
function onGenreChange() {
    //  for the movies loading time we turn off the keys and show a loader overlay
    keysEnabled = false;
    loaderWrapper.style.display = '';

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
        newUnderline.style.display = 'none';
        newMovieCard.style.backgroundImage = "url('"+movies[moviesCurrentIds[i]].image+"')";
        // newMovieCard.style.backgroundImage = "url('./img/icon-more.png')";
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

    moviesLine.style.left = (screenMiddle - (185)/2) + "px"; //+2.875
    //  long loading simulation
    setTimeout(function (){
        loaderWrapper.style.display = 'none';
    keysEnabled = true;
    }, (moviesCurrentIds.length ? moviesCurrentIds * moviesCurrentIds.length * 10 : 0));
}

function changeMovieFocus(menu, isNext, isFirst) {
    var currTabIndex = menu.lastSelectedTab.index;
    // movieCards[currTabIndex].style.backgroundImage =
    //     "url('"+movies[moviesCurrentIds[currTabIndex]].imageSmall + "')";
    var nextTabIndex;
    switch(isNext){
        case null:
            nextTabIndex = currTabIndex;
            break;
        case true:
            nextTabIndex = menu.lastSelectedTab.index + 1;
            break;
        case false:
            nextTabIndex = menu.lastSelectedTab.index - 1;
            break;
    }
    if (isNext !== null || isFirst){
        menu.changeFocusInside(menu.menuTabs[nextTabIndex]);
        refreshMovieInfo();
        moviesMenu.lastSelectedTab.underlineElement.style.display = '';
    }
    // movieCards[nextTabIndex].style.backgroundImage = "url('"+movies[moviesCurrentIds[nextTabIndex]].image+"')";
    // var moviesOldMargin = parseInt(moviesLine.style.left);
    var moviesMarginLeft = menu.lastSelectedTab.isFocused ? 20 : 5;
    var lastSelectedCardWidth = (menu.lastSelectedTab.isFocused) ? 112 : 87.5;
    var screenMiddle = window.innerWidth * .5;
    moviesNewMargin = screenMiddle - menu.lastSelectedTab.index*185
                - lastSelectedCardWidth
                // - movieCards[menu.lastSelectedTab.index].offsetWidth/2
                - moviesMarginLeft;
    moviesLine.style.left = moviesNewMargin+'px';
}

function refreshMovieInfo() {
    var currentMovie = moviesMenu.getCurrentMovie();
    movieTitle.innerText = currentMovie.getMovieTitle();
    movieInfo.innerHTML = currentMovie.getMovieInfo();
}
