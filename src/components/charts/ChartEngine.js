import React,{Component} from 'react';
import Store from '../../store/Store';
export default class ChartEngine extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div id={"chart_"+this.props.id}></div>
        )
    }

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

    parseOptionsField(field_id,field) {
        if (typeof(field["ys_config"]) === "undefined") return field;
        if (typeof(field["ys_config"]["function"]) !== "undefined") {
            let func = null;
            if (typeof(this.props.report.eventHandlers[field["ys_config"]["function"]["name"]]) === "function") {
                func = eval(this.props.report.eventHandlers[field["ys_config"]["function"]["name"]]);
            } else if (typeof(this[field["ys_config"]["function"]["name"]]) === "function") {
                func = this[field["ys_config"]["function"]["name"]]
            }
            if (!func) return field;
            let args = [this.props.report,this.props.options,this];
            if (typeof(field["ys_config"]["function"]["arguments"])!=="undefined")
                args.push(field["ys_config"]["function"]["arguments"]);
            return func.apply(this,args)
        }
        return field;
    }

    getDataColumn(report,options,context,config) {
        let result = [];
        if (typeof(config["column"]) !== "undefined") {
            let columnId = this.getDataColumnId(config["column"]);
            if (columnId === -1) return [];
            this.props.report.data.forEach(row => {
                if (typeof(config["condition"]) === "undefined") {result.push(row[columnId]);return};
                let metadata = row[row.length-1];
                let pass = this.calculateRowExpression(row,config["condition"]);
                if (pass) result.push(row[columnId]);
            })
        }
        return result;
    }

    getConfigFieldValue(report,options,context,config) {
        if (typeof(config["report_field"]) !== "undefined") {
            return this.getExpressionValue("this.props.report",Store.getPropertyNameExpression(config["report_field"]));
        }
        return "";
    }

    getDataColumnId(columnId) {
        if (!isNaN(Number(columnId))) {
            return columnId;
        } else {
            return this.props.report.format.columns.findIndex(column => column.id===columnId);
        }
    }

    getExpressionValue(collection,expression) {
        return eval(collection+expression)
    }

    calculateRowExpression(row,expression) {
        let metadata = row[row.length-1];
        this.props.report.format.columns.forEach((column,index) => {
            expression = expression.replace(new RegExp(column.id,'g'),"row["+index+"]");
        });
        console.log(expression);
        return eval(expression);
    }

    static getChartEngine(type,id,options,report) {
        let ChartJSChartEngine = require('./ChartJSChartEngine').default;

        switch(type) {
            case "chartjs": return <ChartJSChartEngine id={id} options={options} report={report}/>
        }
    }
}