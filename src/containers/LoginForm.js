import {connect} from 'react-redux';
import LoginFormComponent from '../components/LoginForm';
import Store from '../store/Store';
import Backend from '../backend/Backend';
import t from '../utils/translate'
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
        const formData = new FormData();
        formData.append("username",state.loginName);
        formData.append("password",state.loginPassword);
        Backend.request("/login",{method:"POST",body:formData}, (response) => {
            state["isLogin"] = response.status === 200;
            if (!state.isLogin) {
                state.errors["general"] = t("Authentication error")
            }
            Store.changeProperties(state);
        })
    }

    validate() {
        const state = Store.getState();
        if (!state.loginName.trim().length) state.errors["loginName"] = t("Login is required");
        if (!state.loginPassword.trim().length) state.errors["loginPassword"] = t("Password is required");
        Store.changeProperty("errors",state.errors);
        return !Object.getOwnPropertyNames(state.errors).length
    }

}

