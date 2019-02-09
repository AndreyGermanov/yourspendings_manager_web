import React, { Component } from 'react';
import t from "../utils/translate";
import {modules} from '../reducers/RootReducer'

/**
 * Class used to display main menu
 */
class Header extends Component {

    /**
     * Method used to render main navigation bar
     * @returns Rendered NavBar
     */
    render() {
        return (
            <div className="navbar navbar-default">
                <div className="navbar-header">
                    <div className="navbar-brand">
                        <a href="/">{t("Your spendings")}</a>
                    </div>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        {this.renderModulesList()}
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a  onClick={()=>this.props.logout()}>{t("Logout")}</a></li>
                    </ul>
                </div>
            </div>
        )
    }

    renderModulesList() {
        if (!this.props.modules) return;
        return Object.keys(this.props.modules)
                    .filter(moduleName => modules[moduleName])
                    .sort((a,b) => modules[a].order - modules[b].order)
                    .map(moduleName =>
                        <li key={"module_" + moduleName}>
                            <a href={"#/" + moduleName}>{modules[moduleName].title}</a>
                        </li>
                    )
    }
}

export default Header;