import { buildLineGraph } from './multilinegraph';

// Global color variables
export const limburgColor = 'rgba(112, 192, 179, .75)';
export const netherlandsColor = '#f25f5c';
export const blackColor = '#50514F';
export const grayColor = '#e6e6e6';
export const lightGrayColor = '#f2f2f2';
export const yellowColor = '#ffe066';
export const blueColor = '#247ba0';

// Function to render all base elements for the line graph.
export function setProppertiesAndAppendSVG(data) {

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

    const lineChartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lineChartSvg.setAttribute('width', width + margin.right + margin.left);
    lineChartSvg.setAttribute('height', height + margin.top + margin.bottom);
    lineChartSvg.setAttribute('id', 'linegraphSVG');
    lineChartSvg.setAttribute('style', `padding: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);

    graphDiv.appendChild(lineChartSvg);

    buildLineGraph(data.data, baseProps);

}
