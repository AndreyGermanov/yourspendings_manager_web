import Entity from './Entity';
import t from "../utils/translate/translate";
import Models from './Models';

/**
 * Database model of ReportQuery entity
 */
export default class ReportQuery extends Entity {

    constructor() {
        super();
        this.itemName = "reportQuery";
        this.collectionName = "reportQueries";
        this.itemTitle = t("Report query");
        this.collectionTitle = t("Report query");
        this.relationFields = {
            "report": {type:Models.RelationTypes.ManyToOne,target:"report"}
        };
        this.transientFields = ["visible","visibleTab"]
    }

    /**
     * Method used to initialize item, by populating all empty or undefined fields with default values
     * @param item: Input item
     * @returns item with populated values
     */
    initItem(item) {
        item = super.initItem(item);
        if (!item.name) item.name = "";
        if (!item.enabled) item.enabled = 0;
        if (!item.visible) item.visible = 0;
        if (!item.order) item.order = 0;
        if (!item.query) item.query = "";
        if (!item.params) item.params = "";
        if (!item.outputFormat) item.outputFormat = "";
        if (!item.report) item.report = 0;
        if (!item.postScript) item.postScript = "";
        if (!item.visibleTab) item.visibleTab = QueryTab.Query;
        return item;
    }

    /**
     * Method returns field labels for all fields of this model
     * @returns Object
     */
    getFieldLabels() {
        return {
            "name":t("Name"),
            "enabled":t("Enabled"),
            "visible":t("Visible"),
            "order": t("Sort Order"),
            "query": t("Query"),
            "params": t("Query Parameters"),
            "outputFormat":t("Output Format"),
            "postScript":t("Post Script"),
            "report":t("Report"),
            "visibleTab":t("Visible Tab")
        }
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

    cleanField_order(value) {
        return this.cleanIntField(value)
    }

    cleanField_enabled(value) {
        return this.cleanIntField(value)
    }

    cleanField_visible(value) {
        return this.cleanIntField(value)
    }

    cleanField_query(value) {
        return this.cleanStringField(value)
    }

    cleanField_params(value) {
        return this.cleanStringField(value)
    }

    cleanField_outputFormat(value) {
        return this.cleanStringField(value)
    }

    cleanField_report(value) {
        return this.cleanStringField(value);
    }

    cleanField_postScript(value) {
        return this.cleanStringField(value)
    }


    /******************************************************************************
     * Methods which transforms values of item fields from form fields to values, *
     * ready to be in application state and in database                           *
     ******************************************************************************/

    parseItemField_enabled(event) {
        return event && event.target && event.target.checked ? 1 : 0
    }
}

export const QueryTab = {
    Query: 'QueryTab_Query',
    Params: 'QueryTab_Params',
    Format: 'QueryTab_Format',
    PostScript: 'QueryTab_PostScript'
}