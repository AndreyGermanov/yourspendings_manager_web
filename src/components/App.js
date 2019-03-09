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
        const Roles = List.getComponentOf("role");
        const Role = Item.getComponentOf("role");
        const Users = List.getComponentOf("user");
        const User = Item.getComponentOf("user");
        const Shops = List.getComponentOf("shop");
        const Shop = Item.getComponentOf("shop");
        const PurchaseUsers = List.getComponentOf("purchaseUser");
        const PurchaseUser = Item.getComponentOf("purchaseUser");
        const Discounts = List.getComponentOf("discount");
        const Discount = Item.getComponentOf("discount");
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
                            <Route exact path="/roles" render={() => <Roles/>}/>
                            <Route exact path="/users" render={() => <Users/>}/>
                            <Route exact path="/shops" render={() => <Shops/>}/>
                            <Route exact path="/purchaseUsers" render={() => <PurchaseUsers/>}/>
                            <Route exact path="/discounts" render={() => <Discounts/>}/>
                            <Route path="/productCategory/:uid"
                                   render={(state) => { return <ProductCategory uid={state.match.params.uid}/>}}/>
                            <Route path="/role/:uid"
                                   render={(state) => { return <Role uid={state.match.params.uid}/>}}/>
                            <Route path="/user/:uid"
                                   render={(state) => { return <User uid={state.match.params.uid}/>}}/>
                            <Route path="/shop/:uid"
                                   render={(state) => { return <Shop uid={state.match.params.uid}/>}}/>
                            <Route path="/purchaseUser/:uid"
                                   render={(state) => { return <PurchaseUser uid={state.match.params.uid}/>}}/>
                            <Route path="/discount/:uid"
                                   render={(state) => { return <Discount uid={state.match.params.uid}/>}}/>
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
