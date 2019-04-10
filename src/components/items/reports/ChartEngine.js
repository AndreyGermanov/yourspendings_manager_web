import React,{Component} from 'react';
import Store from '../../../store/Store';
import _ from 'lodash';

/**
 * General Chart engine components used to generate charts in reports and handle all related events
 */
export default class ChartEngine extends Component {

    /**
     * Method used to render component to the screen
     * @returns Rendered component
     */
    render() {
        return (
            <div id={"chart_"+this.props.id}></div>
        )
    }

    /**
     * Recursive method used to parse Chart configuration object applying all embedded functions to it
     * @param node - Current not of configuration to parse. If not specified, parses root configuration node
     * @returns Object with configuration after applying all embedded instructions
     */
    parseOptions(node) {
        if (!node || typeof(node) === "undefined") node = this.props.options;
        for (var field_id in node) {
            let field = node[field_id];
            if (field && typeof(field) === "object" && typeof(field["ys_config"]) === "undefined") {
                node[field_id] = this.parseOptions(field);
            } else if (field) {
                node[field_id] = this.parseOptionsField(field_id,field);
            }
        }
        return node;
    }

    /**
     * Method used to parse individual field value in configuration object
     * @param field_id - ID of field
     * @param field - data of field
     * @returns Parsed field
     */
    parseOptionsField(field_id,field) {
        if (typeof(field["ys_config"]) === "undefined") return field;
        if (typeof(field["ys_config"]["function"]) !== "undefined") {
            let func = this.getFunction(field["ys_config"]["function"]["name"]);
            if (!func) return field;
            let args = [this.props.report,this.props.options,this];
            if (typeof(field["ys_config"]["function"]["arguments"])!=="undefined")
                args.push(field["ys_config"]["function"]["arguments"]);
            if (typeof(field["ys_config"]["function"]["execute"])==="undefined" || field["ys_config"]["function"]["execute"])
                return func.apply(this,args);
            else
                return func.bind(this,args);
        }
        return field;
    }

    /**
     * Method used to get function by name either from "Module" of current report in which this chart appear,
     * or from current module
     * @param name - Name of function
     * @returns Function or null
     */
    getFunction(name) {
        if (typeof(this.props.report.eventHandlers[name]) === "function") {
            return eval(this.props.report.eventHandlers[name]);
        } else if (typeof(this[name]) === "function") {
            return this[name]
        }
    }

    /**
     * Method returns all data from specified column of report, according to specified options as an array
     * @param report - Report result from which to get data
     * @param options - Chart configuration object
     * @param context - Link to current module
     * @param config - Options which applied to data (condition, sorting and others)
     * @returns Array of data
     */
    getDataColumn(report,options,context,config) {
        if (typeof(config["column"]) === "undefined") return [];
        let columnId = this.getDataColumnId(config["column"]);
        if (columnId === -1) return [];
        let data = _.cloneDeep(this.props.report.data).filter(row => {
            return typeof(config["condition"]) === "undefined" ||
                this.calculateRowExpression(row,config["condition"]);
        });
        if (typeof(config["sort"]) !== "undefined") {
            let func = null;
            if (typeof(config["sort"]["function"]) === "undefined") {
                func = ((row1,row2) => eval(config["sort"])).bind(this);
            } else {
                func = this.getFunction(config["sort"]["function"]["name"]);
                func = ((row1,row2) => func.call(context,row1,row2,config["sort"]["function"]["arguments"]))
                console.log(func);
            }
            data.sort(func);
        }
        return data.map(row => row[columnId]);
    }

    /**
     * Method return value of specified report configuration field
     * @param report - Report result from which to get data
     * @param options - Chart configuration object
     * @param context - Link to current module
     * @param config - Options which applied to returned value
     * @returns {string}
     */
    getConfigFieldValue(report,options,context,config) {
        if (typeof(config["report_field"]) !== "undefined") {
            return this.getExpressionValue("this.props.report",Store.getPropertyNameExpression(config["report_field"]));
        }
        return "";
    }

    /**
     * Method returns index of column by field ID
     * @param columnId - ID of field
     * @returns Index of column
     */
    getDataColumnId(columnId) {
        if (!isNaN(Number(columnId))) {
            return columnId;
        } else {
            return this.props.report.format.columns.findIndex(column => column.id===columnId);
        }
    }

    /**
     * Method used to evaluate expression on specified object and return value
     * @param collection - Base object to which expression will be connected
     * @param expression - Expression to evaluate
     * @returns Evaluation result
     */
    getExpressionValue(collection,expression) {
        return eval(collection+expression)
    }

    /**
     * Method used to calculate expression based on data row columns values
     * @param row - Row of data to get values from
     * @param expression - Expression to evaluate
     * @returns Evaluation result
     */
    calculateRowExpression(row,expression) {
        let metadata = row[row.length-1];
        this.props.report.format.columns.forEach((column,index) => {
            expression = expression.replace(new RegExp(column.id,'g'),"row["+index+"]");
        });
        return eval(expression);
    }

    /**
     * Method returns concrete chart Engine based on it type
     * @param type - Type of chart engine
     * @param id - ID of chart
     * @param options - Chart configuration object
     * @param report - Link to report to get data from
     * @returns Object - constructed Chart object
     */
    static getChartEngine(type,id,options,report) {
        let ChartJSChartEngine = require('./ChartJSChartEngine').default;

        switch(type) {
            case "chartjs": return <ChartJSChartEngine id={id} options={options} report={report}/>
        }
    }
}