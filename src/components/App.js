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
        const Purchases = List.getComponentOf("purchase");
        const Purchase = Item.getComponentOf("purchase");
        const DimensionUnits = List.getComponentOf("dimensionUnit");
        const DimensionUnit = Item.getComponentOf("dimensionUnit");
        const Reports = List.getComponentOf("report");
        const Report = Item.getComponentOf("report");
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
                            <Route exact path="/purchases" render={() => <Purchases/>}/>
                            <Route exact path="/dimensionUnits" render={() => <DimensionUnits/>}/>
                            <Route exact path="/reports" render={() => <Reports/>}/>
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
                            <Route path="/purchase/:uid"
                                   render={(state) => { return <Purchase uid={state.match.params.uid}/>}}/>
                            <Route path="/dimensionUnit/:uid"
                                   render={(state) => { return <DimensionUnit uid={state.match.params.uid}/>}}/>
                            <Route exact path="/report/:uid"
                                   render={(state) => { return <Report uid={state.match.params.uid}/>}}/>
                            <Route path="/report/:uid/:fullScreen"
                                   render={(state) => { return <Report uid={state.match.params.uid}
                                                                       fullScreen={state.match.params.fullScreen}/>}}/>
                            <Route render={() => <Purchases/>}/>
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
