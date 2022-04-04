function initNav () {
    window.addEventListener("keydown", onKeyDown);
}

// Key Press Handler
function onKeyDown(ev) {
    if (focusedElement === undefined
        && ev.keyCode >= 37 && ev.keyCode <= 40){
        focusedElement = menuTabSearch;
        menuCenterObj.changeFocusInside(menuTabApps);
        focusedMenu = menuCenterObj;
    } else if (keysEnabled) {
        switch (ev.keyCode) {
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
        }
    }
}