import Entity from './Entity'
import React from "react";
import t from '../../utils/translate/translate'

/**
 * Component used to manage "Product category" item page
 */
export default class PurchaseUser extends Entity {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        return [
            <div className="form-group" key="f1">
                <label className="col-sm-2">{labels["name"]}</label>
                <div className="col-sm-10">{item["name"]}</div>
            </div>,
            <div className="form-group" key="f2">
                <label className="col-sm-2">{labels["email"]}</label>
                <div className="col-sm-10">{item["email"]}</div>
            </div>,
            <div className="form-group" key="f3">
                <label className="col-sm-2">{labels["phone"]}</label>
                <div className="col-sm-10">{item["phone"]}</div>
            </div>,
            <div className="form-group" key="f4">
                <label className="col-sm-2">{labels["isDisabled"]}</label>
                <div className="col-sm-10">{item["isDisabled"] ? t("Yes") : t("No")}</div>
            </div>
        ]
    }
}