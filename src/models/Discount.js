import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of Discount entity
 */
export default class Discount extends Entity {

    constructor() {
        super();
        this.itemName = "discount";
        this.collectionName = "discounts";
        this.itemTitle = t("Discount");
        this.collectionTitle = t("Discounts");
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = "";
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
        }
    }

    /**
     * Method used to fetch list of discounts from backend and populate appropriate property in state
     * which then used to display list in dropdowns
     * @param callback - Function called when operation finished
     */
    setListForDropdown(callback) { super.setListForDropdown("discounts_list","uid","name",callback); }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }
}
