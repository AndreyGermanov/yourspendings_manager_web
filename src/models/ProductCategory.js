import t from "../utils/translate/translate";
import Entity from './Entity';
import Models from './Models';
import Store from '../store/Store';

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
        this.collectionTitle = t("Categories");
        this.relationFields = {"parent":{type:Models.RelationTypes.ManyToOne,target:"productCategory"}}
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

    /**
     * Method used to fetch list of product categories from backend and populate appropriate property in state
     * which then used to display list in dropdowns
     * @param callback - Function called when operation finished
     */
    setListForDropdown(callback) { super.setListForDropdown("categories_list","uid","name",callback); }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    validate_parent(value,item) {
        if (value && !this.cleanIntField(value)) return t("Incorrect parent category specified");
        if (item["uid"] === value) return t("Parent could not be the same as current item");
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

    /******************************************************************************
     * Methods which transforms values of item fields from form fields to values, *
     * ready to be in application state and in database                           *
     ******************************************************************************/

    parseItemField_parent(event) {

        let result = parseInt(event);
        return isNaN(result) ? 0 : result;
    }
}