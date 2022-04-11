function initNav () {
    // window.addEventListener("keydown", onKeyDown);

    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
}
var keyCommands = {
    38: 'up',
    39: 'right',
    40: 'down',
    37: 'left',
    13: 'enter',
    8: 'back',
    27: 'exit',
    109: 'vol_minus',
    107: 'vol_plus',
    117: 'aspect',
    120: 'service'
}
// Key Press Handler
function onKeyDown(event) {
    if (focusedElement === undefined
        // && ev.keyCode >= 37 && ev.keyCode <= 40)
    ){
        focusedElement = menuTabSearch;
        menuCenterObj.changeFocusInside(menuTabApps);
        focusedMenu = menuCenterObj;
    } if (keysEnabled) {
        var key;
        if (window.event) {
        key = window.event.keyCode;}
        else {key = event.which;}
        var keyCommand = keyCommands[key];
        switch (keyCommand) {
            case 'up':
                if(focusedElement.pressUp !== null)
                    focusedElement.pressUp();
                else if (focusedMenu.pressUp !== null)
                    focusedMenu.pressUp();
                break;
            case 'right':
                if(focusedElement.pressRight !== null)
                    focusedElement.pressRight();
                else if (focusedMenu.pressRight !== null)
                    focusedMenu.pressRight();
                break;
            case 'down':
                if(focusedElement.pressDown !== null)
                    focusedElement.pressDown();
                else if (focusedMenu.pressDown !== null)
                    focusedMenu.pressDown();
                break;
            case 'left':
                if(focusedElement.pressLeft !== null)
                    focusedElement.pressLeft();
                else if (focusedMenu.pressLeft !== null)
                    focusedMenu.pressLeft();
                break;
            case 'enter':
                if(focusedElement.pressEnter !== null)
                    focusedElement.pressEnter();
                else if (focusedMenu.pressEnter !== null)
                    focusedMenu.pressEnter();
                break;
            case 'back':
                if(focusedElement.pressBack !== null)
                    focusedElement.pressBack();
                else if (focusedMenu.pressBack !== null)
                    focusedMenu.pressBack();
                break;
            case 'exit':
                if(focusedElement.pressExit !== null)
                    focusedElement.pressExit();
                else if (focusedMenu.pressExit !== null)
                    focusedMenu.pressExit();
                break;
            case 'aspect':
                if(focusedElement.pressAspect !== null)
                    focusedElement.pressAspect();
                else if (focusedMenu.pressAspect !== null)
                    focusedMenu.pressAspect();
                break;
            case 'service':
                if(focusedElement.pressService !== null)
                    focusedElement.pressService();
                else if (focusedMenu.pressService !== null)
                    focusedMenu.pressService();
                break;
            case 'vol_minus':
                if(focusedElement.pressVolMinus !== null)
                    focusedElement.pressVolMinus();
                else if (focusedMenu.pressVolMinus !== null)
                    focusedMenu.pressVolMinus();
                break;
            case 'vol_plus':
                if(focusedElement.pressVolPlus !== null)
                    focusedElement.pressVolPlus();
                else if (focusedMenu.pressVolPlus !== null)
                    focusedMenu.pressVolPlus();
                break;
            default:
                debugText.innerText = key;
                break;
        }
    }
    // }
}
function onKeyUp(){
    var key;
    if (window.event) {
        key = window.event.keyCode;}
    else {key = event.which;}
    if(keysEnabled && focusedMenu.idName === "movies-line" && (key === 37 || key === 39 || key === 40)){
        bgContainer.style.backgroundImage = "url('"+moviesMenu.getCurrentMovie().imageBg+"')";}
    }