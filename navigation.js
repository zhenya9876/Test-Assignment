// var navElements = [];
// var elementNodes;
// var currentNode;
// window.addEventListener("load", initNodes);

document.addEventListener('pageLoad', initNodes);
function initNodes () {
    movieGenresCount = movieGenres.length;
    elementNodes = new ElementNodes();
    elementNodes.addNode("menu-center", -1, 1, 6, -1);
    elementNodes.addNode("menu-settings", -1, -1, -1, 0);
    elementNodes.addNode("menu-search", -1, 3, 6, -1);
    elementNodes.addNode("menu-live", -1, 4, 6, 2);
    elementNodes.addNode("menu-vod", -1, 5, 6, 3);
    elementNodes.addNode("menu-apps", -1, 1, 6, 4);

    elementNodes.nodes[0].addChild(2);
    elementNodes.nodes[0].addChild(3);
    elementNodes.nodes[0].addChild(4);
    elementNodes.nodes[0].addChild(5);

    //  6th node - genres-line
    var genresNodeId = elementNodes.nodes.length;
    elementNodes.addNode("genres-line", 0, -1,
        elementNodes.nodes.length + movieGenresCount, -1);
    //  automatic genres node creation
    for (var i = 0; i < movieGenresCount; i++) {
        var newNodeLeft = (i === 0) ? - 1 : elementNodes.nodes.length - 1;
        var newNodeBottom;
        if (i === 0) newNodeBottom = elementNodes.nodes.length + movieGenresCount;
        var newNodeRight = (i === (movieGenresCount - 1)) ? -1 : elementNodes.nodes.length + 1;
        elementNodes.addNode(movieGenres[i], 0, newNodeRight, newNodeBottom, newNodeLeft);
        elementNodes.nodes[genresNodeId].addChild(elementNodes.nodes.length - 1);
    }
    //  auto movie-cards nodes creation
    var moviesNodeId = elementNodes.nodes.length;
    elementNodes.addNode("movies", 6, -1, -1,-1);
    for (var i = 0; i < movieCards.length; i++) {
        newNodeLeft = (i === 0) ? - 1 : elementNodes.nodes.length - 1;
        newNodeRight = (i === (movieGenresCount - 1)) ? -1 : elementNodes.nodes.length + 1;
        elementNodes.addNode("movie-card-" + i, genresNodeId, newNodeRight, -1,newNodeLeft);
        elementNodes.nodes[moviesNodeId].addChild(elementNodes.nodes.length - 1);
    }
    //  declaration of the first focusable element
    // currentNode = elementNodes.nodes[2];
    window.addEventListener("keydown", onKeyDown);
}
function ElementNodes(){
    this.lastId = 0;
    this.nodes = [];
    this.addNode = function (name, nodeTop, nodeRight, nodeBottom, nodeLeft) {
        this.nodes.push(new ElementNode(this.lastId, name, nodeTop, nodeRight, nodeBottom, nodeLeft));
        this.lastId++;
    };
    this.removeNode = function (nodeId) {
        this.nodes.splice(this.nodes.indexOf(nodeId),1);
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

            console.log(currentNode);
            console.log(navElements[currentNode.id]);
        }
    }
}

function onSelectionChange(goToId) {
    // var styleToRemove, styleToAdd;
    // switch (navElements[currentNode.id].id) {
    //     case :
    // }
    navElements[currentNode.id].classList.remove("selected");
    currentNode = elementNodes.nodes[goToId];
    navElements[currentNode.id].classList.add("selected");
}

// Key Press Handler
function onKeyDown(ev) {
    if (currentNode === undefined && elementNodes.nodes.length !== 0
        && ev.keyCode >= 37 && ev.keyCode <= 40){
        currentNode = elementNodes.nodes[2];
        navElements[currentNode.id].classList.add("selected");
    } else {
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