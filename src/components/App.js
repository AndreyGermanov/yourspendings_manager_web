import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.css"
import LoginFormContainer from '../containers/LoginForm'
import HeaderContainer from '../containers/Header';
import LoadingScreen from './LoadingScreen'
import "../styles/App.css"

class App extends Component {

    render() {
        return this.renderContent();
    }

    renderContent() {
        const LoginForm = LoginFormContainer.getComponent();
        const Header = HeaderContainer.getComponent();
        if (this.props.isMainScreenLoading)
            return <LoadingScreen/>
        else {
            if (!this.props.isLogin) {
                return <LoginForm/>
            } else {
                return <Header/>;
            }
        }
    }

    componentDidMount() {
        this.props.start();
    }

}

export default App;
