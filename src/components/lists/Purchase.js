import React from 'react';
import Document from './Document';
import t from "../../utils/translate/translate";
import {Button} from '../ui/Form'

export default class Purchase extends Document {

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderActionButtons() {
        super.renderActionButtons();
        this.actionButtons.push(
            <Button className="btn btn-warning list-nav"
                onPress={() => this.props.sync()}
                iconClass="glyphicon glyphicon-plus" text={t("Sync")} key="b1"/>
        )
        return (
            <div style={{paddingBottom:'7px'}}>
                {this.actionButtons}
            </div>
        )
    }
}