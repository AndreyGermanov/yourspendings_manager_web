import Entity from './Entity';
import t from "../utils/translate/translate";
import Models from './Models';

/**
 * Database model of Discount entity
 */
export default class PurchaseProduct extends Entity {

    constructor() {
        super();
        this.itemName = "purchaseProduct";
        this.collectionName = "purchaseProducts";
        this.itemTitle = t("Purchase Product");
        this.collectionTitle = t("Purchase Products");
        this.relationFields = {
            "unit": {type:Models.RelationTypes.ManyToOne,target:"dimensionUnit"},
            "category": {type:Models.RelationTypes.ManyToOne,target:"productCategory"},
            "purchase": {type:Models.RelationTypes.ManyToOne,target:"purchase"}
        }
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = "";
        if (!item.price) item.price = 0;
        if (!item.count) item.count = 0;
        if (!item.discount) item.discount = 0;
        if (!item.unit) item.unit = 0;
        if (!item.category) item.category = 0;
        if (!item.purchase) item.purchase = 0;
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "price":t("Price"),
            "count":t("Count"),
            "discount":t("Discount"),
            "unit":t("Unit"),
            "category":t("Category"),
            "purchase":t("Purchase")
        }
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    validate_price(value) {
        if (!this.cleanDecimalField(value)) return t("Price does not specified");
        return "";
    }

    validate_count(value) {
        if (!this.cleanDecimalField(value)) return t("Count does not specified");
        return "";
    }

    validate_discount(value) {
        if (this.cleanStringField(value) && !this.cleanDecimalField(value)) return t("Discount does not specified");
        return "";
    }

    validate_unit(value) {
        if (!this.cleanIntField(value)) return t("Unit does not specified");
        return "";
    }

    validate_category(value) {
        if (!this.cleanIntField(value)) return t("Category does not specified");
        return "";
    }

    validate_purchase(value) {
        if (!this.cleanStringField(value)) return t("Purchase does not specified");
        return "";
    }


    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_price(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_count(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_discount(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_unit(value) {
        return this.cleanIntField(value);
    }

    cleanField_category(value) {
        return this.cleanIntField(value);
    }

    cleanField_purchase(value) {
        return this.cleanStringField(value);
    }
}
