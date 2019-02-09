import {connect} from 'react-redux';
import LoginFormComponent from '../components/LoginForm';
import Store from '../store/Store';
import Backend from '../backend/Backend';
import t from '../utils/translate'
import Auth from '../backend/Auth';
/**
 * Controller for root application component
 */
export default class LoginForm {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;
    static getComponent() {
        if (!LoginForm.component) {
            const item = new LoginForm();
            LoginForm.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(LoginFormComponent);
        }
        return LoginForm.component;
    }

    mapStateToProps(state) {
        return {
            loginName: state.loginName,
            loginPassword: state.loginPassword,
            errors: state.errors
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            changeField: (fieldName,fieldValue) => this.changeField(fieldName,fieldValue),
            login: () => this.login()
        }
    }

    login() {
        Store.changeProperty("errors",{});
        if (!this.validate()) return;
        const state = Store.getState();
        Auth.login(state.loginName,state.loginPassword, (response) => {
            state["isLogin"] = response.status === 200;
            if (!state.isLogin) {
                state.errors["general"] = t("Authentication error")
            } else {
                Auth.loadProfile();
            }
            Store.changeProperties(state);
        });
    }

    validate() {
        const state = Store.getState();
        if (!state.loginName.trim().length) state.errors["loginName"] = t("Login is required");
        if (!state.loginPassword.trim().length) state.errors["loginPassword"] = t("Password is required");
        Store.changeProperty("errors",state.errors);
        return !Object.getOwnPropertyNames(state.errors).length
    }

    loadProfile() {
        Backend.request("/auth/profile",{}, (response) => {
            if (response.status !== 200) return
            response.json().then(response => {
                console.log(response);
            })
        });
    }

}

