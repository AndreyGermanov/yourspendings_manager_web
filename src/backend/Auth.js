import Backend from './Backend'
import Store from '../store/Store';
import fromEntries from 'fromentries';

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
            if (response.status !== 200) { callback(response); return }
            response.json().then((data) => {
                const modules = data.modules ? data.modules : [];
                Store.changeProperties({
                    modules:fromEntries(modules.map((name) => [name,{ items:[],item:{},itemId:null,sortOrder:"",searchText:"" }])),
                    profile:{roles:data.roles,username:data.username},
                    loginName: "", loginPassword: ""
                });
                callback(response);
            })
        })
    }

    logout(callback=()=>{}) { Backend.request("/logout",{method:"POST"},callback) }

}

export default Auth.getInstance();