var focusedElement;
var focusedMenu;

function MenuObject(name, element) {
    this.idName = name;
    this.element = element;
    this.menuTabs = [];
    this.lastSelectedTab = null;
    this.isMenuEntered = false;

    this.pressUp = null;
    this.pressRight = null;
    this.pressDown = null;
    this.pressLeft = null;

    this.addMenuTab = function (tab) {
        tab.index = this.menuTabs.length;
        this.menuTabs[this.menuTabs.length] = tab;
        if (this.lastSelectedTab === null) {this.lastSelectedTab = tab}
    }
    this.removeMenuTabs = function (startIndex, tabCount) {
        this.menuTabs.splice(startIndex, tabCount);
            if (this.lastSelectedTab.index >= startIndex
                && this.lastSelectedTab.index <= startIndex + tabCount)
                this.lastSelectedTab = this.menuTabs[0] || null;
    }
    this.changeFocusInside = function (nextTab) {
        if (nextTab === this.lastSelectedTab) this.isMenuEntered = true;
        this.lastSelectedTab.isFocused = false;
        this.lastSelectedTab.element.classList.remove("selected");
        this.lastSelectedTab = nextTab;
        focusedElement = this.lastSelectedTab;
        this.lastSelectedTab.isFocused = true;
        this.lastSelectedTab.element.classList.add("selected");
        console.log(this);
    }
    this.selectNext = function () {
        if (this.lastSelectedTab.index + 1 <= this.menuTabs.length - 1)
        {
            this.changeFocusInside(this.menuTabs[this.lastSelectedTab.index + 1]);
            return true;
        }
    }
    this.selectPrev = function () {
        if (this.lastSelectedTab.index - 1 >= 0)
        {
            this.changeFocusInside(this.menuTabs[this.lastSelectedTab.index - 1]);
            return true;
        }
    }
    this.activate = function () {
        for (var i = 0; i < this.menuTabs.length; i++) {
            this.menuTabs[i].isActive = true;
            this.menuTabs[i].element.classList.add("active");
        }
        this.changeFocusInside(this.lastSelectedTab);
    }
    this.deactivate = function () {
        for (var i = 0; i < this.menuTabs.length; i++) {
            this.menuTabs[i].isActive = false;
            this.menuTabs[i].element.classList.remove("active");
        }
        this.lastSelectedTab.isFocused = false;
        this.lastSelectedTab.element.classList.remove("selected");
    }
}

function MenuTab(idName, element) {
    this.index = 0;
    this.idName = idName;
    this.element = element;
    this.isFocused = false;
    this.isActive = false;
    this.pressUp = null;
    this.pressRight = null;
    this.pressDown = null;
    this.pressLeft = null;
}