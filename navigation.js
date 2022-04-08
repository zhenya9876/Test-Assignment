function initNav () {
    // window.addEventListener("keydown", onKeyDown);

    window.onkeydown = onKeyDown;
    window.onkeyup = onKeyUp;
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

        switch (key) {
            case 38:    //top
                if(focusedElement.pressUp !== null)
                    focusedElement.pressUp();
                else if (focusedMenu.pressUp !== null)
                    focusedMenu.pressUp();
                break;
            case 39:    //right
                if(focusedElement.pressRight !== null)
                    focusedElement.pressRight();
                else if (focusedMenu.pressRight !== null)
                    focusedMenu.pressRight();
                break;
            case 40:    //bottom
                if(focusedElement.pressDown !== null)
                    focusedElement.pressDown();
                else if (focusedMenu.pressDown !== null)
                    focusedMenu.pressDown();
                break;
            case 37:    //left
                if(focusedElement.pressLeft !== null    )
                    focusedElement.pressLeft();
                else if (focusedMenu.pressLeft !== null)
                    focusedMenu.pressLeft();
                break;
            case 13:    //ok
                if(focusedElement.pressEnter !== null    )
                    focusedElement.pressEnter();
                else if (focusedMenu.pressEnter !== null)
                    focusedMenu.pressEnter();
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
    if(keysEnabled && focusedMenu.idName === "movies-line" && (key === 37 || key === 39)){
        bgContainer.style.backgroundImage = "url('"+moviesMenu.getCurrentMovie().imageBg+"')";}
    }