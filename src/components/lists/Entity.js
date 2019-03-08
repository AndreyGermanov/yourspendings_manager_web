import React,{Component} from "react";
import {Panel} from "react-bootstrap";
import t from '../../utils/translate/translate';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'
import HeaderContainer from '../../containers/Header';
import {Button,Input} from '../ui/Form';
library.add(faStroopwafel);


/**
 * Base class used to represent data model either as list view or detail view
 * All concrete views extends from it
 */
class Entity extends Component {

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateList();
    }

    /**
     * Main method used to render this view
     * @returns Array of Rendered components
     */
    render() {
        const Header = HeaderContainer.getComponent();
        return [
            <Header key="f1"/>,
            <Panel bsStyle="primary" key="f2" className="rootItem">
                <Panel.Heading>
                    <Panel.Title componentClass="h3">
                        {this.props.listTitle}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    {this.renderActionButtons()}
                    <table className="table table-bordered table-striped">
                        <tbody>
                            {this.renderHeaderRow()}
                            {this.renderRows()}
                        </tbody>
                    </table>
                    {this.renderFooterNavigation()}
                </Panel.Body>
            </Panel>
        ]
    }

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderActionButtons() {
        this.actionButtons = [
            <Button className="btn btn-success list-nav"
                    onPress={() => window.location.href="#/"+this.props.itemName+"/new"}
                    iconClass="glyphicon glyphicon-plus" text={t("Новый")} key="b1"/>,
            <Button className="btn btn-info list-nav" onPress={() => this.props.updateList()}
                    iconClass="glyphicon glyphicon-refresh" text={t("Обновить")} key="b2"/>
        ];
        if (this.props.selectedItems && this.props.selectedItems.length>0) {
            this.actionButtons.push(
                <Button className="btn btn-danger list-nav" onPress={() => this.props.deleteItems()}
                        iconClass="glyphicon glyphicon-remove" text={t("Удалить")} key="b100"/>
            );
        }
        return (
            <div style={{paddingBottom:'7px'}}>
                {this.actionButtons}
                <span className="pull-right">
                    <Input name="search" onChange={this.props.changeListFilter} ownerProps={this.props}
                           value={this.props.listFilter} placeholder={t("Поиск")+" ..."}
                           inputStyle={{width:'220px'}}/>
                </span>
            </div>
        )
    }

    /**
     * Method used to render header columns of List view table
     * @returns Array of rendered columns
     */
    renderHeaderRow() {
        const result = [
            <td key="f1">
                <div align="center">
                    <input type="checkbox" checked={this.props.isAllItemsChecked()}
                           onChange={this.props.selectAllItems.bind(this)}/>
                </div>
            </td>
        ];
        for (let field in this.props.listColumns) {
            if (!this.props.listColumns.hasOwnProperty(field)) continue;
            let sortOrderWidget = null;
            if (this.props.sortOrder.field === field) {
                let arrowClass = "";
                if (this.props.sortOrder.direction === "ASC") arrowClass = "glyphicon-arrow-down";
                if (this.props.sortOrder.direction === "DESC") arrowClass = "glyphicon-arrow-up";
                sortOrderWidget = <i className={arrowClass+" glyphicon pull-right"}/>
            }
            result.push(<th key={"header_column_"+field} style={{cursor:'pointer'}}
                            onClick={this.props.changeListSortOrder.bind(this,field)}>
                {this.props.listColumns[field].title}{sortOrderWidget}
                </th>
            );
        }
        return <tr>{result}</tr>
    }

    /**
     * Method used to render list of items in List view
     * @returns Rendered array of table rows
     */
    renderRows() {
        const self = this;
        return this.props.list.map(function(item) {
            return self.renderRow(item);
        }, this);
    }

    /**
     * Method used to render individual row in table of List view
     * @param item: Data item for which need to render row
     * @returns Rendered row
     */
    renderRow(item) {
        const columns = [
            <td key={"list_"+item.uid+"_uid"}>
                <div align="center">
                    <input type="checkbox" onChange={this.props.selectItem.bind(this,item.uid)}
                           checked={this.props.isItemChecked(item.uid)}/>
                </div>
            </td>
        ];
        for (let field in this.props.listColumns) {
            if (!this.props.listColumns.hasOwnProperty(field)) continue;
            if (typeof(item[field]) !== "undefined") {
                columns.push(
                    <td key={"list_"+item.uid+"_"+field} style={this.getStyleForField(field,item[field],item)}>
                        <a href={"#"+this.props.itemName+"/"+item.uid}>
                            {this.props.renderListField(field,item[field],item)}
                        </a>
                    </td>
                );
            } else {
                columns.push(<td key={"list_"+item.uid+"_"+field}>&nbsp;</td>);
            }
        }
        return <tr key={"list_"+item.uid}>{columns}</tr>;
    }

    /**
     * Method returns style for specified cell in table
     * @param fieldName - Field name
     * @param fieldValue - Field value
     * @param item - Full row of table data
     * @returns Style object
     */
    getStyleForField(fieldName,fieldValue,item) {
        return {}
    }

    /**
     * Method renders footer of List view form (pages navigation)
     * @returns {*} Rendered component
     */
    renderFooterNavigation() {
        return (
            <div align="center">
                <table>
                    <tbody>
                    <tr>
                        <td className="padding-nav">{this.renderNavButton("left")}</td>
                        <td className="padding-nav">{this.renderNavPagesList()}</td>
                        <td>{this.renderNavButton("right")}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    /**
     * Method used to render "Left" or "Right" arrow buttons on footer navigation
     * @param type: "left" or "right" arrow
     * @returns {*} Rendered button
     */
    renderNavButton(type) {
        const numPages = Math.ceil(this.props.numberOfItems/this.props.itemsPerPage);
        let icon = "glyphicon-arrow-left";
        let onPress = () => this.props.changeListPage(this.props.pageNumber - 1);
        if (type === "right") {
            icon = "glyphicon-arrow-right";
            onPress = () => this.props.changeListPage(this.props.pageNumber + 1);
            if (numPages<=1 || this.props.pageNumber>=numPages) return null;
        } else {
            if (this.props.pageNumber <= 1) return null;
        }
        return (
            <Button className="btn btn-primary" iconClass={"glyphicon "+icon} onPress={onPress}/>
        )
    }

    /**
     * Method used to render page selector dropdown in footer navigation
     * @returns {*} Rendered dropdown
     */
    renderNavPagesList() {
        const numPages = Math.ceil(this.props.numberOfItems/this.props.itemsPerPage);
        if (numPages<=1) return null;
        const pages = [];
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
            pages.push(<option key={"page_select_" + pageNumber} value={pageNumber}>{pageNumber}</option>)
        }
        return (
            <select value={this.props.pageNumber} className="form-control"
                    onChange={(elem) => this.props.changeListPage(elem.target.value)}>
                {pages}
            </select>
        )
    }
}

export default Entity;