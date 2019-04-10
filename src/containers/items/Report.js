/**
 * Controller class for Shop Item component. Contains all methods and properties, which used by this module.
 */
import DocumentContainer from "./Document";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
import Store from "../../store/Store";
import async from 'async';
import t from '../../utils/translate/translate';
import exportCsv from '../../utils/csv';
import _ from 'lodash';
const queryString = require("query-string");

export default class ReportItemContainer extends DocumentContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("report");
    }

    static getComponent() {
        const item = new ReportItemContainer();
        return connect(item.mapStateToProps.bind(item),item.mapDispatchToProps.bind(item))(Item.Report);
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Parameters from component's tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            fullScreen: ownProps ? ownProps.fullScreen : false,
            reportData: state.reportData ? state.reportData: [],
            openedRows: state.openedRows ? state.openedRows: {}
        })
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            getQueriesTableLabels: () =>  this.getQueriesTableLabels(),
            addQuery: () => this.addQuery(),
            copyQuery: (index) => this.copyQuery(index),
            removeQuery: (index) => this.removeQuery(index),
            changeTableField: (modelName,collectionName,rowIndex,fieldName,e) =>
                this.changeTableField(modelName,collectionName,rowIndex,fieldName,e),
            setQueryVisible: (rowIndex,isVisible) => this.setQueryVisible(rowIndex,isVisible),
            setQuerySortOrder: (rowIndex,sortOrder) => this.setQuerySortOrder(rowIndex,sortOrder),
            switchTab: (rowIndex,tab) => this.switchTab(rowIndex,tab),
            generateReport: () => this.generateReport(),
            clearReport: () => this.clearReport(),
            switchRow: (rowNumber) => this.switchRow(rowNumber),
            exportCsv: () => this.exportCsv()
        });
    }

    /**
     * Method used to refresh item data from backend for detail view. It makes request to backend
     * using specified uid of item and sets item application state variable for this item
     * @param uid: ID of item to search
     * @param callback: Function called after operation finished
     */
    updateItem(uid,callback=()=>{}) {
        async.series([
            (callback) => super.updateItem(uid,callback)
        ], () => callback())
    }

    /**
     * Method returns labels for header of products table
     * @returns Object with keys as model field names and values as titles of that fields
     */
    getQueriesTableLabels() { return Models.getInstanceOf("reportQuery").getFieldLabels();}

    /**
     * Method used to remove row from Queries table
     * @param index - Index of row to remove
     */
    removeQuery(index) {
        let item = this.getProps().item;
        item.queries.splice(index,1);
        let stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
    }

    /**
     * Method used to add new empty row in queries table
     */
    addQuery() {
        let item = this.getProps().item;
        let query = Models.getInstanceOf("reportQuery");
        item.queries.push(query.initItem({report:item["uid"], enabled:true, order:item.queries.length}));
        let stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
    }

    copyQuery(index) {
        let item = this.getProps().item;
        let query = _.cloneDeep(item.queries[index]);
        console.log(query);
        query['order'] = item.queries.length;
        let stateItem = Store.getState().item;
        item.queries.push(query);
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
    }

    /**
     * Show/hide query details button onClick handler
     * @param rowIndex - Index of row to show or hide
     * @param isVisible - If true, then show, if false then hide
     */
    setQueryVisible(rowIndex,isVisible) {
        this.clearReport();
        this.changeTableField("reportQuery","queries",rowIndex,"visible",isVisible)
    }

    /**
     * Change sort order of arrow buttons onClick handler in table rows, used to swap two rows
     * @param rowIndex1 - index of first row to swap
     * @param rowIndex2 - index of second row to swap
     */
    setQuerySortOrder(rowIndex1,rowIndex2) {
        this.clearReport();
        let queries = this.getProps().item.queries;
        let sortOrder1 = queries[rowIndex1].order;
        let sortOrder2 = queries[rowIndex2].order;
        this.changeTableField("reportQuery","queries",rowIndex1,"order",sortOrder2);
        this.changeTableField("reportQuery","queries",rowIndex2,"order",sortOrder1);
    }

    /**
     * Method used to select specified tab in Query details row
     * @param rowIndex - Index of query in a table
     * @param tab - Tab ID to switch to
     */
    switchTab(rowIndex,tab) {
        this.setQueryVisible(rowIndex,false);
        this.changeTableField("reportQuery","queries",rowIndex,"visibleTab",tab);
        setTimeout(() => this.setQueryVisible(rowIndex,true),1);

    }

    /**
     * Method used to change field value in subcollection inside "item" property
     * @param modelName: Collection which used to manage item of row in this table
     * @param collectionName: Name of collection inside "item"
     * @param fieldName: Name of field to change
     * @param e: Link to DOM item of input field from which get value
     */
    changeTableField(modelName,collectionName,rowIndex,fieldName,e) {
        let value = null;
        let state = Store.getState();
        const errors = state.errors;
        if (!errors[collectionName]) errors[collectionName] = {};
        if (!errors[collectionName][rowIndex]) errors[collectionName][rowIndex] = {};
        errors[collectionName][rowIndex][fieldName] = "";
        Store.changeProperties({errors:errors});
        let model = Models.getInstanceOf(modelName);
        if (typeof(model["parseItemField_"+fieldName]) === "function") {
            value = model["parseItemField_" + fieldName].bind(this)(e);
        }
        else if (e && e.target) value = e.target.value; else value = e;
        const item = this.getProps(state).item;
        if (item[collectionName][rowIndex][fieldName] === value) return;
        item[collectionName][rowIndex][fieldName] = value;
        let error = this.model.validateCollectionField(collectionName,fieldName,value,item);
        if (error) errors[collectionName][rowIndex][fieldName] = error;
        const stateItem = state.item;
        stateItem[this.model.itemName] = item;
        Store.changeProperties({"item":stateItem,"errors":errors});
    }

    /**
     * "Generate" button onClick handler. Used to send report request to server and receive and apply
     * response with data or with error
     */
    generateReport(callback) {
        if (typeof(callback) != "function") callback = () => {};
        if (!this.validateItem()) return;
        let item = this.getProps().item;
        if (window.location.hash.split("?").length === 2) {
            this.applyUrlParams(item,queryString.parse(window.location.hash.split("?").pop()));
        }
        this.model.generateReport(item,(error,reports) => {
            if (error) { Store.changeProperty("errors",{general:t("Internal error")});return;}
            this.reportData = [];
            reports.forEach((rows,index) => {
                let format = {title: t('Report')+" # "+index, columns: []};
                try { format = JSON.parse(item.queries.filter(query=>query.enabled)[index].outputFormat)} catch (e) {}
                if (!format.title) format.title = item.queries.filter(query=>query.enabled)[index].name;
                let report = {format:format,data:rows};
                try {
                    let postScript = item.queries.filter(query=>query.enabled)[index].postScript;
                    if (postScript && postScript.length) report = eval(postScript)(report,this);
                } catch (e) { console.log(e);};
                let eventHandlers = item.queries.filter(query=>query.enabled)[index].eventHandlers;
                try { report.eventHandlers = eval(eventHandlers)()} catch (e) { console.log(e);}
                let layout = item.queries.filter(query=>query.enabled)[index].layout;
                if (layout && layout.length) report.layout = layout;
                this.reportData.push(report);
            });
            if (item.postScript && item.postScript.length) {
                try {
                    let func = eval(item.postScript);
                    this.reportData = func(this.reportData,this);
                } catch (e) { console.log(e);};
            }
            Store.changeProperty("reportData",this.reportData);
            if (callback) callback();
        });
    }

    /**
     * Method used to apply URL request params to report queries
     * @param item - Report item data
     * @param urlParams - Hashmap of URL params
     */
    applyUrlParams(item,urlParams) {
        item.queries.forEach(query => this.applyUrlParamsToQuery(query,urlParams))
    }

    /**
     * Method used to apply URL request params to specified report query
     * @param query - Query metadata
     * @param urlParams - Hashmap of URL params
     */
    applyUrlParamsToQuery(query,urlParams) {
        let params = {};
        if (!query.params) return;
        try { params = JSON.parse(query.params);} catch (e) { console.log(e)};
        if (!params.url_params) return;
        params.url_params.forEach(config => {
            if (typeof(urlParams[config["name"]]) === "undefined") return;
            if (typeof(config["parseFunction"]) !== "object") return;
            let value = urlParams[config["name"]];
            let func = this.getParamParseFunction(config["parseFunction"]["name"],query);
            if (func) func.apply(this,[query,this,value,config["parseFunction"]["arguments"]]);
        })
    }

    /**
     * Method returns function, assigned as a "parseFunction" in configuration of URL parameter
     * @param name - name of function to search
     * @param query - Query metadata
     * @returns Function or null
     */
    getParamParseFunction(name,query) {
        let eventHandlers = {};
        try { eventHandlers = eval(query.eventHandlers)();} catch (e) {console.log(e);};
        if (typeof(eventHandlers[name]) === "function") {
            return eval(eventHandlers[name]);
        } else if (typeof(this[name]) === "function") {
            return this[name]
        }
    }

    /**
     * General URL param parse function used to set URL param value to specified query parameter
     * @param query - Query data
     * @param context - Link to context of current module
     * @param value - Value of URL parameter
     * @param config - Configuration of URL parameter
     */
    setQueryParam(query,context,value,config) {
        let params = {};
        try { params = JSON.parse(query.params);} catch (e) { console.log(e)};
        if (!params.sql_query_params) return;
        params.sql_query_params.forEach(param => {
            if (param.name === config["paramName"]) param.value = value;
        });
        query.params = JSON.stringify(params);
    }

    /**
     * General URL param parse function usedto set URL param value to specified query format parameter
     * @param query - Query data
     * @param context - Link to context of current module
     * @param value - Value of URL parameter
     * @param config - Configuration of URL parameter
     */
    setFormatParam(query,context,value,config) {
        let format = {};
        try { format = JSON.parse(query.outputFormat);} catch (e) { console.log(e)};
        if (typeof(value) == "string" && value !== "true" && value!=="false") value = "'"+value+"'";
        eval("format"+Store.getPropertyNameExpression(config["paramName"])+"="+value+";");
        query.outputFormat = JSON.stringify(format);
    }

    /**
     * "Clear" button onClick handler used to clear current query
     */
    clearReport() {
        Store.changeProperty("reportData",[]);
    }

    /**
     * Method runs when user expands or collapses row in report
     * @param rowNumber - Number of row
     */
    switchRow(rowNumber) {
        let openedRows = this.getProps().openedRows
        if (typeof(openedRows[rowNumber]) === "undefined") openedRows[rowNumber] = false;
        openedRows[rowNumber] = !openedRows[rowNumber];
        Store.changeProperty("openedRows",openedRows)
    }

    /**
     * "Export to CSV" button onClick handler which used to generate CSV file for all generated reports
     */
    exportCsv() {
        let reports = this.getProps().reportData;
        if (reports && reports.length) {
            reports.forEach((report) => {
                let data = _.cloneDeep(report.data);
                if (report.format && report.format.columns && report.format.columns.length) {
                    data.unshift(report.format.columns.map(column => column.title));
                }
                exportCsv(this.getProps().item.name+"-"+report.format.title+".csv",data)
            })
        }
    }

}