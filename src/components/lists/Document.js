import React from 'react';
import Entity from './Entity';
import t from "../../utils/translate/translate";
import Form,{DateTime,Input,Button} from '../ui/Form';

/**
 * Base component to manage Documents (both list and item views). All documents inherits from it
 */
class Document extends Entity {

    /**
     * Method used to render management buttons for list view
     * @returns Rendered components with buttons
     */
    renderActionButtons() {
        super.renderActionButtons();
        return (
            <div style={{paddingBottom:'7px'}}>
                {this.actionButtons}
                <span className="pull-right">
                    <Form ownerProps={this.props}>
                        <div className="form-group">
                            <label className="control-label col-sm-2">{t("Период")}</label>
                            <DateTime name="periodStart" value={this.props.periodStart} dateFormat="DD.MM.YYYY"
                                      timeFormat="" onChange={this.props.changePeriodField}
                                      containerClass="col-sm-3"/>
                            <DateTime name="periodEnd" value={this.props.periodEnd} dateFormat="DD.MM.YYYY"
                                      timeFormat="" onChange={this.props.changePeriodField}
                                      containerClass="col-sm-3"/>
                            <Input name="search" onChange={this.props.changeListFilter} value={this.props.listFilter}
                                   placeholder={t("Поиск")+" ..."} inputStyle={{width:'220px'}}
                                    containerClass="col-sm-3"/>
                        </div>
                    </Form>
                </span>
            </div>
        )
    }
}

export default Document;