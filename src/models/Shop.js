import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of Shop entity
 */
export default class Shop extends Entity {

    constructor() {
        super();
        this.itemName = "shop";
        this.collectionName = "shops";
        this.itemTitle = t("Shop");
        this.collectionTitle = t("Shops");
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
        if (!item.latitude) item.latitude = 0;
        if (!item.longitude) item.longitude = 0;
        if (!item.user) item.user = {};
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "latitude": t("Latitude"),
            "longitude": t("Longitude"),
            "user": t("User")
        }
    }

    /**********************************************************************
     * Methods return string representation of fields to display in lists *
     **********************************************************************/

    getStringOfField_user(value) {
        return value && value.email ? value.email : ""
    }
}
