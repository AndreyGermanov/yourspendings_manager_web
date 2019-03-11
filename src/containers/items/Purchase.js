/**
 * Controller class for Shop Item component. Contains all methods and properties, which used by this module.
 */
import DocumentContainer from "./Document";
import Models from '../../models/Models'
import {Item} from '../../components/Components';
import {connect} from 'react-redux';
import Store from "../../store/Store";
import async from 'async';
import _ from "lodash";

export default class PurchaseItemContainer extends DocumentContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("purchase");
    }

    static getComponent() {
        const item = new PurchaseItemContainer();
        return connect(item.mapStateToProps.bind(item),item.mapDispatchToProps.bind(item))(Item.Purchase);
    }


    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Parameters from component's tag
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            "categories_list": state.categories_list ? state.categories_list : [],
            "discounts_list": state.discounts_list ? state.discounts_list : [],
            "units_list": state.units_list ? state.units_list : []
        })
    }
    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return Object.assign(super.mapDispatchToProps(dispatch), {
            incrementPurchaseImage: () => this.incrementPurchaseImage(),
            decrementPurchaseImage: () => this.decrementPurchaseImage(),
            getProductTableLabels: () =>  this.getProductTableLabels(),
            addProduct: () => this.addProduct(),
            removeProduct: (index) => this.removeProduct(index),
            changeTableField: (modelName,collectionName,rowIndex,fieldName,e) =>
                this.changeTableField(modelName,collectionName,rowIndex,fieldName,e)
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
            (callback) => Models.getInstanceOf("productCategory").setListForDropdown(callback),
            (callback) => Models.getInstanceOf("dimensionUnit").setListForDropdown(callback),
            (callback) => Models.getInstanceOf("discount").setListForDropdown(callback)
        ], () => callback())
    }

    /**
     * Method used to show next image when user presses "Back" button in images list
     */
    incrementPurchaseImage() {
        let item = this.getProps().item;
        let result = 0;
        if (item.purchaseImageIndex < item.images.length-1) result = item.purchaseImageIndex+1;
            this.changeItemField("purchaseImageIndex",result)
    }

    /**
     * Method used to show previous image when user presses "Next" button in images list
     */
    decrementPurchaseImage() {
        let item = this.getProps().item;
        let result = item.images.length-1;
        if (item.purchaseImageIndex > 0) result = item.purchaseImageIndex-1;
        this.changeItemField("purchaseImageIndex",result)
    }

    /**
     * Method returns labels for header of products table
     * @returns Object with keys as model field names and values as titles of that fields
     */
    getProductTableLabels() { return Models.getInstanceOf("purchaseProduct").getFieldLabels();}

    /**
     * Method used to remove row from Products table
     * @param index - Index of row to remove
     */
    removeProduct(index) {
        let item = this.getProps().item;
        item.products.splice(index,1);
        let stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
    }

    /**
     * Method used to add new empty row in products table
     */
    addProduct() {
        let item = this.getProps().item;
        let product = Models.getInstanceOf("purchaseProduct");
        item.products.push(product.initItem({purchase:item["uid"]}));
        let stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperty("item",stateItem);
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
        let model = Models.getInstanceOf(modelName);
        if (typeof(model["parseItemField_"+fieldName]) === "function") {
            value = model["parseItemField_" + fieldName].bind(this)(e);
        }
        else if (e && e.target) value = e.target.value; else value = e;
        const item = this.getProps().item;
        if (item[collectionName][rowIndex][fieldName] === value) return;
        item[collectionName][rowIndex][fieldName] = value;
        const errors = _.cloneDeep(Store.getState().errors);
        let error = this.model.validateCollectionField(collectionName,fieldName,value,item);
        if (error) {
            if (!errors[collectionName]) errors[collectionName]={};
            if (!errors[collectionName][rowIndex]) errors[collectionName][rowIndex]={};
            errors[collectionName][rowIndex][fieldName] = error;
        }
        const stateItem = Store.getState().item;
        stateItem[this.model.itemName] = item;
        Store.changeProperties({"item":stateItem,"errors":errors});
    }
}