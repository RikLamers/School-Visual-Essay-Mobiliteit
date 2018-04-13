import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as $ from 'jquery';

import * as base from './base';

export function buildChoropleth(data, propperties) {

    const localData = [];

    for (let i = 0; i < data.length; i++) {
        const newData = {
            provincie: data[i].provincie,
            buslijnen: data[i].buslijnen,
            colorCode: ((data[i].buslijnen / 100) * 2.5)
        };
        localData.push(newData);
    }

    const color = d3.scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeBlues[9]);

    const projection = d3.geoMercator()
        .scale(1)
        .translate([0,0]);

    const path = d3.geoPath()
        .projection(projection);

    const svg = d3.select('#choroplethSVG');

    //Prodution
    d3.json('/nld.json').then(function(nld) {
    //Development
    // d3.json('/src/data/js/nld.json').then(function(nld) {

        let l = topojson.feature(nld, nld.objects.subunits).features[3],
        b = path.bounds(l),
        s = .3 / Math.max((b[1][0] - b[0][0]) / propperties.width, (b[1][1] - b[0][1]) / propperties.height),
        t = [((propperties.width / 1.5) - s * (b[1][0] + b[0][0])) / 2, ((propperties.height / 1.5) - s * (b[1][1] + b[0][1])) / 2];

        projection
            .scale(s)
            .translate(t);

        svg.selectAll('path')
            .data(topojson.feature(nld, nld.objects.subunits).features).enter()
            .append('path')
                .attr('d', path)
                .attr('fill', function(d, i) {
                    return color(localData[i].colorCode);
                })
                .on('mouseover', function(d, i) {
                    d3
                        .select('.chart__tooltip')
                        .transition()
                        .duration(200)
                        .style('opacity', 0.9)
                        .style('visibility', 'visible');
        
                    const tooltipValue = () => {
                        return (
                            '<div style="background-color: ' + base.yellowColor + '; padding: 9px; border-radius: 5px; text-align: center;"><div>Aantal buslijnen: ' +
                            localData[i].buslijnen +
                            '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div><div>' +
                            localData[i].provincie +
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

    });

}