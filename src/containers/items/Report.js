/**
 * Controller class for Shop Item component. Contains all methods and properties, which used by this module.
 */
import DocumentContainer from "./Document";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
import Store from "../../store/Store";
import async from 'async';
const $ = require('jquery');

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
            setQuerySortOrder: (rowIndex,sortOrder) => this.setQuerySortOrder(rowIndex,sortOrder)
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
            (callback) => super.updateItem(uid,callback),
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
     * Method used to add new empty row in discounts table
     */
    addQuery(container) {
        let item = this.getProps().item;
        let query = Models.getInstanceOf("reportQuery");
        item.queries.push(query.initItem({report:item["uid"],order:item.queries.length}));
        let stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
    }

    setQueryVisible(rowIndex,isVisible) {
        this.changeTableField("reportQuery","queries",rowIndex,"visible",isVisible)
    }

    setQuerySortOrder(rowIndex1,rowIndex2) {
        let queries = this.getProps().item.queries;
        let sortOrder1 = queries[rowIndex1].order;
        let sortOrder2 = queries[rowIndex2].order;
        this.changeTableField("reportQuery","queries",rowIndex1,"order",sortOrder2);
        this.changeTableField("reportQuery","queries",rowIndex2,"order",sortOrder1);
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

}