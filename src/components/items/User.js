import Entity from './Entity'
import React from "react";
import t from '../../utils/translate/translate';
import {Input,Button,Checkbox,Select} from '../ui/Form';

/**
 * Component used to manage "Product category" item page
 */
export default class User extends Entity {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        let roles = typeof(item["roles"]) === "object" ? item["roles"].map(role => role.uid ? role.uid : role) : [item["roles"]];
        return [
            <div className="form-group" key="f1">
                <Input name="name" value={item["name"]} label={labels["name"]}/>
            </div>,
            <div className="form-group" key="f2">
                <Input name="password" value={item["password"]} label={labels["password"]} password={true}/>
            </div>,
            <div className="form-group" key="f3">
                <Input name="confirmPassword" value={item["confirmPassword"]} label={labels["confirmPassword"]}
                   password={true}/>
            </div>,
            <div className="form-group" key="f4">
                <Select name="roles" items={this.props.roles_list} multiple={true}
                        value={roles} label={labels["roles"]}
                />
            </div>,
            <div className="form-group" key="f5">
                <Checkbox name="enabled" value={item["enabled"]} label={labels["enabled"]}/>
            </div>,
            <div className="form-group" align="center" key="f6">
                <Button onPress={() => this.props.saveToBackend()} text={t("Save")}
                        iconClass="glyphicon glyphicon-ok"/>
            </div>
        ]
    }
}