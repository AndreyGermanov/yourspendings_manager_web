import "whatwg-fetch"

class Backend {

    static instance = null;

    static getInstance() {
        if (!Backend.instance) Backend.instance = new Backend();
        return Backend.instance;
    }

    request(url,params,callback) {
        if (typeof(callback) !== 'function') callback = ()=>{};
        params["credentials"] = "include";
        fetch(this.getBaseUrl()+url,params).then(response => {
            callback(response)
        }).catch(error => {
            callback(error)
        });
    }

    getBaseUrl() {
        let host = "localhost";
        let port = 8080; 
        const hostItem = document.getElementById("backendHost");
        const portItem = document.getElementById("backendPort");
        if (hostItem !==null) host = hostItem.getAttribute("value");
        if (portItem !==null) port = parseInt(portItem.getAttribute("value"));
        if (!host) host = "localhost";
        if (isNaN(port)) port = 8080;
        return "http://"+host+":"+port;
    }
}

export default Backend.getInstance();