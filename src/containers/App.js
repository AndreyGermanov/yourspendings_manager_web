import {connect} from 'react-redux';
import AppComponent from '../components/App';
import Backend from '../backend/Backend'
import Store from '../store/Store'

/**
 * Controller for root application component
 */
export default class App {

    /**
     * Binds properties and methods of this controller main screen view and returns component
     * with properties and methods
     * @returns Component to display
     */
    static component = null;
    static getComponent() {
        if (!App.component) {
            const item = new App();
            App.component =
                connect(item.mapStateToProps.bind(item), item.mapDispatchToProps.bind(item))(AppComponent);
        }
        return App.component;
    }

    mapStateToProps(state) {
        return {
            isMainScreenLoading:state.isMainScreenLoading,
            isLogin: state.isLogin
        }
    }

    mapDispatchToProps(dispatch) {
        return {
            start: () => this.start()
        }
    }

    start() {
        Store.changeProperty("isMainScreenLoading",true);
        Backend.request("/api/shops",{}, (response) => {
            Store.changeProperties({isMainScreenLoading:false,isLogin:response.status === 200})
        });
    }
}

