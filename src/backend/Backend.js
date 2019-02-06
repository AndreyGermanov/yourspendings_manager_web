import "whatwg-fetch"

class Backend {

    request(url,params,callback) {
        fetch(this.getBaseUrl()+url,params).then(response => {
            callback(response)
        }).catch(error => {
            callback(error)
        });
    }

    getBaseUrl() {
        return "http://localhost:8080";
    }
}

export default new Backend()