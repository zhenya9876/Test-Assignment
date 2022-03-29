var genresNodeId;
var moviesNodeId;

document.addEventListener('pageLoad', initNodes);
//  Nav Nodes creation for menubar, genre-line, genres and movie-line
function initNodes () {
    movieGenresCount = movieGenres.length;
    elementNodes = new ElementNodes();
    elementNodes.addNode("menu-center", -1, 1, 6, -1);
    elementNodes.addNode("menu-settings", -1, -1, -1, 5,
        "menu-selected", "menu-inactive", "menu-active", "menu-last-pressed");
    elementNodes.addNode("menu-search", -1, 3, 6, -1,
        "menu-selected", "menu-inactive", "menu-active", "menu-last-pressed");
    elementNodes.addNode("menu-live", -1, 4, 6, 2,
        "menu-selected", "menu-inactive", "menu-active", "menu-last-pressed");
    elementNodes.addNode("menu-vod", -1, 5, 6, 3,
        "menu-selected", "menu-inactive", "menu-active", "menu-last-pressed");
    elementNodes.addNode("menu-apps", -1, 1, 6, 4,
        "menu-selected", "menu-inactive", "menu-active", "menu-last-pressed");

    elementNodes.nodes[0].addChild(1);
    elementNodes.nodes[0].addChild(2);
    elementNodes.nodes[0].addChild(3);
    elementNodes.nodes[0].addChild(4);
    elementNodes.nodes[0].addChild(5);

    //  6th node - genres-line
    genresNodeId = elementNodes.nodes.length;
    elementNodes.addNode("genres-line", 0, -1,
        elementNodes.nodes.length + movieGenresCount, -1);
    //  genres node creation
    for (var i = 0; i < movieGenresCount; i++) {
        var newNodeLeft = (i === 0) ? - 1 : elementNodes.nodes.length - 1;
        var newNodeBottom;
        if (i === 0) newNodeBottom = elementNodes.nodes.length + movieGenresCount;
        var newNodeRight = (i === (movieGenresCount - 1)) ? -1 : elementNodes.nodes.length + 1;
        elementNodes.addNode(movieGenres[i], 0, newNodeRight, newNodeBottom, newNodeLeft,
            "genre-selected", null, "genre-active", null);
        elementNodes.nodes[genresNodeId].addChild(elementNodes.nodes.length - 1);
    }
    navElements[navElements.length] = moviesLine;
    moviesNodeId = navElements.length-1;
    elementNodes.addNode(moviesLine.id, 6,-1,-1,-1);

    //  declaration of the first focusable element
    // currentNode = elementNodes.nodes[2];
    document.addEventListener('genreChange', onGenreChange);
    document.addEventListener('movieChange', onMovieChange);
    window.addEventListener("keydown", onKeyDown);
}
//  Element Nodes collection Object
function ElementNodes(){
    this.lastId = 0;
    this.nodes = [];
    this.addNode = function (name, nodeTop, nodeRight, nodeBottom, nodeLeft,
                             selectedClass, inactiveClass, activeClass, wasSelectedClass) {
        this.nodes.push(new ElementNode(this.lastId, name, nodeTop, nodeRight, nodeBottom, nodeLeft,
            selectedClass, inactiveClass, activeClass, wasSelectedClass));
        this.lastId++;
    };
    this.removeNodes = function (startNodeId, removeCount) {
        var oldLength = this.nodes.length;
        this.nodes.splice(startNodeId,removeCount);
        this.lastId -= oldLength - this.nodes.length;
    };
}
//  Element Node Object Constructor
function ElementNode(id, name, nodeTop, nodeRight, nodeBottom, nodeLeft,
                        selectedClass, inactiveClass, activeClass, wasSelectedClass) {
    this.id = id;
    this.name = name;
    this.nodeTop = nodeTop;
    this.nodeRight = nodeRight;
    this.nodeBottom = nodeBottom;
    this.nodeLeft = nodeLeft;
    this.childrenNodesIds = [];
    this.lastSelectedChildId = -1;
    this.parentId = -1;
    this.selectedClass = selectedClass;
    this.inactiveClass = inactiveClass;
    this.activeClass = activeClass;
    this.wasSelectedClass = wasSelectedClass;

    this.addChild = function (childNodeId) {
        this.childrenNodesIds.push(childNodeId);
        elementNodes.nodes[childNodeId].parentId = this.id;
    }
    this.removeChild = function (childNodeId){
        this.childrenNodesIds.splice(
            this.childrenNodesIds.indexOf(elementNodes.nodes[childNodeId]), 1);
        if (this.lastSelectedChildId === childNodeId) this.lastSelectedChildId = -1;
    }
    this.goToNode = function (goToId){
        if(goToId !== -1) {
            var tempNode = elementNodes.nodes[this.id];
            // here we go up a branch to record the last selected children of nodes we are leaving
            while(tempNode.parentId !== -1) {
                elementNodes.nodes[tempNode.parentId].lastSelectedChildId = tempNode.id;
                tempNode = elementNodes.nodes[tempNode.parentId];
            }
            tempNode = elementNodes.nodes[goToId];
            // then we go down a target branch selecting either previously recorded last selected child
            // either first child, to determine the target leaf
            while(tempNode.childrenNodesIds.length !== 0) {
                if (tempNode.lastSelectedChildId !== -1) {
                    tempNode = elementNodes.nodes[tempNode.lastSelectedChildId];
                }
                else tempNode = elementNodes.nodes[tempNode.childrenNodesIds[0]];
            }
            goToId = tempNode.id;
            onSelectionChange(goToId);
        }
    }
}

function onSelectionChange(goToId) {
    var styleToAddNext, isGenreChanged = false, isMovieChanged = false;
    //  determine element's container id, and next element's class
    //  to know which style to remove and add
    var currentId = currentNode.id;
    var nextElementClass = navElements[goToId].classList[0];
    var prevElementParentId = navElements[currentNode.parentId].id;

    switch (prevElementParentId) {
        case "menu-center":
            isGenreChanged = true;
            if (nextElementClass === "genre") {
                for (var i = 0; i < menuTabs.length; i++) {
                    menuTabs[i].classList.remove(elementNodes.nodes[currentId].activeClass);
                }
                navElements[currentId].classList.add(elementNodes.nodes[currentId].wasSelectedClass);
                for (var i = 0; i < genreSpans.length; i++){
                    genreSpans[i].classList.add(elementNodes.nodes[goToId].activeClass);
                }
            }
            break;
        case "genres-line":
            if (nextElementClass === "genre") {
                isGenreChanged = true;
            } else {
                for (var i = 0; i < genreSpans.length; i++){
                    genreSpans[i].classList.remove(elementNodes.nodes[currentId].activeClass);
                }
            }
            if (nextElementClass === "menu-tab") {
                for (var i = 0; i < menuTabs.length; i++) {
                    menuTabs[i].classList.remove(elementNodes.nodes[goToId].wasSelectedClass);
                    menuTabs[i].classList.add(elementNodes.nodes[goToId].activeClass);
                }
            } else if (nextElementClass === "movie-card") {
                isMovieChanged = true;
            }
            break;
        case "movies-line":
            if (nextElementClass === "movie-card"){
                isMovieChanged = true;
            } else {
                for (var i = 0; i < genreSpans.length; i++){
                    genreSpans[i].classList.add(elementNodes.nodes[goToId].activeClass);
                }
            }
            break;
        default:
            break;
    }
    navElements[currentId].classList.remove(elementNodes.nodes[currentId].selectedClass);
    navElements[goToId].classList.add(elementNodes.nodes[goToId].selectedClass);

    currentNode = elementNodes.nodes[goToId];
    navElements[goToId].classList.add(styleToAddNext);
    if (isGenreChanged) document.dispatchEvent(genreChange);
    if (isMovieChanged) document.dispatchEvent(movieChange);

    //  underline & translating logic
    var screenMiddle = window.innerWidth * .5;
    var genresBounds = genresLine.getBoundingClientRect();
    var moviesBounds = moviesLine.getBoundingClientRect();
    if (nextElementClass === "genre") {
        var genresLeftGuide = window.innerWidth * leftGuide;
        var genresLeftMargin = navElements[goToId].offsetLeft;

        underline1.classList.add("display-none");

        genresLine.style.transform = "translateX(" + (genresLeftGuide - genresLeftMargin) + "px)";

        if (prevElementParentId !== "movies-line")
            moviesLine.style.transform = "translateX(" + (screenMiddle - (195)/2 + 2.875) + "px)";
        else {
            moviesLine.style.transform += "translateX(" + 23.125 + "px)";
            underline2.classList.add("display-none");
        }
        underline1.style.width = navElements[goToId].offsetWidth * 1.5 + "px";
        underline1.style.top = genresBounds.bottom+"px";
        setTimeout(function (){
            underline1.style.left = -genreSpans[goToId-genresNodeId-1].offsetWidth * .13
                + genreSpans[goToId-genresNodeId-1].getBoundingClientRect().left + "px";
            underline1.classList.remove("display-none");
            underline2.classList.add("display-none");
            }, 300);
    }
    else if (nextElementClass === "movie-card"){
        if (prevElementParentId !== "movies-line") underline1.classList.add("display-none");
        moviesLine.style.transform = "translateX(" + (screenMiddle
            - (goToId -moviesNodeId-1)*(185)
            - (navElements[goToId].offsetWidth*1.3)/2 - 4) + "px)";
        underline2.style.top = 8 + moviesBounds.bottom+"px";
        underline2.style.width = 284 + "px";
        setTimeout(function (){
            // underline.style.left = -movieCards[currentNode.id-moviesNodeId-1].offsetWidth * .13
            //     + genreSpans[currentNode.id-moviesNodeId-1].getBoundingClientRect().left + "px";
            underline2.style.left = screenMiddle - 142 + "px";
            underline2.classList.remove("display-none");
        }, 300);
    }
}

// Key Press Handler
function onKeyDown(ev) {
    if (currentNode === undefined && elementNodes.nodes.length !== 0
        && ev.keyCode >= 37 && ev.keyCode <= 40){
        currentNode = elementNodes.nodes[2];
        onSelectionChange(2);
    } else if (keysEnabled) {
        switch (ev.keyCode) {
            case 38:    //top
                currentNode.goToNode(currentNode.nodeTop);
                break;
            case 39:    //right
                currentNode.goToNode(currentNode.nodeRight);
                break;
            case 40:    //bottom
                currentNode.goToNode(currentNode.nodeBottom);
                break;
            case 37:    //left
                currentNode.goToNode(currentNode.nodeLeft)
                break;
        }
    }
}