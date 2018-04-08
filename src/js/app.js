import '../scss/main.scss';
import * as d3 from 'd3';
import * as $ from 'jquery';

// IMPORT DATA
import { averageKM } from '../data/js/gemiddeld_aantal_km_per_inwoner';

// Global color variables
const limburgColor = 'rgba(112, 192, 179, .75)';
const netherlandsColor = '#f25f5c';
const blackColor = '#50514F';
const grayColor = '#e6e6e6';
const lightGrayColor = '#f2f2f2';
const yellowColor = '#ffe066';
const blueColor = '#247ba0';

const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'chart__tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('opacity', 0);

setProppertiesAndAppendSVG(averageKM, 'linegraph-average');

function setProppertiesAndAppendSVG(data) {

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
    lineChartSvg.setAttribute('class', 'linegraphSVG');
    lineChartSvg.setAttribute('style', `padding: ${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`);

    graphDiv.appendChild(lineChartSvg);

    buildLineGraph(data.data, baseProps);

}

function buildLineGraph(data, propperties) {

    const dataLimburg = [];
    const dataNetherland = [];
    const formatYear = d3.timeFormat('%Y');

    for (let i = 0; i < data.length; i++) {
        if (data[i].Provincie === 'Limburg') {
            dataLimburg.push(data[i]);
        } else {
            dataNetherland.push(data[i]);
        }
    }

    // Get max 'Jaar' value
    const maxX = Math.max.apply(
        Math,
        data.map(function(o) {
            const jaar = o.Jaar + 1;
            return jaar;
        })
    );

    const minX = Math.min.apply(
        Math,
        data.map(function(o) {
            const jaar = o.Jaar - 1;
            return jaar;
        })
    );

    // Get max 'Gemiddelde' value
    const maxY = Math.max.apply(
        Math,
        data.map(function(o) {
            return o.Gemiddelde;
        })
    );

    const svg = d3.select('.linegraphSVG');

    // Set propperties for x-axis
    const x = d3.scaleTime()
        .range([0, propperties.width])
        .domain([new Date(minX, 0, 1), new Date(maxX, 0, 1)]);

    // Set propperties for y-axis
    const y = d3.scaleLinear()
        .range([propperties.height, 0])
        .domain([0, (Math.round((maxY + 1000)/1000)*1000)]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + propperties.height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    const lineGen = d3.line()
        .x(d => {
            return x(new Date(d.Jaar, 0, 1));
        })
        .y(d => {
            return y(d.Gemiddelde);
        });

    svg
        .append('path')
        .attr('d', lineGen(dataLimburg))
        .attr('stroke', limburgColor)
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    svg
        .append('path')
        .attr('d', lineGen(dataNetherland))
        .attr('stroke', netherlandsColor)
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', function(d, i) {
            return 'dot_' + i;
        })
        .attr('r', 5)
        .attr('fill', blackColor)
        .attr('cx', function(d) {
            return x(new Date (d.Jaar, 0, 1));
        })
        .attr('cy', function(d) {
            return y(d.Gemiddelde);
        })
        .style('position', 'relative')
        // TOOLTIP
        .on('mouseover', function(d, i) {
            d3
                .select('.chart__tooltip')
                .transition()
                .duration(200)
                .style('opacity', 0.9)
                .style('visibility', 'visible');

            const tooltipValue = () => {
                return (
                    '<div style="background-color: ' + yellowColor + '; padding: 9px; border-radius: 5px; text-align: center;"><div>Jaar: ' +
                    d.Jaar +
                    '</div><div style="height: 1px; width: 100%; background-color: ' + blackColor + '; margin: 5px 0;"></div><div>Waarde: ' +
                    d.Gemiddelde +
                    '</div></div>'
                );
            };
            $('.chart__tooltip').html(tooltipValue);
        })
        .on('mousemove', function() {
            return d3
                .select('.chart__tooltip')
                .style('top', d3.event.pageY - 10 + 'px')
                .style('left', d3.event.pageX + 10 + 'px')
                .style('cursor', 'default');
        })
        .on('mouseout', function(d, i) {
            d3
                .select('.chart__tooltip')
                .style('opacity', 0)
                .style('visibility', 'hidden');
        });

}
