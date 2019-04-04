import React from 'react';
import ChartEngine from './ChartEngine'
import Chart from 'chart.js'

export default class ChartJSChartEngine extends ChartEngine {

    componentDidMount() {
        this.chart = new Chart(document.getElementById("chart_"+this.props.id).getContext('2d'),this.props.options)
    }

    render() {
        return (
            <canvas id={"chart_"+this.props.id}></canvas>
        )
    }
}

