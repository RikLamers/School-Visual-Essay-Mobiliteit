import * as d3 from 'd3';
import * as base from './base';
import * as $ from 'jquery';

export function buildLineGraph(data, propperties) {

    const dataLimburg = [];
    const dataNetherland = [];

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

    const svg = d3.select('#linegraph-averageSVG');

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
        .style('font-family', 'Roboto Light')
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .style('font-family', 'Roboto Light');

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
        .attr('stroke', base.limburgColor)
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    svg
        .append('path')
        .attr('d', lineGen(dataNetherland))
        .attr('stroke', base.netherlandsColor)
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
        .attr('fill', base.blackColor)
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
                    '<div style="background-color: ' + base.yellowColor + '; padding: 9px; border-radius: 5px; text-align: center;"><div style="font-family: Roboto Light;">Jaar: ' +
                    d.Jaar +
                    '</div><div style="height: 1px; width: 100%; background-color: ' + base.blackColor + '; margin: 5px 0;"></div><div style="font-family: Roboto Light;">Waarde: ' +
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


        // Legenda
        svg.append('rect')
            .attr('x', propperties.width + 40)
            .attr('y', 0)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', base.limburgColor);

        svg.append('text')
            .attr('x', propperties.width - 25)
            .attr('y', '9')
            .attr('dy', '5.12px')
            .style('font-family', 'Roboto Light')
            .text('Limburg');

        svg.append('rect')
            .attr('x', propperties.width + 40)
            .attr('y', 30)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', base.netherlandsColor);

        svg.append('text')
            .attr('x', propperties.width - 40)
            .attr('y', '39')
            .attr('dy', '5.12px')
            .style('font-family', 'Roboto Light')
            .text('Nederland');

}