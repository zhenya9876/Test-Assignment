var elements = [];
var elementNodes = [];
var currentNode;
window.onload = init;
function init () {
    elements[0] = document.getElementById('elem1');
    elements[1] = document.getElementById('elem2');
    elements[2] = document.getElementById('elem3');
    elements[3] = document.getElementById('elem4');
    elements[4] = document.getElementById('elem-cont1');

    elementNodes.push(new ElementNode(0, elements[0].id, -1, 4, -1, -1));

    elementNodes.push(new ElementNode(1, elements[1].id, -1, 2, 3, 0));
    elementNodes.push(new ElementNode(2, elements[2].id, -1, -1, -1, 1));
    elementNodes.push(new ElementNode(3, elements[3].id, 1, -1, -1, 0));
    elementNodes.push(new ElementNode(4, elements[4].id, -1, -1, -1, 0));

    elementNodes[4].addChild(elementNodes[1].id);
    elementNodes[4].addChild(elementNodes[2].id);
    elementNodes[4].addChild(elementNodes[3].id);
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
        elementNodes[childNodeId].parentId = this.id;
    }
    this.findNextNodeId = function (direction) {
        var resultId;
        switch (direction){
            case 0: //top
                resultId = this.nodeTop;
                break;
            case 1: //right
                resultId = this.nodeRight;
                break;
            case 2: //bottom
                resultId = this.nodeBottom;
                break;
            case 3: //left
                resultId = this.nodeLeft;
                break;
        }
        if(resultId !== -1){
            var tempNode = elementNodes[resultId];
            if(tempNode.childrenNodesIds.length === 0) { // if target is also a leaf
                return resultId;
            } else {    //if target is not a leaf - go down to a leaf
                while(tempNode.childrenNodesIds.length !== 0) {
                    if (tempNode.lastSelectedChildId !== -1) {
                        tempNode = elementNodes[tempNode.lastSelectedChildId];
                    }
                    else tempNode = elementNodes[tempNode.childrenNodesIds[0]];
                }
                return tempNode.id;
            }
        }
        return -1;
    }
    this.goToNode = function (goToId){
        if(goToId !== -1) {
            var tempNode = elementNodes[this.id];
            while(tempNode.parentId !== -1) {
                elementNodes[tempNode.parentId].lastSelectedChildId = tempNode.id;
                tempNode = elementNodes[tempNode.parentId];
            }
            //this.lastSelectedChildId = currentNode.id;
            elements[currentNode.id].classList.remove("selected");
            // if we move to a Single node (leaf)
            if (elementNodes[goToId].childrenNodesIds.length === 0){
                currentNode = elementNodes[goToId];
                elements[currentNode.id].classList.add("selected");
            } else {
                // if there is a lastSelectedChild - move to it, otherwise go to 1st child
                if (elementNodes[goToId].lastSelectedChildId !== -1)
                currentNode.goToNode(elementNodes[goToId].lastSelectedChildId);
                else currentNode.goToNode(elementNodes[goToId].childrenNodesIds[0]);
            }
        }
    }
}

// Key Press Handler
document.onkeydown = function onKeyDown(ev) {
    if (currentNode === undefined && elementNodes.length !== 0
        && ev.keyCode >= 37 && ev.keyCode <= 40){
        currentNode = elementNodes[0];
        elements[currentNode.id].classList.add("selected");
    } else {
        switch (ev.keyCode) {
            case 38:    //top
                currentNode.goToNode(currentNode.findNextNodeId(0));
                break;
            case 39:    //right
                currentNode.goToNode(currentNode.findNextNodeId(1));
                break;
            case 40:    //bottom
                currentNode.goToNode(currentNode.findNextNodeId(2));
                break;
            case 37:    //left
                currentNode.goToNode(currentNode.findNextNodeId(3))
                break;
        }
    }
    console.log(currentNode);
}