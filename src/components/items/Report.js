import Document from './Document'
import React from "react";
import t from "../../utils/translate/translate";
import {Button,Input,Checkbox} from '../../components/ui/Form';
import {QueryTab} from "../../models/ReportQuery";
import Models from '../../models/Models';
import ReportContainer from '../../containers/items/reports/Report';
const ReportResult = ReportContainer.getComponent();

/**
 * Component used to manage "Report" item page
 */
export default class Report extends Document {

    render() {
        if (!this.props.fullScreen) return super.render();
        if (!this.props.item) return null;
        const item = this.props.initItem(this.props.item);
        return <ReportResult/>
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
                    <ReportResult/>
                </div>
            </div>
        )
    }
}