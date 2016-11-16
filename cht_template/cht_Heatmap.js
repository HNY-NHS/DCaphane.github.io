        function heatmapChart() {
            var data = [];
            var colourRange = ['#f0f0f0', '#bdbdbd', '#636363']; // default - grey scale
            
            // legend parameters
            var legendID = '000';            
            var legendTitle = 'Volume';


            var chart = function(g) {

            // Tooltip Alternative ////////
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return '<strong>' + 'Day: ' + days[d.day - 1] + '\n' + 'Time: ' + d.hour + '-' + (d.hour + 1) + '\n'
                    + ':</strong> <span style="color:red">' + 'Attd: ' + d.count + '</span>';
                });

            g.call(tip);
            
                var colourScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) {
                        return d.count;
                    }) / 2, d3.max(data, function(d) {
                        return d.count;
                    })])
                    .range(colourRange);
                //.interpolate(d3.interpolateHcl);
                               

                var dayLabels = g.selectAll('.dayLabel')
                    .data(days)
                    .enter().append('text')
                    .text(function(d) {
                        return d;
                    })
                    .attr('x', 0)
                    .attr('y', function(d, i) {
                        return i * gridSize;
                    })
                    .style('text-anchor', 'end')
                    .attr('transform', 'translate(-6,' + gridSize / 1.5 + ')')
                    .attr('class', function(d, i) {
                        return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis');
                    });

                var timeLabels = g.selectAll('.timeLabel')
                    .data(times)
                    .enter().append('text')
                    .text(function(d) {
                        return d;
                    })
                    .attr('x', function(d, i) {
                        return i * gridSize;
                    })
                    .attr('y', 0)
                    .style('text-anchor', 'middle')
                    .attr('transform', 'translate(' + gridSize / 2 + ', -6)')
                    .attr('class', function(d, i) {
                        return ((i >= 8 && i <= 18) ? 'timeLabel mono axis axis-worktime' : 'timeLabel mono axis');
                    });

                var heatMap = g.selectAll('.hour')
                    .data(data)
                    .enter().append('rect')
                    //.filter(function(d) {return d.Type === 'AE_Attd'; }) // d3 filter approach
                    .attr('x', function(d) {
                        return (d.hour) * gridSize;
                    })
                    .attr('y', function(d) {
                        return (d.day - 1) * gridSize;
                    })
                    .attr('class', 'hour bordered')
                    .attr('width', gridSize)
                    .attr('height', gridSize)
                    .style('stroke', 'white')
                    .style('stroke-opacity', 0.6)
                    //.style('shape-rendering', 'crispEdges')
                    .style('fill', function(d) {
                        return colourScale(d.count);
                    })
                    //.append('title')
                    //    .text(function(d) { return 'Day: ' + days[d.day - 1] + '\n' 
                    //                               + 'Time: ' + d.hour + '-' + (d.hour + 1) + '\n'
                    //                                + 'Attd: ' + d.count; })
                    .on('mouseenter', function(d) {
                        d3.select(this)
                            .style('stroke', 'yellow')
                            .style('stroke-width', '3px')
                            .style('stroke-opacity', 1); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('mouseleave', function(d) {
                        d3.select(this)
                            .style('stroke', 'white')
                            .style('stroke-width', '1px')
                            .style('stroke-opacity', 0.6); });

                //Append title to the top
                /*g.append('text')
                    .attr('class', 'title')
                    .attr('x', width / 2)
                    .attr('y', -90)
                    .style('text-anchor', 'middle')
                    .text('Chart Title Here');
                */
                /*g.append('text')
                    .attr('class', 'subtitle')
                    .attr('x', width / 2)
                    .attr('y', -60)
                    .style('text-anchor', 'middle')
                    .text('Sub title | 12 months...');
                */

                //Extra scale since the color scale is interpolated
                var countScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) {
                        return d.count;
                    })])
                    .range([0, width])

                //Calculate the variables for the temp gradient
                var numStops = 10;
                var countRange = countScale.domain();
                countRange[2] = countRange[1] - countRange[0];
                countPoint = [];
                for (var i = 0; i < numStops; i++) {
                    countPoint.push(i * countRange[2] / (numStops - 1) + countRange[0]);
                } //for i

                //Create the gradient
                g.append('defs')
                    .append('linearGradient')
                    .attr('id', legendID.replace(/ /g,"_"))
                    .attr('x1', '0%').attr('y1', '0%')
                    .attr('x2', '100%').attr('y2', '0%')
                    .selectAll('stop')
                    .data(d3.range(numStops))
                    .enter().append('stop')
                    .attr('offset', function(d, i) {
                        return countScale(countPoint[i]) / width;
                    })
                    .attr('stop-color', function(d, i) {
                        return colourScale(countPoint[i]);
                    });


                //Color Legend container
                var legend = g.append('g')
                    .attr('class', 'legendWrapper')
                    .attr('transform', 'translate(' + (width / 2) + ',' + (gridSize * days.length + 40) + ')');

                //Draw the Rectangle
                var legendWidth = Math.min(width * 0.8, 400);                
                legend.append('rect')
                    .attr('class', 'legendRect')
                    .attr('x', -legendWidth / 2)
                    .attr('y', 0)
                    //.attr('rx', hexRadius*1.25/2)
                    .attr('width', legendWidth)
                    .attr('height', 10)
                    .style('fill', 'url(#' + legendID.replace(/ /g,"_") + ')');

                //Append title
                legend.append('text')
                    .attr('class', 'legendTitle')
                    .attr('x', 0)
                    .attr('y', -10)
                    .style('text-anchor', 'middle')
                    .text(legendTitle);


                //Set scale for x-axis
                var xScale = d3.scaleLinear()
                    .range([-legendWidth / 2, legendWidth / 2])
                    .domain([0, d3.max(data, function(d) {
                        return d.count;
                    })]);

                //Define x-axis
                var xAxis = d3.axisBottom(xScale)
                    .ticks(5)
                    //.tickFormat(formatPercent)
                ;

                //Set up X axis
                legend.append('g')
                    .attr('class', 'axis')
                    .attr('transform', 'translate(0,' + (10) + ')')
                    .call(xAxis);
    }
  
    chart.data = function(value) {
        if (!arguments.length) return data;
            data = value;
        return chart;
    }

    chart.colourRange = function(value) {
        if (!arguments.length) return colourRange;
            colourRange = value;
        return chart;
    }
 

     chart.legendID = function(value) {
        if (!arguments.length) return legendID;
            legendID = value;
        return chart;
    } 
 
    chart.legendTitle = function(value) {
        if (!arguments.length) return legendTitle;
            legendTitle = value;
        return chart;
    }    

    
    return chart;
  }
