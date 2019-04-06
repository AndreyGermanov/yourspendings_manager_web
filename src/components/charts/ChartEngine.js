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
        let parser = field_id;
        if (typeof(field["ys_config"]["parser"]) !== "undefined" && field["ys_config"]["parser"].length)
            parser = field["ys_config"]["parser"];
        if (typeof(this["parseOptionsField_"+parser]) === "function") {
            return this["parseOptionsField_"+parser](field["ys_config"])
        }
        return field;
    }

    parseOptionsField_data(config) {
        let result = [];
        if (typeof(config["column"]) !== "undefined") {
            let columnId = this.getDataColumnId(config["column"]);
            if (columnId === -1) return [];
            this.props.report.data.forEach(row => {
                if (typeof(config["condition"]) === "undefined") {result.push(row[columnId]);return};
                let metadata = row[row.length-1];
                let pass = true;
                for (var condition in config["condition"]) {
                    if (typeof(metadata[condition]) === "undefined" ||
                        metadata[condition] !== config["condition"][condition]) {
                        pass = false;
                        break;
                    }
                };
                if (pass) result.push(row[columnId]);
            })
        } else if (typeof(config["function"] !== "undefined")) {
            console.log(this.report);
        }
        return result;
    }

    parseOptionsField_labels(config) {
        return this.parseOptionsField_data(config);
    }

    parseOptionsField_label(config) {
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

    static getChartEngine(type,id,options,report) {
        let ChartJSChartEngine = require('./ChartJSChartEngine').default;

        switch(type) {
            case "chartjs": return <ChartJSChartEngine id={id} options={options} report={report}/>
        }
    }
}