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
    this.pressEnter = null;

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
        if (nextTab === this.lastSelectedTab) {this.isMenuEntered = true;}
        this.lastSelectedTab.isFocused = false;
        Helper.removeClassForObject(this.lastSelectedTab.element, 'selected');
        this.lastSelectedTab = nextTab;
        // focusedElement = this.lastSelectedTab;
        this.lastSelectedTab.isFocused = true;
        Helper.addClassForObject(this.lastSelectedTab.element, 'selected');
        debugText.innerText = this.lastSelectedTab.idName;
        // console.log(this.lastSelectedTab.element);
    }
    this.selectNext = function () {
        if (this.lastSelectedTab.index + 1 <= this.menuTabs.length - 1)
        {
            this.changeFocusInside(this.menuTabs[this.lastSelectedTab.index + 1]);
            return true;
        }
    }
    this.canSelectNext = function () {
        if (this.lastSelectedTab.index + 1 <= this.menuTabs.length - 1)
            return true;
        return false;
    }
    this.selectPrev = function () {
        if (this.lastSelectedTab.index - 1 >= 0)
        {
            this.changeFocusInside(this.menuTabs[this.lastSelectedTab.index - 1]);
            return true;
        }
    }
    this.canSelectPrev = function () {
        if (this.lastSelectedTab.index - 1 >= 0)
            return true;
        return false;
    }
    this.activate = function () {
        for (var i = 0; i < this.menuTabs.length; i++) {
            this.menuTabs[i].isActive = true;
            Helper.addClassForObject(this.menuTabs[i].element, "active");
        }
        this.changeFocusInside(this.lastSelectedTab);
    }
    this.deactivate = function () {
        for (var i = 0; i < this.menuTabs.length; i++) {
            this.menuTabs[i].isActive = false;
            Helper.removeClassForObject(this.menuTabs[i].element, "active");
        }
        this.lastSelectedTab.isFocused = false;
        Helper.removeClassForObject(this.lastSelectedTab.element, "selected");
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
    this.pressEnter = null;
}
var Helper = {
    /**
     * Добавляет класс для объекта HTML-элемента, дополняя уже имеющиеся классы.
     * @param obj объект HTML-элемента
     * @param cls название класса
     */
    addClassForObject: function(obj, cls)
    {
        if (!obj) return;
        var re = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
        if (re.test(obj.className)) return;
        obj.className = (obj.className + " " + cls).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    },

    /**
     * Удаляет класс для объекта HTML-элемента, не затрагивая остальные классы.
     * @param obj объект HTML-элемента
     * @param cls название класса
     */
    removeClassForObject: function(obj, cls)
    {
        if (!obj) return;
        var re = new RegExp("(^|\\s)" + cls + "(\\s|$)", "g");
        obj.className = obj.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }
}