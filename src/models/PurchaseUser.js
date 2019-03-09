import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of PurchaseUser entity
 */
export default class PurchaseUser extends Entity {

    constructor() {
        super();
        this.itemName = "purchaseUser";
        this.collectionName = "purchaseUsers";
        this.itemTitle = t("Purchase User");
        this.collectionTitle = t("Purchase Users");
        this.permissions = [];
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = "";
        if (!item.email) item.email = "";
        if (!item.phone) item.phone = "";
        if (!item.disabled) item.disabled = false;
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "email": t("Email"),
            "phone": t("Phone"),
            "disabled": t("Disabled")
        }
    }

    /**********************************************************************
     * Methods return string representation of fields to display in lists *
     **********************************************************************/

    getStringOfField_disabled(value) {
        return value ? t("Yes") : t("No")
    }
}
