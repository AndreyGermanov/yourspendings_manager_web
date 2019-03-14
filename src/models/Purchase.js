import Document from './Document';
import t from "../utils/translate/translate";
import moment from 'moment-timezone';
import Models from './Models';
import Backend from '../backend/Backend';

/**
 * Database model of Purchase entity
 */
export default class Purchase extends Document {

    constructor() {
        super();
        this.itemName = "purchase";
        this.collectionName = "purchases";
        this.itemTitle = t("Purchase");
        this.collectionTitle = t("Purchases");
        this.permissions = [Models.Permissions.update];
        this.relationFields = {
            "products":{type:Models.RelationTypes.OneToMany,target:"purchaseProduct",inline:true},
            "purchaseDiscounts":{type:Models.RelationTypes.OneToMany,target:"purchaseDiscount",inline:true},
        }
        this.transientFields = ["images","purchaseImageIndex","user","place"];
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.date) item.date = moment().unix();
        if (!item.place) item.place = {};
        if (!item.user) item.user = {};
        if (!item.images) item.images = [];
        if (!item.products) item.products = [];
        if (!item.purchaseDiscounts) item.purchaseDiscounts = [];
        if (!item.purchaseImageIndex) item.purchaseImageIndex = 0;
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "date":t("Date"),
            "place": t("Shop"),
            "user": t("User"),
            "images": t("Images"),
            "products": t("Products"),
            "purchaseDiscounts": t("Discounts")
        }
    }

    sync(callback=()=>{}) {
        Backend.request('/api/'+this.itemName+'/sync/', function(error,response) {
            callback();
        });
    }

    /**********************************************************************
     * Methods return string representation of fields to display in lists *
     **********************************************************************/

    getStringOfField_user(value) {
        return value && value.email ? value.email : ""
    }

    getStringOfField_place(value) {
        return value && value.name ? value.name : ""
    }

    cleanField_date(value) {
        return value.split("+").shift();
    }

}
