import {connect} from 'react-redux';
import HeaderComponent from '../components/Header';
import Backend from '../backend/Backend'
import App from './App';

/**
 * Controller for root application component
 */
export default class Header {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;
    static getComponent() {
        if (!Header.component) {
            const item = new Header();
            Header.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(HeaderComponent);
        }
        return Header.component;
    }

    mapStateToProps(state) {
        return {

        }
    }

    mapDispatchToProps(dispatch) {
        return {
            logout: () => this.logout()
        }
    }

    logout() {
        Backend.request("/logout",{method:"POST"}, (response) => {
            (new App()).start()
        });
    }
}