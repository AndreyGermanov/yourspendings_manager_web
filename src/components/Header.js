import React, { Component } from 'react';
import t from "../utils/translate";
import {Navbar,Nav,NavItem} from 'react-bootstrap'

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
                    <ul className="nav navbar-nav navbar-right">
                        <li><a  onClick={()=>this.props.logout()}>{t("Logout")}</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Header;