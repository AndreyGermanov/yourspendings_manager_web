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
     * Method used to remove row from Products table
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
    addQuery(container) {
        let item = this.getProps().item;
        let query = Models.getInstanceOf("reportQuery");
        item.queries.push(query.initItem({report:item["uid"],order:item.queries.length}));
        let stateItem = Store.getState().item;
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

    switchTab(rowIndex,tab) {
        this.changeTableField("reportQuery","queries",rowIndex,"visibleTab",tab);
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
        this.model.generateReport(item,(error,reports) => {
            if (error) {
                Store.changeProperty("errors",{general:t("Internal error")});return;
            }
            let reportData = [];
            reports.forEach((rows,index) => {
                let format = {
                    title: t('Report')+" # "+index,
                    columns: []
                }
                try {
                    format = JSON.parse(item.queries.filter(query=>query.enabled)[index].outputFormat)
                } catch (e) {
                }
                let report = {format:format,data:rows};
                try {
                    let postScript = item.queries.filter(query=>query.enabled)[index].postScript;
                    if (postScript && postScript.length) {
                        let func = eval(postScript);
                        report = func(report);
                    }
                } catch (e) { };
                reportData.push(report);
            });
            if (item.postScript && item.postScript.length) {
                try {
                    let func = eval(item.postScript);
                    reportData = func(reportData);
                } catch (e) {};
            }
            Store.changeProperty("reportData",reportData);
            if (callback) callback();
        });
    }

    clearReport() {
        Store.changeProperty("reportData",[]);
    }

    switchRow(rowNumber) {
        let openedRows = this.getProps().openedRows
        if (typeof(openedRows[rowNumber]) === "undefined") openedRows[rowNumber] = false;
        openedRows[rowNumber] = !openedRows[rowNumber];
        Store.changeProperty("openedRows",openedRows)
    }

    exportCsv() {
        let reports = this.getProps().reportData;
        if (reports && reports.length) {
            reports.forEach((report) => {
                exportCsv(this.getProps().item.name+"-"+report.format.title+".csv",report.data)
            })
        }
    }

}