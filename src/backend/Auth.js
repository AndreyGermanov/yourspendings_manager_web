import Backend from './Backend'
import Store from '../store/Store';
import async from 'async';

class Auth {

    static instance = null;

    static getInstance() {
        if (!Auth.instance) Auth.instance = new Auth();
        return Auth.instance;
    }

    login(name,password,callback=()=>{}) {
        const formData = new FormData();
        formData.append("username",name);
        formData.append("password",password);
        Backend.request("/login",{method:"POST",body:formData}, (response) => {
            callback(response);
        });
    }

    loadProfile(callback=()=>{}) {
        Backend.request("/auth/profile",{}, (response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    this.getAuthModules(data.modules,modules => {
                        Store.changeProperties({modules:modules,profile:{roles:data.roles}});
                    })

                })
            }
            callback(response);
        })
    }

    getAuthModules(modules,callback=()=>{}) {
        const result = {};
        if (!modules || !modules.length) modules = [];
        async.eachSeries(modules,(module,callback) => {
            Backend.request("/api/"+module,{}, (response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        result[module] = data["page"];
                        result[module].items = data["_embedded"][module];
                        result[module].sortOrder = "";
                        callback();
                    });
                } else {
                    callback();
                }
            })
        }, () => { callback(result) })
    }

    logout(callback=()=>{}) { Backend.request("/logout",{method:"POST"},callback) }

}

export default Auth.getInstance();