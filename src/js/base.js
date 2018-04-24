import { buildLineGraph } from './multilinegraph';
import { buildChoropleth } from './choropleth';
import { buildBarchartInsideOut } from './barchart-inside-out';

// Global color variables
export const limburgColor = '#84cdc9';
export const netherlandsColor = '#e98073';
export const blackColor = '#50514F';
export const grayColor = '#e6e6e6';
export const lightGrayColor = '#f2f2f2';
export const yellowColor = '#fbe8a6';
export const blueColor = '#247ba0';
export const greenColor = '#d2eceb';

// Function to render all base elements for the line graph.
export function setProppertiesAndAppendSVG(data, filter = '2010') {

    const margin = {
        top: 80,
        right: 60,
        bottom: 80,
        left: 60
    };

    // GET RIGHT ID
    const graphDiv = document.getElementById(data.name);
    graphDiv.style.width = '100%';
    graphDiv.style.height = '100%';
    const holderWidth = graphDiv.offsetWidth;
    const width = holderWidth - margin.right - margin.left;
    const height = 600 - margin.top - margin.bottom;

    const baseProps = {
        margin: margin,
        holderWidth: holderWidth,
        width: width,
        height: height
    };

    const chartSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chartSVG.setAttribute('width', width + margin.right + margin.left);
    chartSVG.setAttribute('height', height + margin.top + margin.bottom);
    chartSVG.setAttribute('id',  data.name + 'SVG');
    chartSVG.setAttribute('style', `padding: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);

    graphDiv.appendChild(chartSVG);

    switch(data.name) {
        
        case 'choropleth':
            buildChoropleth(data.data, baseProps);
            return;
        
        case 'linegraph-average':
            buildLineGraph(data.data, baseProps);
            return;

        case 'barchart-inside-out':
            buildBarchartInsideOut(data.data, baseProps, filter);
            return;

    };

}
