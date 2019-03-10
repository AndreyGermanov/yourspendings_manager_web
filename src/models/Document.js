import Entity from './Entity';
import moment from "moment-timezone";
import t from '../utils/translate/translate';

/**
 * Base database model for documents
 */
class Document extends Entity {
    constructor() {
        super();
        this.itemName = "document";
        this.collectionName = "documents";
        this.itemTitle = t("Документ");
        this.collectionTitle = t("Документы");
    }

    /**
     * Method returns title of item in Detail View form
     * @param item - Item to get title form
     * @returns {string} Generated title
     */
    getItemPresentation(item) {
        let title = this.itemTitle;
        if (item["number"]) title += ' № ' + item['number'];
        if (item["date"]) title += ' ' + t("от")+" "+moment(item["date"]).format("DD.MM.YYYY HH:mm:ss");
        return title;
    }

    /********************************************************
     * Functions used to convert field value from a form    *
     * which it has in input to the form which accepted by  *
     * application state                                    *
     ********************************************************/
    parseItemField_date(date) {
        if (typeof(moment(date).unix) === "function") {
            return moment(date).unix()
        }
        return 0;
    }

    /**
     * Methods used to render presentations of field values
     * in list view
     * @param value: Source value
     * @returns string - formatted string
     */
    getStringOfField_date(value) {
        return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }

    getStringOfField_amount(value) {
        const result = this.cleanDecimalField(value);
        if (result!==null) {
            return result.toFixed(2);
        }
        return "0";
    }
}

export default Document;