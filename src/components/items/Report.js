import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import {Button,Input,Checkbox} from '../../components/ui/Form';
import {QueryTab} from "../../models/ReportQuery";
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
            </div>,
            this.renderResultBlock(item)
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
            <div key="f2">
                <div>
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
                <th colSpan={2} style={{width:"90%"}}>{labels["name"]}</th>
                <th>{t("Actions")}</th>
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
        return queries.map((query,index) =>
            this.renderQueriesTableRow(Models.getInstanceOf("reportQuery").initItem(query),index,item
        ))
    }

    /**
     * Method used to render single row in queries table
     * @param query - Query model with fields
     * @param index - Index of row in table
     * @param item - link to item data
     * @returns Rendered component
     */
    renderQueriesTableRow(query,index,item) {
        return [
            <tr key={"query_"+index}>
                {this.renderRowHeader(query,index)}
                {this.renderRowActions(query,index,item)}
            </tr>,
            query.visible ? this.renderRowDetails(query,index) : null
        ]
    }

    renderRowHeader(query,index) {
        let props = {errors: this.props.errors["queries"] ? this.props.errors["queries"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        return (
            <td colSpan={2} style={{whiteSpace:'nowrap'}}>
                <table style={{width:'100%'}}>
                    <tbody>
                    <tr>
                        <td>
                            <Checkbox name="enabled" value={query.enabled}
                              ownerProps={{errors:props.errors[index]}} className="cls1"
                              onChange={
                                  (name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)
                              }
                            />
                        </td>
                        <td style={{width:'100%'}}>
                            <Input name="name" value={query.name} containerClass="tableInputContainer"
                               ownerProps={{errors:props.errors[index]}}
                               inputClass="tableInput"
                               onChange={
                                   (name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)
                               }/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        )
    }

    renderRowActions(query,index,item) {
        return (
            <td>
                <Button className="btn-xs btn-info"
                    iconClass={"glyphicon "+(query.visible ? "glyphicon-minus" : "glyphicon-plus")}
                    onPress={() => this.props.setQueryVisible(index,!query.visible)}
                />
                {query.order > 0 ? <Button className="btn-xs btn-success"
                                     iconClass="glyphicon glyphicon-arrow-up"
                                     onPress={() => this.props.setQuerySortOrder(index,index-1)}
                /> : null }
                {query.order < item.queries.length-1 ? <Button className="btn-xs btn-success"
                                                         iconClass="glyphicon glyphicon-arrow-down"
                                                         onPress={() => this.props.setQuerySortOrder(index,index+1)}
                /> : null }
                <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeQuery(index)}
                />
            </td>
        )
    }

    renderRowDetails(query,index) {
        let props = {errors: this.props.errors["queries"] ? this.props.errors["queries"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        return [
            <tr key={"query_details_header_"+index}>
                <td colSpan={3}>
                    <a style={{fontWeight: query.visibleTab===QueryTab.Query ? 'bold' : 'normal'}}
                       onClick={()=>this.props.switchTab(index,QueryTab.Query)}>{t("Query")}</a>&nbsp;
                    <a style={{fontWeight: query.visibleTab===QueryTab.Params ? 'bold' : 'normal'}}
                       onClick={()=>this.props.switchTab(index,QueryTab.Params)}>{t("Parameters")}</a>&nbsp;
                    <a style={{fontWeight: query.visibleTab===QueryTab.Format ? 'bold' : 'normal'}}
                       onClick={()=>this.props.switchTab(index,QueryTab.Format)}>{t("Format")}</a>&nbsp;
                    <br/><br/>
                    {query.visibleTab === QueryTab.Query ?
                        <Input name="query" value={query.query} containerClass="tableInputContainer"
                               ownerProps={{errors:props.errors[index]}}
                               codeMirror={{
                                   mode:'text/x-sql',
                                   lineNumbers:true
                               }}
                               inputClass="tableInput"
                               multiline={true}
                               onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                        : null
                    }
                    {query.visibleTab === QueryTab.Params ?
                        <Input name="params" value={query.params} containerClass="tableInputContainer"
                               ownerProps={{errors:props.errors[index]}}
                               codeMirror={{
                                   mode:'text/javascript',
                                   lineNumbers:true
                               }}
                               inputClass="tableInput"
                               multiline={true}
                               onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                        : null
                    }
                    {query.visibleTab === QueryTab.Format ?
                        <Input name="outputFormat" value={query.outputFormat} containerClass="tableInputContainer"
                               ownerProps={{errors:props.errors[index]}}
                               codeMirror={{
                                   mode:'text/javascript',
                                   lineNumbers:true
                               }}
                               inputClass="tableInput"
                               multiline={true}
                               onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
                        : null
                    }

                </td>
            </tr>
        ]
    }

    renderResultBlock(item) {
        return (
            <div className="col-sm-12" key={"resultBlock"}>
                <Button className="btn btn-success" iconClass="glyphicon glyphicon-refresh" text={t("Generate")}
                        onPress={()=>this.props.generateReport()} style={{marginRight:5}}/>
                <Button className="btn btn-info" iconClass="glyphicon glyphicon-remove" text={t("Clear")}
                        onPress={()=>this.props.clearReport()} style={{paddingRight:5}}/>
                <div className="col-sm-12 scrollTableContainer" style={{marginTop:10,height:500}}>
                    {this.props.reportData.map((query,index) => this.renderReport(query,index,item))}
                </div>
            </div>
        )
    }

    renderReport(query,rowIndex,item) {
        let format = {
            title: t('Report')+" # "+rowIndex,
            columns: []
        }
        try {
            format = JSON.parse(item.queries.filter(query=>query.enabled)[rowIndex].outputFormat)
        } catch (e) {
        }
        return [
            <h3 key={"report_result_title_"+rowIndex}>{format.title}</h3>,
            <table key={"report_result_table_"+rowIndex} className="table table-bordered table-condensed">
                <tbody>
                    {this.renderReportHeader(query,format)}
                    {this.renderReportRows(query,format)}
                </tbody>
            </table>
        ]
    }

    renderReportHeader(query,format) {
        if (!query.length) return null;
        let firstRow = query[0];
        if (typeof(firstRow) !== "object") firstRow = {0:firstRow};
        return (
            <tr>
                {Object.keys(firstRow).map(column_index => {
                    let title = column_index;
                    if (format.columns && format.columns[column_index] && format.columns[column_index].title)
                        title = format.columns[column_index].title
                    return <th>{title}</th>
                })}
            </tr>
        )
    }

    renderReportRows(query,format) {
        if (!query.length) return null;
        let columns = format.columns;
        return query.map((row,rowIndex) => {
            if (typeof(row) !== "object") row = {0:row};
            return this.renderReportRow(row,columns)
        })
    }

    renderReportRow(row,columnsFormat) {
        return (
            <tr>
                {
                    Object.keys(row).map(column_index => {
                        let value = row[column_index];
                        return <td>{value}</td>
                    })
                }
            </tr>
        )
    }
}