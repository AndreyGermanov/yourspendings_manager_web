import React,{Component} from 'react';
import Store from '../../store/Store';
import _ from 'lodash';

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

    getFunction(name) {
        if (typeof(this.props.report.eventHandlers[name]) === "function") {
            return eval(this.props.report.eventHandlers[name]);
        } else if (typeof(this[name]) === "function") {
            return this[name]
        }
    }

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
        return eval(expression);
    }

    static getChartEngine(type,id,options,report) {
        let ChartJSChartEngine = require('./ChartJSChartEngine').default;

        switch(type) {
            case "chartjs": return <ChartJSChartEngine id={id} options={options} report={report}/>
        }
    }
}