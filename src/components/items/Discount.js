import Entity from './Entity'
import React from "react";
import t from '../../utils/translate/translate';
import {Input,Button} from '../ui/Form';

/**
 * Component used to manage "Discount" item page
 */
export default class Discount extends Entity {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        return [
            <div className="form-group" key="f1">
                <Input name="name" value={item["name"]} label={labels["name"]}/>
            </div>,
            <div className="form-group" align="center" key="f5">
                <Button onPress={() => this.props.saveToBackend()} text={t("Save")}
                        iconClass="glyphicon glyphicon-ok"/>
            </div>
        ]
    }
}