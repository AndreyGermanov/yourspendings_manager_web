import Entity from './Entity'
import React from "react";
import t from '../../utils/translate/translate';
import {Input,Button,Select} from '../ui/Form';

/**
 * Component used to manage "Product category" item page
 */
export default class ProductCategory extends Entity {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        const parent = typeof(item.parent) === "object" ? item.parent["uid"] : item.parent;
        return [
            <div className="form-group" key="f1">
                <Input name="name" value={item["name"]} label={labels["name"]}/>
            </div>,
            <div className="form-group" key="f3">
                <Select name="parent" items={this.props.categories_list}
                        value={parent} label={labels["parent"]}
                />
            </div>,
            <div className="form-group" align="center" key="f5">
                <Button onPress={() => this.props.saveToBackend()} text={t("Save")}
                        iconClass="glyphicon glyphicon-ok"/>
            </div>
        ]
    }
}