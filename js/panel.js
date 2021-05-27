/**
 * 面板类
 * 只包含面板中的视图显示、输入逻辑，不包含其它逻辑（包括发送）
 */
;(function(window, EventWrapper, Toggleable, Moveable, Utils, POKER) {
    // 'use strict';

    function Panel() {
        this.eventWrapper = new EventWrapper();
        this.terminalDiv = document.querySelector("#terminal");
        this.contentDiv = document.querySelector("#content");
        this.inputBox = document.querySelector("#input");

        Moveable.call(this, document.querySelector("#bar"), this.terminalDiv);
        Toggleable.call(this, this.terminalDiv);
        Toggleable.prototype.triggerBy.call(this, "keyup", togglePredicate);
    }

    Utils.extend(Moveable, Toggleable);
    Utils.extend(Panel, Moveable);

    var prefix = "[ratel]$ > ";

    Panel.prototype.append = function(str) {
        var split = str.split("\n");
        var html = split.join("</br>") + "</br>";

        this.contentDiv.innerHTML += html;
        this.contentDiv.scrollTop = this.contentDiv.scrollHeight;
    };

    Panel.prototype.generatePoker = function(pokers) {
        if (!Array.isArray(pokers) || pokers.length == 0) {
            return "";
        }

        var s = "<code>";
        for (var i in pokers) {
           s += i == 0 ? "┌─┐" : "─┐";
        }
        s += "\n";

        for (var i in pokers) {
            if (i == 0) s += "│";
            s += POKER.LEVELS[pokers[i].level].symbol + (POKER.LEVELS[pokers[i].level].symbol.length == 1 ? " " : "") + "│";
        }
        s += "\n";

        for (var i in pokers) {
            if (i == 0) s += "│";
            s += POKER.TYPES[pokers[i].type].symbol + " │";
        }
        s += "\n";

        for (var i in pokers) {
            s += i == 0 ? "└─┘" : "─┘";
        }
        s += "</code>";

        return s;
    };

    Panel.prototype.setReadOnly = function (readOnly) {
        this.inputBox.readOnly = readOnly;
    };

    var enterCode = 13;

    Panel.prototype.waitInput = function() {
        return new Promise(resolve => {
            this.eventWrapper.addEventListener(this.inputBox, "keypress", (e) => {
                var val = this.inputBox.value.trim();

                if (e.keyCode == enterCode) {
                    if (Utils.isEmpty(val)) return;

                    resolve(val);
                    this.append(prefix + val);
                    this.eventWrapper.removeEventListener(this.inputBox, "keypress");
                    this.inputBox.value = "";
                }
            }, false);
        });
    };

    var arrowUpCode = 38;
    var arrowDownCode = 40;

    function togglePredicate(e, type) {
        var keyCode = e.keyCode;
        var ctrlKey = e.ctrlKey;

        // ctrl + ↑/↓
        return ctrlKey && (type == "show" ? keyCode === arrowUpCode : keyCode === arrowDownCode);
    }

    window.Panel = Panel;
} (this, this.EventWrapper, this.Toggleable, this.Moveable, this.Utils, this.POKER));