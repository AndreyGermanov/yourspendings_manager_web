import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import {Button,Input,Checkbox} from '../../components/ui/Form';
import {QueryTab} from "../../models/ReportQuery";
import Models from '../../models/Models';
import _ from 'lodash';
import JsxParser from 'react-jsx-parser';
import ChartEngine from '../charts/ChartEngine';

/**
 * Component used to manage "Report" item page
 */
export default class Report extends Document {

    render() {
        if (!this.props.fullScreen) return super.render();
        if (!this.props.item) return null;
        const item = this.props.initItem(this.props.item);
        return this.renderReports(item);
    }

    /**
     * Method starts after component rendered and displayed on the screen
     */
    componentDidMount() {
        this.props.updateItem(this.props.uid, () => {
            if (this.props.fullScreen) {
                this.props.generateReport()
            }
        });
    }

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
            this.renderResultBlock(item),
            <div className="form-group col-sm-12" key="f5" style={{marginTop:20}}><label>{t("Post Script")}</label></div>,
            <div className="form-group col-sm-12" key="f6" style={{marginTop:20}}>
                <Input name="postScript" value={item["postScript"]}
                       codeMirror={{
                           mode:'text/javascript',
                           lineNumbers:true
                       }}
                       multiline={true}
                />
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
     * Method used to render rows with queries in queries table
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

    /**
     * Method renders first line of query row
     *
     * @param query - Query data
     * @param index - Index of query in queries list
     * @returns Rendered component
     */
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

    /**
     * Method used to render content of "Actions" column of query row.
     * @param query - Query data
     * @param index - Index of query in a list
     * @param item - Link to whole report data
     * @returns Rendered component
     */
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
                <Button className="btn-xs btn-warning" iconClass="glyphicon glyphicon-duplicate"
                        onPress={() => this.props.copyQuery(index)}
                />
                <Button className="btn-xs btn-danger" iconClass="glyphicon glyphicon-remove"
                        onPress={() => this.props.removeQuery(index)}
                />
            </td>
        )
    }

    /**
     * Method render details row for query
     * @param query - Query data
     * @param index - Index of query in a list
     * @returns Rendered component
     */
    renderRowDetails(query,index) {
        return [
            <tr key={"query_details_header_"+index}>
                <td colSpan={3}>
                    {this.renderDetailsTab(query,index,t("Query"),QueryTab.Query)}
                    {this.renderDetailsTab(query,index,t("Parameters"),QueryTab.Params)}
                    {this.renderDetailsTab(query,index,t("Layout"),QueryTab.Layout)}
                    {this.renderDetailsTab(query,index,t("Format"),QueryTab.Format)}
                    {this.renderDetailsTab(query,index,t("Post Script"),QueryTab.PostScript)}
                    {this.renderDetailsTab(query,index,t("Module"),QueryTab.EventHanders)}
                    <br/><br/>
                    {this.renderDetailsContent(query,index)}
                </td>
            </tr>
        ]
    }

    /**
     * Renders tab title for query details row
     * @param query - Query data
     * @param index - Index of query in a list
     * @param name - Text name of tab
     * @param tab - Tab Id
     * @returns Rendered component
     */
    renderDetailsTab(query,index,name,tab) {
        return (
            <a style={{marginRight:5,fontWeight: query.visibleTab===tab ? 'bold' : 'normal'}}
               onClick={()=>this.props.switchTab(index,tab)}>{name}</a>
        )
    }

    /**
     * Method renders single tab of query row details, depending on selected tab
     * @param query - Query data
     * @param index - Index of query in a list
     * @returns Rendered component
     */
    renderDetailsContent(query,index) {
        switch (query.visibleTab) {
            case QueryTab.Query:return this.renderEditor(query, index, "query", "text/x-sql");
            case QueryTab.Params:return this.renderEditor(query, index, "params", "text/javascript");
            case QueryTab.Layout:return this.renderEditor(query, index, "layout", "text/html");
            case QueryTab.Format:return this.renderEditor(query, index, "outputFormat", "text/javascript");
            case QueryTab.PostScript:return this.renderEditor(query, index, "postScript", "text/javascript");
            case QueryTab.EventHanders:return this.renderEditor(query, index, "eventHandlers", "text/javascript");
            default: return null;
        }
    }

    /**
     * Renders tab content for query details row
     * @param query - Query data
     * @param index - Index of query in a list
     * @param fieldName - Name of data field, for which this tab is intended
     * @param mode - Mode of code editor
     * @returns Rendered component
     */
    renderEditor(query,index,fieldName,mode) {
        let props = {errors: this.props.errors["queries"] ? this.props.errors["queries"]: {}};
        if (!props.errors[index]) props.errors[index] = {};
        return (
            <Input name={fieldName} value={query[fieldName]} containerClass="tableInputContainer"
                   ownerProps={{errors:props.errors[index]}}
                   codeMirror={{
                       mode:mode,
                       lineNumbers:true
                   }}
                   inputClass="codeMirror"
                   multiline={true}
                   onChange={(name,text)=>this.props.changeTableField("reportQuery","queries",index,name,text)}/>
        )
    }

    /**
     * Method used to render Report generation block
     * @param item - Link to report data
     * @returns Rendered component
     */
    renderResultBlock(item) {
        return (
            <div className="col-sm-12" key={"resultBlock"}>
                <Button className="btn btn-success" iconClass="glyphicon glyphicon-refresh" text={t("Generate")}
                        onPress={()=>this.props.generateReport()} style={{marginRight:5}}/>
                { this.props.reportData && this.props.reportData.length ?
                [<Button className="btn btn-primary" iconClass="glyphicon glyphicon-save" text={t("Export CSV")}
                        onPress={()=>this.props.exportCsv()} style={{marginRight:5}} key="b1"/>,
                    <Button className="btn btn-primary" iconClass="glyphicon glyphicon-share" text={t("Full Screen")}
                    onPress={()=>window.open("#/report/"+this.props.uid+"/full")} style={{paddingRight:5,marginRight:5}} key="b2"/>
                    ]
                : null }
                <Button className="btn btn-info" iconClass="glyphicon glyphicon-remove" text={t("Clear")}
                        onPress={()=>this.props.clearReport()} style={{paddingRight:5}}/>
                <div className="col-sm-12 scrollTableContainer" style={{marginTop:10,height:500}}>
                    {this.renderReports(item)}
                </div>
            </div>
        )
    }

    /**
     * Method used to render generated report (all queries one by one)
     * @param item - Link to report data
     * @returns Rendered component
     */
    renderReports(item) {
        return this.props.reportData.map((query,index) => this.renderReport(query,index,item));
    }

    /**
     * Method used to render single query result of report
     * @param query - Query result data from server
     * @param rowIndex - Index of query
     * @param item - Link to report data
     * @returns Rendered component
     */
    renderReport(query,rowIndex,item) {
        let table = this.renderReportTable(query,rowIndex,item);
        if (!query.layout) return table;
        let bindings = {};
        if (query.format.displayTable !== false) bindings['table'] = table;
        if (query.format.charts && query.format.charts.length) {
            query.format.charts.forEach((chart) => {
                if (chart.display !== false) {
                    bindings["chart_"+chart.id] =
                        ChartEngine.getChartEngine(chart.engine,chart.id,chart.options[chart.engine],query)
                }
            })
        }
        return <JsxParser key={"report_"+rowIndex}
           bindings={bindings}
           jsx={query.layout}
        />
    }

    /**
     * Renders query results table of single query
     * @param query - Query data
     * @param rowIndex - Index of query
     * @param item - Link to report data
     * @returns Rendered component
     */
    renderReportTable(query,rowIndex,item) {
        return [
            <h3 key={"report_result_title_"+rowIndex}>{query.format.title}</h3>,
            <table key={"report_result_table_"+rowIndex} className="table table-bordered table-condensed">
                <tbody>
                    {this.renderReportHeader(query)}
                    {this.renderReportRows(query)}
                </tbody>
            </table>
        ]
    }

    /**
     * Renders table header row for single query result
     * @param query - Query data
     * @returns Rendered component
     */
    renderReportHeader(query) {
        if (!query.data || !query.data.length) return null;
        let firstRow = query.data[0];
        let format = query.format;
        return (
            <tr>
                {firstRow.map((value,column_index) => {
                    if (format.columns && column_index >= format.columns.length && format.columns.length) return null;
                    if (column_index === firstRow.length-1) return null;
                    let title = column_index;
                    if (format.columns && format.columns[column_index] && format.columns[column_index].title)
                        title = format.columns[column_index].title
                    if (format.columns && format.columns.length && format.columns[column_index].hidden) return null;
                    return <th key={"report_"+firstRow+"_"+column_index}>{title}</th>
                })}
            </tr>
        )
    }

    /**
     * Method used to render query results data rows
     * @param query - Query data
     * @returns Rendered component
     */
    renderReportRows(query) {
        if (!query.data || !query.data.length) return null;
        return query.data.map((row,rowIndex) => {
            return this.renderReportRow(query,row,rowIndex)
        })
    }

    /**
     * Method used to render single row in query result table
     * @param query - Query data
     * @param row - Row data
     * @param rowIndex - Index of row
     * @returns Rendered component
     */
    renderReportRow(query,row,rowIndex) {
        if (!this.isRowVisible(query,rowIndex)) return null;
        let openedRows = this.props.openedRows;
        let {columnsFormat,groupFormat,style} = this.getRowFormat(query,row);
        let styles = row[columnsFormat.length].styles;
        let onclick = query.eventHandlers && query.eventHandlers['onCellClick'] ? query.eventHandlers['onCellClick'] : () => {};
        return (
            <tr key={"report_row_"+row+"_"+rowIndex}>
                {
                    row.map((value,column_index) => {
                        if (column_index >= columnsFormat.length && columnsFormat.length) return null;
                        if (columnsFormat.length && columnsFormat[column_index].hidden) return null;
                        if (column_index === row.length-1) return null;
                        let text = value;
                        let columnStyle = _.cloneDeep(style);
                        if (styles && styles[column_index]) {
                            columnStyle = Object.assign(columnStyle,styles[column_index]);
                        }
                        if (groupFormat && groupFormat.collapsed && column_index == this.getColumnIndex(groupFormat.fieldIndex,columnsFormat))
                            text = <table style={{width:'100%'}}><tbody><tr style={{verticalAlign:'top'}}><td style={columnStyle}>
                                <Button className="btn-xs btn-info"
                                      iconClass={"glyphicon "+(openedRows[rowIndex] ? "glyphicon-minus" : "glyphicon-plus")}
                                      onPress={() =>  this.props.switchRow(rowIndex)}
                                />
                            </td>
                            <td style={{width:'100%',paddingLeft:10}}>
                                {value}
                            </td></tr></tbody></table>
                        return <td style={columnStyle}
                                   key={"report_row_"+rowIndex+"_"+column_index}
                                   onClick={() => onclick(row,rowIndex,column_index,this)}>
                            {text}
                        </td>
                    })
                }
            </tr>
        )
    }

    /**
     * Utility method which returns formatting information about specified row
     * @param query - Query result data
     * @param row - Row data
     * @returns object of data: columnsFormat,groupFormat,style
     */
    getRowFormat(query,row) {
        let format = query.format;
        let columnsFormat = format.columns ? format.columns : [];
        let groupsFormat = format.groups;
        let style = {};
        let groupFormat = null;
        let hierarchyLevel = row[columnsFormat.length].hierarchyLevel ? row[columnsFormat.length].hierarchyLevel : 0;
        if (groupsFormat && groupsFormat[row[columnsFormat.length].groupColumn])
            groupFormat = groupsFormat[row[columnsFormat.length].groupColumn];
        if (row[columnsFormat.length].totalsRow) {
            if (format.totals && format.totals.style)
                style = format.totals.style;
            else
                style = {fontWeight:'bold',backgroundColor:"#CCCCCC"}
        } else if (groupFormat) {
            style = {fontWeight:'bold',backgroundColor:'#CCCCCC'};
            if (groupFormat.style) {
                style = _.cloneDeep(groupFormat.style);
            }

            if (groupFormat["hierarchy"] && groupFormat["hierarchy"]["styles"] &&
                groupFormat["hierarchy"]["styles"].filter(item => item.level == row[columnsFormat.length].hierarchyLevel).length) {
                style = _.cloneDeep(groupFormat["hierarchy"]["styles"].filter(item => item.level == row[columnsFormat.length].hierarchyLevel)[0].style);
            }
            if (groupFormat.collapsed) style.paddingLeft = hierarchyLevel*10;
        }
        return {groupFormat:groupFormat,columnsFormat:columnsFormat,style:style}
    }

    /**
     * Method returns index of column by field ID
     * @param fieldId - ID of field
     * @param columns - list of columns metadata
     * @returns Id of column
     */
    getColumnIndex(fieldId,columns) {
        if (!isNaN(parseInt(fieldId))) return fieldId;
        let column = columns.filter((item) => item.id == fieldId)[0];
        if (column && typeof(column) != undefined) return columns.indexOf(column);
    }

    /**
     * Method used to determine is specified row visible or inside collapsed group
     * @param query - Query result data
     * @param rowIndex - Index of row to check
     * @returns Boolean - True if row visible or false otherwise
     */
    isRowVisible(query,rowIndex) {
        let openRows = this.props.openedRows;
        let row = query.data[rowIndex];
        let metadata = row[row.length-1];
        let groupsFormat = query.format.groups;
        let columnsFormat = query.format.columns;
        let groupFormat = {};
        while (typeof(metadata) !== 'undefined' && metadata && typeof(metadata.parent) !== 'undefined') {
            let parentRow = query.data[metadata.parent];
            if (groupsFormat && parentRow && groupsFormat[parentRow[columnsFormat.length].groupColumn]) {
                groupFormat = groupsFormat[parentRow[columnsFormat.length].groupColumn]
            }
            if (typeof(openRows[metadata.parent]) === "undefined" || !openRows[metadata.parent]) {
                if (groupFormat.collapsed) return false;
            }
            if (groupFormat.collapsed && !openRows[metadata.parent]) return false;
            if (parentRow) metadata = parentRow[parentRow.length-1]; else metadata = null;
        }
        return true;
    }
}