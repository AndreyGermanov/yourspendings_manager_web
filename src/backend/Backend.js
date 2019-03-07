import "whatwg-fetch"

class Backend {

    static instance = null;

    static getInstance() {
        if (!Backend.instance) Backend.instance = new Backend();
        return Backend.instance;
    }

    request(url,params,callback=()=>{}) {
        let request = this.prepareRequest(url,params);
        fetch(request.url,request.options).then(response => {
            callback(null,response)
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

    /**
     * Method used to prepare request to backend from input data
     * @param url - Input URL
     * @param params - Request params. Can include 'method', 'headers', 'body'
     * @returns {{url: *, options: {}}} Array with two items: url - request URL, options - request options
     */
    prepareRequest(url,params) {
        url = this.getBaseUrl()+url;
        let headers = {};
        if (params['headers']) { headers = params["headers"]; }
        let method = params["method"] ? params["method"] : "GET";
        const fetchOptions = { method: method, headers: headers, credentials: 'include' };
        if (method === 'POST' || method === 'PATCH') {
            fetchOptions['body'] = params["body"]
        } else if (method === 'GET') {
            let query_params = [];
            for (const name in params.body) {
                if (!params.body.hasOwnProperty(name)) continue;
                if (typeof(params.body[name])!=="function" && typeof(params.body[name])!=="object") {
                    query_params.push(name + "=" + params.body[name])
                }
            }
            if (query_params.length) url += '/?'+query_params.join('&');
        }
        return {url:url,options:fetchOptions}
    }
}

export default Backend.getInstance();