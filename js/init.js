;(function(window, Utils) {
    'use strict';

    class Server {
        constructor(s) {
            if (!Server.pattern.test(s)) {
                throw new Error("Illegal server address. Server address schema like: ip:port:name[version].");
            }
            var arr = Server.pattern.exec(s);
            this.host = arr[1];
            this.port = parseInt(arr[2]);
            if (arr[3])
                this.name = arr[3];
            if (arr[4])
                this.version = parseInt(arr[4].replace(/\./g, ""));
        }
        compareVersion(otherVersion) {
            if (otherVersion.startsWith("v") || otherVersion.startsWith("V")) {
                otherVersion = otherVersion.substr(1);
            }

            return this.version - parseInt(otherVersion.replace(/\./g, ""));
        }
        toString() {
            var s = this.host + ":" + this.port;
            if (this.name)
                s += ":" + this.name;
            if (this.version)
                s += "[v" + this.version + "]";
            return s;
        }
    }

    Server.pattern = /([\w\.]+):(\d+)(?::(\w+)\[v(1\.\d\.\d)\])?/i;
    Server.requiredMinVersion = "v1.2.7";

    function startServer() {
        var server = new Server("127.0.0.1:8000");
        start(server.host, server.port)
            .catch(e => {
                console.error(e);
                contentEl.innerHTML += "Connect server [" + server.toString() + "] fail, please choose another server.</br>";
            });
    }

    function start(host, port) {
        window.wsClient = new WsClient("ws://" + host + ":" + port + "/ratel");
        window.imClient = new ImClient("ws://" + host + ":" + port + "/chat")
        window.wsClient.panel.help()

        document.querySelector("#content").innerHTML += "Connect to ws://" + host + ":" + port + "/ratel .</br></br>";
        return window.wsClient.init();
    }

    window.onload = function() {
        defaultSite.render();
        startServer();
    };
} (this, this.Utils));
