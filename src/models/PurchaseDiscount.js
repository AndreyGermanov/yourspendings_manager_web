import Entity from './Entity';
import t from "../utils/translate/translate";
import Models from './Models';

/**
 * Database model of PurchaseDiscount entity
 */
export default class PurchaseDiscount extends Entity {

    constructor() {
        super();
        this.itemName = "purchaseDiscount";
        this.collectionName = "purchaseDiscounts";
        this.itemTitle = t("Purchase Discount");
        this.collectionTitle = t("Purchase Discounts");
        this.relationFields = {
            "discount": {type:Models.RelationTypes.ManyToOne,target:"discount"},
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
        if (!item.amount) item.amount = 0;
        if (!item.discount) item.discount = 0;
        if (!item.purchase) item.purchase = 0;
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "amount":t("Amount"),
            "discount":t("Discount"),
            "purchase":t("Purchase")
        }
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_amount(value) {
        if (!this.cleanDecimalField(value)) return t("Amount does not specified");
        return "";
    }

    validate_discount(value) {
        if (!this.cleanIntField(value)) return t("Discount does not specified");
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

    cleanField_amount(value) {
        return this.cleanDecimalField(value);
    }

    cleanField_discount(value) {
        return this.cleanIntField(value);
    }

    cleanField_purchase(value) {
        return this.cleanStringField(value);
    }
}
