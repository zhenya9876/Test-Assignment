var elements = [];
var elementNodes = [];
var currentNode;
window.onload = init;
function init () {
    elements[0] = document.getElementById('elem1');
    elements[1] = document.getElementById('elem2');
    elements[2] = document.getElementById('elem3');
    elements[3] = document.getElementById('elem4');

    elementNodes.push(new ElementNode(0, elements[0].id, -1, 1, -1, -1));
    elementNodes.push(new ElementNode(1, elements[1].id, -1, 2, 3, 0));
    elementNodes.push(new ElementNode(2, elements[2].id, -1, -1, -1, 1));
    elementNodes.push(new ElementNode(3, elements[3].id, 1, -1, -1, 0));

}

// Element Node Object Constructor
function ElementNode(id, name, nodeTop, nodeRight, nodeBottom, nodeLeft) {
    this.id = id;
    this.name = name;
    this.nodeTop = nodeTop;
    this.nodeRight = nodeRight;
    this.nodeBottom = nodeBottom;
    this.nodeLeft = nodeLeft;
    this.goToNode = function (goToId){
        if(goToId !== -1) {
            elements[currentNode.id].classList.remove("selected");
            currentNode = elementNodes[goToId];
            elements[currentNode.id].classList.add("selected");
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
    console.log(currentNode);
}