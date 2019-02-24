import backend from "../backend/Backend"

const login = (callback) => {
    const url = "/login";
    const formData = new FormData()
    formData.append("username","user");
    formData.append("password","111111");
    const params = {
        method: "POST",
        body: formData,
        credentials: 'include'
    };
    backend.request(url,params, (response) => {
        callback(response)
    })

};

test("Should reject unauthorized request", (done) => {
    backend.request("/api/shops", {}, (response) => {
        expect(response.status).toBe(401);
        done();
    });
});

test("Should login with correct credentials", (done) => {
    login((response) => {
        expect(response.status).toBe(200)
        done()
    })
});

test("Should read  data if login with correct credentials", (done) => {
        backend.request("/api/shops", {
                method: 'GET', credentials: 'include'
            }, (response) => {
                response.json().then(json => {
                    expect(json._embedded).toBeDefined();
                    done()
                })
            }
        )
});

