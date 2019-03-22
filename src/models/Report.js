import Document from './Document';
import t from "../utils/translate/translate";
import Models from './Models';
import Backend from '../backend/Backend';

/**
 * Database model of Report entity
 */
export default class Report extends Document {

    constructor() {
        super();
        this.itemName = "report";
        this.collectionName = "reports";
        this.itemTitle = t("Report");
        this.collectionTitle = t("Reports");
        this.relationFields = {
            "queries":{type:Models.RelationTypes.OneToMany,target:"reportQueries",inline:true}
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
        if (!item.queries) item.queries = [];
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "queries": t("Queries")
        }
    }

    generateReport(item,callback) {
        if (typeof(callback) !== "function") callback = () => {};
        Backend.request("/api/report/generate",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(item.queries.filter(q => q.enabled))
        },(error, response) => {
            if (!response || response.status >399 || error) { callback(true);return; }
            response.json().then((result) => { callback(null,result);});
        })
    }

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
