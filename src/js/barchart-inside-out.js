import * as d3 from 'd3';
import * as $ from 'jquery';

import * as base from './base';

export function buildBarchartInsideOut(data, properties, filter) {
    const localData = [];

    for (let i = 0; i < data.length; i++) {

        const vervoerswijze = data[i].Vervoerswijze.slice(0, -4);

        const jaar = data[i].Vervoerswijze.substr(vervoerswijze.length);

        const result = {
            nederland: data[i].Nederland,
            limburg: data[i].Limburg,
            vervoerswijze: vervoerswijze,
            jaar: Number(jaar),
            SVG: data[i].SVG
        };

        if (result.jaar === Number(filter)) {
            localData.push(result);
        }
    }
    var svg = d3.select('#barchart-inside-outSVG');
    
    var x = d3.scaleLinear()
        .rangeRound([0, properties.width / 2 - 70]);

    var xLeft = d3.scaleLinear()
        .rangeRound([0, properties.width / 2 - 70]);

    var y = d3.scaleLinear()
        .rangeRound([properties.height, 0])
        .domain([0, 100]);
    
    x.domain([0, Math.ceil(d3.max(localData, function (d) {
        return d.nederland;
    }) / 100) * 100]);
    
    xLeft.domain([Math.ceil(d3.max(localData, function (d) {
        return d.limburg;
    }) / 1000) * 1000, 0]);
    
    var colours = d3.scaleOrdinal()
        .range(['#FF6B6B', '#FFE66D']);
    
    svg.selectAll('img.name')
        .data(localData)
        .enter()
        .append('image')
        .attr('x', properties.width / 2 - 25)
        .attr("y", function (d, i) {
            return properties.height / 8 * i;
        })
        .attr('xlink:href', function (d) {
            return d.SVG;
        })
        .attr('width', 50)
        .attr('height', 50);
    
    
    svg.selectAll('.bar-right')
        .data(localData)
        .enter()
        .append('rect')
            .attr('x', function (d) {
                return properties.width / 2 + 35;
            })
            .attr('y', function (d, i) {
                return properties.height / localData.length * i + 5;
            })
            .attr('width', function (d) {
                return x(d.nederland);
            })
            .attr('height', function (d) {
                return properties.height / localData.length - 10;
            })
            .attr('fill', base.netherlandsColor)
            .attr('class', 'bar-right')
            .on('mouseover', function (d, i) {
                d3.select('.chart__tooltip')
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9)
                    .style('visibility', 'visible');
                    
                const tooltipValue = () => {
                    return (
                        '<div style="background-color: ' + base.yellowColor + '; padding: 9px; border-radius: 5px; text-align: center;"><div>Gemiddeld km/inwoner: ' + d.nederland + '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div><div>Vervoerswijze: ' + d.vervoerswijze + '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div>' + '<div>Nederland</div></div>'
                    );
                }

                $('.chart__tooltip').html(tooltipValue);
            })
            .on('mousemove', function () {
                return d3.select('.chart__tooltip')
                            .style('top', d3.event.pageY - 10 + 'px')
                            .style('left', d3.event.pageX + 10 + 'px')
                            .style('cursor', 'default');
            })
            .on('mouseout', function (d, i) {
                d3.select('.chart__tooltip')
                    .style('opacity', 0)
                    .style('visibility', 'hidde');
            });
    
    svg.selectAll('.bar-left')
        .data(localData, function (d) {
            return d;
        })
        .enter()
        .append('rect')
            .attr('x', function (d) {
                return xLeft(d.limburg) + 35;
            })
            .attr('y', function (d, i) {
                return properties.height / localData.length * i + 5;
            })
            .attr('width', function (d) {
                return properties.width / 2 - xLeft(d.limburg) - 70;
            })
            .attr('height', function (d) {
                return properties.height / localData.length - 10;
            })
            .attr('fill', base.limburgColor)
            .attr('class', 'bar-left')
            .on('mouseover', function (d, i) {
                d3.select('.chart__tooltip')
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9)
                    .style('visibility', 'visible');
                
                const tooltipValue = () => {
                    return (
                        '<div style="background-color: ' + base.yellowColor + '; padding: 9px; border-radius: 5px; text-align: center;"><div>Gemiddeld km/inwoner: ' + d.limburg + '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div><div>Vervoerswijze: ' + d.vervoerswijze + '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div>' + '<div>Limburg</div></div>'
                    );
                };

                $('.chart__tooltip').html(tooltipValue);
            })
            .on('mousemove', function () {
                return d3.select('.chart__tooltip')
                            .style('top', d3.event.pageY - 10 + 'px')
                            .style('left', d3.event.pageX + 10 + 'px')
                            .style('cursor', 'default');
            })
            .on('mouseout', function (d, i) {
                d3.select('.chart__tooltip')
                    .style('opacity', 0)
                    .style('visibility', 'hidde');
            });
                
            const widthRightAxis = properties.width / 2 + 35;
            
            svg.append('g')
                .attr('class', 'x axis right')
                .call(d3.axisTop(x))
                .attr('transform', 'translate(' + widthRightAxis + ', 0)');
                
            svg.append('g')
                .attr('class', 'x axis left')
                .call(d3.axisTop(xLeft))
                .attr('transform', 'translate(35, 0)');

}