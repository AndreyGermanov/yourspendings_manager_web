import Entity from './Entity';
import t from "../utils/translate/translate";
import Models from './Models';

/**
 * Database model of User role entity
 */
export default class User extends Entity {

    constructor() {
        super();
        this.itemName = "user";
        this.collectionName = "users";
        this.itemTitle = t("User");
        this.collectionTitle = t("Users");
        this.fieldsToValidateInline = ["name","roles"];
        this.transientFields = ["confirmPassword"];
        this.relationFields = {
            "roles": { type: Models.RelationTypes.OneToMany, target: "role"}
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
        if (!item.password) item.password = "";
        if (!item.confirmPassword) item.confirmPassword = "";
        if (!item.enabled) item.enabled = 0;
        if (!item.roles) item.roles = [];
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "password": t("Password"),
            "confirmPassword": t("Confirm Password"),
            "enabled": t("Enabled"),
            "roles": t("Roles")
        }
    }

    /**
     * Method used to clean and prepare item data before sending to backend
     * @returns Object(hashmap) with data,ready to send to backend for this model
     */
    cleanDataForBackend(item) {
        if (!this.cleanField_password(item["password"])) {
            delete item["password"];
        } else {
            item["password"] = "{noop}" + item["password"];
        };
        return super.cleanDataForBackend(item);
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_name(value) {
        if (!this.cleanStringField(value)) return t("Name does not specified");
        return "";
    }

    validate_password(value,item) {
        var value = this.cleanStringField(value);
        if ((!item["uid"] || item["uid"] === "new") && !value) return t("Password must be specified");
        if (value && value !== item["confirmPassword"]) return t("Passwords must match");
        return "";
    }

    validate_roles(value) {
        if (!value.length) return t("At least single role should be selected");
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_password(value) {
        return this.cleanStringField(value);
    }

    cleanField_enabled(value) {
        return this.cleanIntField(value);
    }

    cleanField_roles(value) {
        if (typeof(value) !== "object") value = [value];
        return value.map((item) => item.uid ? item.uid : item)
    }

    /******************************************************************************
     * Methods which transforms values of item fields from form fields to values, *
     * ready to be in application state and in database                           *
     ******************************************************************************/

    parseItemField_enabled(event) {
        return event && event.target && event.target.checked ? 1 : 0
    }

    parseItemField_roles(value) {
        if (!value) value = [];
        return value.map((item) => item.uid ? item.uid : item);
    }

    /**********************************************************************
     * Methods return string representation of fields to display in lists *
     **********************************************************************/

    getStringOfField_roles(value) {
        return value.map((role) => role.name).join(", ");
    }

    getStringOfField_enabled(value) {
        return value ? "Yes" : "No";
    }
}
