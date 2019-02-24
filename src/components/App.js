import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.css"
import LoadingScreen from './LoadingScreen'
import "../styles/App.css"
import {HashRouter} from 'react-router-dom'
import {Route,Switch} from 'react-router'
import {List,Item,Auth} from '../containers/Containers';
import '../styles/App.css';

class App extends Component {


    render() {
        const ProductCategories = List.getComponentOf("productCategory");
        const ProductCategory = Item.getComponentOf("productCategory");
        const LoginForm = Auth.getComponentOf("login");
        if (this.props.isMainScreenLoading)
            return <LoadingScreen/>;
        else {
            if (!this.props.isLogin) {
                return <LoginForm/>
            } else {
                return (
                    <HashRouter>
                        <Switch>
                            <Route exact path="/productCategories" render={() => <ProductCategories/>}/>
                            <Route path="/productCategory/:uid"
                                   render={(state) => {
                                       return <ProductCategory uid={state.match.params.uid}/>
                                   }}/>
                        </Switch>
                    </HashRouter>
                )
            }
        }
    }

    componentDidMount() {
        this.props.start();
    }

}

export default App;
