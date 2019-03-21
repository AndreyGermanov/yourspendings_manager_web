import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import {Button,Input,Checkbox} from '../../components/ui/Form';
import StorageConfig from '../../config/Storage';
import moment from 'moment-timezone';
import Store from "../../store/Store";
import Models from '../../models/Models';

/**
 * Component used to manage "Report" item page
 */
export default class Report extends Document {

    /**
     * Method used to render detail view
     */
    renderForm(item,labels) {
        return [
            <div className="form-group" key="f1">
                <Input name="name" value={item["name"]} label={labels["name"]}/>
            </div>,
            this.renderQueries(item,labels),
            <div className="form-group col-sm-12" align="center" key="f4">
                <Button onPress={() => this.props.saveToBackend()} text={t("Save")}
                        iconClass="glyphicon glyphicon-ok"/>
            </div>
        ]
    }

    /**
     * Method used to render products table
     * @param item - Item to get data from
     * @param labels - Labels for item fields
     * @returns Rendered component
     */
    renderQueries(item,labels) {
        return [
            <div className="row" key="f1">
                <label className="col-sm-1">{labels["queries"]}</label>
                <Button iconClass="glyphicon glyphicon-plus" className="btn btn-xs btn-success" text={t("Add")}
                    onPress={() => this.props.addQuery()}
                />
            </div>,
            <div id="scrollTable" key="f2">
                <div className="scrollTableContainer">
                    <table className="table table-bordered table-condensed">
                        <thead>
                            {this.renderQueriesHeader()}
                        </thead>
                        <tbody>
                            {this.renderQueriesTableRows(item)}
                        </tbody>
                    </table>
                </div>
            </div>
        ]
    }

    /**
     * Method used to render column headers for products table
     * @returns Rendered component
     */
    renderQueriesHeader() {
        const labels = this.props.getQueriesTableLabels();
        return (
            <tr>
                <th colSpan={2} style={{width:"90%"}}>{labels["name"]}<div>{labels["name"]}</div></th>
                <th>{t("Actions")}<div>{t("Actions")}</div></th>
            </tr>
        )
    }

    /**
     * Method used to render rows with products in products table
     * @param item - Item to get data from
     * @returns Rendered component
     */
    renderQueriesTableRows(item) {
        let queries = item.queries;
        queries.sort((s1,s2) => s1.order-s2.order);
        return queries.map((query,index) => this.renderQueriesTableRow(query,index,item))
    }

    /**
     * Method used to render single row in queries table
     * @param query - Query model with fields
     * @param index - Index of row in table
     * @returns Rendered component
     */
    renderQueriesTableRow(query,index,item) {
        let props = {errors: this.props.errors["queries"] ? this.props.errors["queries"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        return [
            <tr key={"query_"+index}>
                <td colSpan={2} style={{whiteSpace:'nowrap'}}>
                    <table style={{width:'100%'}}>
                        <tbody>
                        <tr>
                            <td>
                                <Checkbox name="enabled" value={query.enabled}
                                  ownerProps={{errors:props.errors[index]}} className="cls1"
                                  onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}
                                />
                            </td>
                            <td style={{width:'100%'}}>
                                <Input name="name" value={query.name} containerClass="tableInputContainer"
                                       ownerProps={{errors:props.errors[index]}}
                                       inputClass="tableInput"
                                       onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <Button className="btn-xs btn-info"
                            iconClass={"glyphicon "+(query.visible ? "glyphicon-minus" : "glyphicon-plus")}
                            onPress={() => this.props.setQueryVisible(index,!query.visible)}
                    />
                    {query.order>0 ? <Button className="btn-xs btn-success"
                            iconClass="glyphicon glyphicon-arrow-up"
                            onPress={() => this.props.setQuerySortOrder(index,index-1)}
                    /> : null }
                    {query.order<item.queries.length-1 ? <Button className="btn-xs btn-success"
                                                  iconClass="glyphicon glyphicon-arrow-down"
                                                  onPress={() => this.props.setQuerySortOrder(index,index+1)}
                    /> : null }
                    <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeQuery(index)}
                    />
                </td>
            </tr>,
            query.visible ? <tr key={"query_details_header_"+index}>
                <th>{t("Query")}</th>
                <th>{t("Parameters")}</th>
                <th>{t("Output format")}</th>
            </tr> : null,
            query.visible ? <tr key={"query_details_"+index}>
                <td>
                    <Input name="query" value={query.query} containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                           inputClass="tableInput"
                           multiline={true}
                           onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                </td>
                <td>
                    <Input name="params" value={query.params} containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                           inputClass="tableInput"
                           multiline={true}
                           onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                </td>
                <td>
                    <Input name="outputFormat" value={query.outputFormat} containerClass="tableInputContainer"
                           ownerProps={{errors:props.errors[index]}}
                           inputClass="tableInput"
                           multiline={true}
                           onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                </td>
            </tr> : null
        ]
    }
}