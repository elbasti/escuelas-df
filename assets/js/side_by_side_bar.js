d3.sv_side_bar = function(){
  //default values
  var chart_width=200,
      chart_height=200,
      bar_width=20,
      bar_margin=5;

  var keys = [0, 1, 2, 3];

  // Change this function to change the scale of the chart. 
  // Could be "the highest bar" or "97" or whatever
  var scaler = function(data){
        return d3.sum(data)
      };

  function sidebar(selection){
    var data=[];
    for (var i = 0; i < keys.length; i++){
      data.push(selection.datum()[keys[i]]);
    }

    var y = d3.scale.linear()
      .domain([0,scaler(data)])
      .range([0,chart_height]);

    var x = d3.scale.linear()
      .domain([0,keys.length])
      .range([0, chart_width])

      var svg = selection.selectAll('svg')
      .data(selection.data())
      .enter()
      .append('svg')
      .attr('height', chart_height)
      .attr('width', chart_width)
      .attr('class', "side-by-side-bar");

    var background = svg.selectAll('rect')
                        .data(selection.data())
                        .enter()
                        .append('rect')
                        .attr('height', chart_height)
                        .attr('width', chart_width)
                        .style('fill', '#A8A9AD')
                        .attr('class', 'side-bar-bg');

    var group = svg.selectAll('g')
                    .data(selection.data())
                    .enter()
                    .append('g'); 

    var svg = selection.select('svg')

    var rects = svg.select('g')
                   .selectAll('rect')
                   .data(data);
    //enter
    rects.enter()
         .append('rect')
         .attr('width', bar_width)
         .attr('x', function(d,i) {return (bar_margin+(bar_width+bar_margin)*i)})
         .attr('class',function(d,i){return 'bar-'+i})
         .text(function(d,i) {return keys[i]})
         .attr('y', chart_height)
         //.attr('y', function(d) {return chart_height - y(d)})
         //.attr('height', function(d) { return y(d);})
         .attr('height', 0);

    rects.transition()
         .duration(1000)
         .attr('y', function(d) { return (y(d) ? (chart_height - y(d)) : chart_height ) })

         .attr('height', function(d) { return y(d);})

      // enter labels
      var texts = svg.selectAll('text')
                     .data(data)
      texts.enter()
            .append('text')
            .style('text-anchor', 'left')
            .text(function(d) {return (d)})
            .attr('x', function(d,i) {return (bar_margin+(bar_width+bar_margin)*i)})
            .attr('y', function(d) {return chart_height - y(d)})

      // update labels
      texts.transition()
            .duration(1000)
            .text(function(d) {return (d)})
            .attr('y', function(d) {return chart_height - y(d)})

  }

  //getter-setters
  sidebar.keys = function(value){
    if (!arguments.length) return keys;
    keys = value;
    return sidebar;
  };

  sidebar.scaler = function(value){
    if (!arguments.length) return scaler;
    scaler = value;
    return sidebar;
  };

  sidebar.chart_width = function(value){
    if (!arguments.length) return chart_width;
    chart_width = value;
    return sidebar;
  };

  sidebar.chart_height = function(value){
    if (!arguments.length) return chart_height;
    chart_height = value;
    return sidebar;
  };

  sidebar.bar_width = function(value){
    if (!arguments.length) return bar_width;
    bar_width = value;
    return sidebar;
  };

  sidebar.bar_margin = function(value){
    if(!arguments.length) {
      return (sidebar.chart_width - keys.length*sidebar.bar_width)/(keys.length)  }
    bar_margin = value;
    return sidebar
  }
  return sidebar
}
