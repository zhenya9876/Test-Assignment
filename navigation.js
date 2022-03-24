var elements = [];
var elementNodes;
var currentNode;
window.onload = init;
function init () {
    elements[0] = document.getElementById('elem1');
    elements[1] = document.getElementById('elem2');
    elements[2] = document.getElementById('elem3');
    elements[3] = document.getElementById('elem4');
    elements[4] = document.getElementById('elem-cont1');

    elementNodes = new ElementNodes();
    elementNodes.addNode(elements[0].id, -1, 4, -1, -1);

    elementNodes.addNode(elements[1].id, -1, 2, 3, 0);
    elementNodes.addNode(elements[2].id, -1, -1, -1, 1);
    elementNodes.addNode(elements[3].id, 1, -1, -1, 0);
    elementNodes.addNode(elements[4].id, -1, -1, -1, 0);

    elementNodes.nodes[4].addChild(elementNodes.nodes[1].id);
    elementNodes.nodes[4].addChild(elementNodes.nodes[2].id);
    elementNodes.nodes[4].addChild(elementNodes.nodes[3].id);
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
    this.getNodeByName = function (name) {
        return this.nodes.filter(function (name) {

        });
    }
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
        this.childrenNodesIds.push(childNodeId)
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
            elements[currentNode.id].classList.remove("selected");
            currentNode = elementNodes.nodes[goToId];
            elements[currentNode.id].classList.add("selected");
        }
    }
}

// Key Press Handler
document.onkeydown = function onKeyDown(ev) {
    if (currentNode === undefined && elementNodes.nodes.length !== 0
        && ev.keyCode >= 37 && ev.keyCode <= 40){
        currentNode = elementNodes.nodes[0];
        elements[currentNode.id].classList.add("selected");
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