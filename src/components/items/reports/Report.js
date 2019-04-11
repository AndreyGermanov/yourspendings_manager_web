import React,{Component} from "react";
import _ from "lodash";
import ChartEngine from "./ChartEngine";
import JsxParser from 'react-jsx-parser';
import {Button} from '../../ui/Form';

/**
 * Method used to generate report based on "reportData" which is combination of data rows,
 * returned from backend and metadata of "Report" entity
 */
export default class Report extends Component {

    /**
     * Method used to render generated report (all queries one by one)
     * @param item - Link to report data
     * @returns Rendered component
     */
    render() {
        return this.props.reportData.map((query,index) => this.renderReport(query,index));
    }

    /**
     * Method used to render single query result of report
     * @param query - Query result data from server
     * @param rowIndex - Index of query
     * @param item - Link to report data
     * @returns Rendered component
     */
    renderReport(query,rowIndex) {
        let table = this.renderReportTable(query,rowIndex);
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
    renderReportTable(query,rowIndex) {
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
                    if (format.columns && format.columns.length && format.columns[column_index].hidden) return null;
                    let title = column_index;
                    if (format.columns && format.columns[column_index] && format.columns[column_index].title)
                        title = format.columns[column_index].title;
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
        if (column && typeof(column) !== "undefined") return columns.indexOf(column);
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
