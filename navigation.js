var genresNodeId;
var moviesNodeId;

document.addEventListener('pageLoad', initNodes);
//
function initNodes () {
    movieGenresCount = movieGenres.length;
    elementNodes = new ElementNodes();
    elementNodes.addNode("menu-center", -1, 1, 6, -1);
    elementNodes.addNode("menu-settings", -1, -1, -1, 5);
    elementNodes.addNode("menu-search", -1, 3, 6, -1);
    elementNodes.addNode("menu-live", -1, 4, 6, 2);
    elementNodes.addNode("menu-vod", -1, 5, 6, 3);
    elementNodes.addNode("menu-apps", -1, 1, 6, 4);

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
        elementNodes.addNode(movieGenres[i], 0, newNodeRight, newNodeBottom, newNodeLeft);
        elementNodes.nodes[genresNodeId].addChild(elementNodes.nodes.length - 1);
    }
    navElements[navElements.length] = moviesLine;
    moviesNodeId = navElements.length-1;
    elementNodes.addNode(moviesLine.id, 6,-1,-1,-1);

    //  declaration of the first focusable element
    //  currentNode = elementNodes.nodes[2];
    document.addEventListener('genreChange', onGenreChange);
    document.addEventListener('movieChange', onMovieChange);
    window.addEventListener("keydown", onKeyDown);
}
function ElementNodes(){
    this.lastId = 0;
    this.nodes = [];
    this.addNode = function (name, nodeTop, nodeRight, nodeBottom, nodeLeft) {
        this.nodes.push(new ElementNode(this.lastId, name, nodeTop, nodeRight, nodeBottom, nodeLeft));
        this.lastId++;
    };
    this.removeNodes = function (startNodeId, removeCount) {
        var oldLength = this.nodes.length;
        this.nodes.splice(startNodeId,removeCount);
        this.lastId -= oldLength - this.nodes.length;
    };
    // this.getNodeByName = function (name) {
    //     return this.nodes.filter(function (name) {
    //
    //     });
    // }
}
// Element Node Object Constructor
function ElementNode(id, name, nodeTop, nodeRight, nodeBottom, nodeLeft) {
    this.id = id;
    this.name = name;
    this.nodeTop = nodeTop;
    this.nodeRight = nodeRight;
    this.nodeBottom = nodeBottom;
    this.nodeLeft = nodeLeft;
    this.childrenNodesIds = [];
    this.lastSelectedChildId = -1;
    this.parentId = -1;

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

            // console.log(currentNode);
            // console.log(navElements[currentNode.id]);
        }
    }
}

function onSelectionChange(goToId) {

    var styleToAddNext, isGenreChanged = false, isMovieChanged = false;
    var nextElementClass = navElements[goToId].classList[0];
    var prevElementParentId = navElements[currentNode.parentId].id;

    //  determine element's container id, to know which style to remove
    switch (prevElementParentId) {
        case "menu-center":
            if (nextElementClass !== "menu-tab") {
                for (var i = 0; i < menuTabs.length; i++) {
                    menuTabs[i].classList.remove("menu-active");
                }
                if (nextElementClass === "genre") {
                    isGenreChanged = true;
                }
                    navElements[currentNode.id].classList.remove("menu-selected");
                navElements[currentNode.id].classList.add("menu-last-pressed");
            } else {
                navElements[currentNode.id].classList.remove("menu-selected", "menu-last-pressed");
                styleToAddNext = "menu-selected"
            }
            break;
        case "genres-line":
            if (nextElementClass !== "genre") {
                for(var i = 0; i < genreSpans.length; i++) {
                    genreSpans[i].classList.remove("genre-active");
                }
            } else {
                navElements[currentNode.id].classList.remove("genre-selected");
                styleToAddNext = "genre-selected";
            }
            break;
        case "movies-line":
            navElements[currentNode.id].classList.remove("movie-selected");
            break;
    }
    switch (nextElementClass) {
        case "menu-tab":
            for (var i = 0; i < menuTabs.length; i++) {
                menuTabs[i].classList.add("menu-active");
            }
            styleToAddNext = "menu-selected";
            break;
        case "genre":
            if (prevElementParentId !== "genres-line"){
                //genresLine.classList.add("genres-line-active");
                for(var i = 0; i < genreSpans.length; i++) {
                    genreSpans[i].classList.add("genre-active");
                }
            }
            if (prevElementParentId === "genres-line")isGenreChanged = true;
            styleToAddNext = "genre-selected";
            break;
        case "movie-card":
            // isGenreChanged = false;
            isMovieChanged = true;
            styleToAddNext = "movie-selected";
            break;
        default:
            break;
    }
    currentNode = elementNodes.nodes[goToId];
    console.log(currentNode);
    navElements[currentNode.id].classList.add(styleToAddNext);
    if (isGenreChanged) document.dispatchEvent(genreChange);
    if (isMovieChanged) document.dispatchEvent(movieChange);

    //  underline & translating logic
    var screenMiddle = window.innerWidth * .5;
    var genresBounds = genresLine.getBoundingClientRect();
    var moviesBounds = moviesLine.getBoundingClientRect();
    if (nextElementClass === "genre") {
        var genresLeftGuide = window.innerWidth * leftGuide;
        var genresLeftMargin = navElements[currentNode.id].offsetLeft;
        // for(var i = 0; i < currentNode.id - genresNodeId - 1; i++) {
        //     genresLeftMargin += genreSpans[i].offsetW + parseFloat(genreSpans[i].marginLeft);
        // }
        underline1.classList.add("display-none");

        genresLine.style.transform = "translateX(" + (genresLeftGuide - genresLeftMargin) + "px)";

        if (prevElementParentId !== "movies-line")
            moviesLine.style.transform = "translateX(" + (screenMiddle
            - (185)/2) + "px)";
        else {
            moviesLine.style.transform += "translateX(" + 21.25 + "px)";
            underline2.classList.add("display-none");
        }
        underline1.style.width = navElements[currentNode.id].offsetWidth * 1.5 + "px";
        underline1.style.top = genresBounds.bottom+"px";
        setTimeout(function (){
            underline1.style.left = -genreSpans[currentNode.id-genresNodeId-1].offsetWidth * .13
                + genreSpans[currentNode.id-genresNodeId-1].getBoundingClientRect().left + "px";
            underline1.classList.remove("display-none");
            underline2.classList.add("display-none");
            }, 300);
    }
    else if (nextElementClass === "movie-card"){
        if (prevElementParentId !== "movies-line") underline1.classList.add("display-none");
        moviesLine.style.transform = "translateX(" + (screenMiddle
            - (currentNode.id-moviesNodeId-1)*(185)
            - navElements[currentNode.id].offsetWidth*1.3/2) + "px)";
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