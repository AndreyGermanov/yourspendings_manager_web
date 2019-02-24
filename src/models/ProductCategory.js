import t from "../utils/translate/translate";
import Entity from './Entity';

/**
 * Database model of Product Category entity
 */
export default class ProductCategory extends Entity {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.itemName = "productCategory";
        this.collectionName = "productCategories";
        this.itemTitle = t("Category");
        this.listTitle = t("Categories");
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = "";
        if (!item.parent) item.parent = "";
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "parent": t("Parent Category")
        }
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    validate_parent(value) {
        if (value && !this.cleanIntField(value)) return t("Incorrect parent category specified");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_parent(value) {
        return this.cleanIntField(value);
    }

}