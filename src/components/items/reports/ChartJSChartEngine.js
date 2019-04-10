import React from 'react';
import ChartEngine from './ChartEngine'
import Chart from 'chart.js'
import _ from 'lodash';

/**
 * Component used as a wrapper for ChartsJS chart engine
 */
export default class ChartJSChartEngine extends ChartEngine {

    /**
     * Method runs after component appeared on the screen
     */
    componentDidMount() {
        let options = _.cloneDeep(this.parseOptions(this.props.options));
        this.elem = document.getElementById("chart_"+this.props.id)
        this.chart = new Chart(this.elem.getContext('2d'),options)
    }

    /**
     * Method used to render component on the screen
     * @returns Rendered component
     */
    render() {
        let width = this.props.options.width ? this.props.options.width : "100%";
        let height = this.props.options.height ? this.props.options.height : "100%";
        return (
            <canvas width={width} height={height} id={"chart_"+this.props.id}></canvas>
        )
    }
}

