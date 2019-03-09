import Entity from './Entity'
import React from "react";

/**
 * Component used to manage "Product category" item page
 */
export default class Shop extends Entity {

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
                <label className="col-sm-2">{labels["latitude"]}</label>
                <div className="col-sm-10">{item["latitude"]}</div>
            </div>,
            <div className="form-group" key="f3">
                <label className="col-sm-2">{labels["longitude"]}</label>
                <div className="col-sm-10">{item["longitude"]}</div>
            </div>,
            <div className="form-group" key="f4">
                <label className="col-sm-2">{labels["user"]}</label>
                <div className="col-sm-10">{item["user"].name}</div>
            </div>
        ]
    }
}