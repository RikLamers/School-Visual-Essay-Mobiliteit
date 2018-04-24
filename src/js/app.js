// Import the main SCSS style sheet
import '../scss/main.scss';

// Import everything as base from base js file
import * as base from './base';

// Import d3
import * as d3 from 'd3';

// Import jQuery
import * as $ from 'jquery';

// IMPORT DATA
import { averageKM } from '../data/js/gemiddeld_aantal_km_per_inwoner';
import { averageBus } from '../data/js/buslijnen_per_provincie';
import { transport } from '../data/js/vervoersmiddelen_nl_vs_limburg';

// Create base tooltip
const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'chart__tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('opacity', 0);

// Resize event handler
let resizeTimer;
$(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doResize, 200);
});

const slider = document.getElementById('filter__barchart-inside-out');
const sliderValue = document.getElementById('slider-value');
sliderValue.innerText = slider.value;
slider.addEventListener('change', function() {
    removeBarchartInsideOut(slider.value);
    sliderValue.innerText = slider.value;
});

// What to do when resize happens
function doResize() {
    rebuildOnResize();
}

function removeBarchartInsideOut(filter) {
    const barchart = document.getElementById('barchart-inside-outSVG');
    barchart.remove();

    base.setProppertiesAndAppendSVG(transport, filter);
}

// Function to remove graphs and build them again.
function rebuildOnResize() {
    // Remove linegraph
    const averageKMGraph = document.getElementById('linegraph-averageSVG');
    averageKMGraph.remove();

    // Build linegraph again
    base.setProppertiesAndAppendSVG(averageKM);

    // Remove choropleth
    const bussesGraph = document.getElementById('choroplethSVG');
    bussesGraph.remove();

    // Build choropleth again
    base.setProppertiesAndAppendSVG(averageBus);   
    
    // Remove barchart-inside-out
    const barchartInsideOut = document.getElementById('barchart-inside-outSVG');
    barchartInsideOut.remove();

    // Build barchart-inside-out
    base.setProppertiesAndAppendSVG(transport, slider.value);
}

base.setProppertiesAndAppendSVG(averageKM);
base.setProppertiesAndAppendSVG(averageBus);
base.setProppertiesAndAppendSVG(transport);
