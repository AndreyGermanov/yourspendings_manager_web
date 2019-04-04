import React,{Component} from 'react';
export default class ChartEngine extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div id={"chart_"+this.props.id}></div>
        )
    }

    static getChartEngine(type,id,options) {
        let ChartJSChartEngine = require('./ChartJSChartEngine').default;

        switch(type) {
            case "chartjs": return <ChartJSChartEngine id={id} options={options}/>
        }
    }
}