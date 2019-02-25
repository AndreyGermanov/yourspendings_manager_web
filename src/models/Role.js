import Entity from './Entity';
import t from "../utils/translate/translate";

/**
 * Database model of User role entity
 */
export default class Role extends Entity {

    constructor() {
        super();
        this.itemName = "role";
        this.collectionName = "roles";
        this.itemTitle = t("Role");
        this.collectionTitle = t("Roles");
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.roleId) item.roleId = "";
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
            "roleId": t("ID")
        }
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    validate_roleId(value) {
        if (!this.cleanStringField(value)) return t("Incorrect parent category specified");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_roleId(value) {
        return this.cleanStringField(value);
    }

}
