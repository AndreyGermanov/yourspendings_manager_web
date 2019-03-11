import {connect} from 'react-redux';
import HeaderComponent from '../components/Header';
import Auth from '../backend/Auth'
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

    mapStateToProps(state,ownProps) {
        return {
            modules: state.modules,
            moduleName: ownProps.moduleName
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            logout: () => this.logout()
        }
    }

    logout() { Auth.logout((response) => (new App()).start()); }
}