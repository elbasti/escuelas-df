d3.sv_scatter = function(){
    //default values
    var x_accessor = function(d) {return d.x},
        y_accessor = function(d) {return d.y},
        keyfunc = function(d){return d["id"]},
        height = 500, //TODO getter-setter
        width = 500, // TODO getter-setter
        mouseover_func = function(d,i) {}, //default is empty
        mouseout_func = function(d,i) {},
        click_func = function(d,i) {},
        x_domain = [0,100],
        y_domain = [0,100];
    //TODO: a better default keyfunction! 
    

    var margin = {top: 10, right: 30, bottom: 30, left: 30};

    function scatter(selection){

        var data = selection.data()
        
        var xrange  = width - margin.right - margin.left,
            yrange = height - margin.top - margin.bottom;
        var x = d3.scale.linear().range([margin.left, xrange]).domain(x_domain),
            y = d3.scale.linear().range([margin.bottom, yrange]).domain(y_domain);

    //Data Join    
        var group = selection.selectAll('svg')
                             .data(data);
            group.enter()
                 .append('svg')
                 .attr('class', 'viz-svg')
                 .attr('height', height)
                 .attr('width', width)
               .append('rect')
                 .attr('height', height)
                 .attr('width', width)
                 .attr('class', 'svg-background')
                 .attr('fill', 'white');

        //Axes
        var xAxis = d3.svg.axis()
                          .scale(x)
                          .orient('bottom')
                          .ticks(10);
        
        var yAxis = d3.svg.axis()
                          .scale(y)
                          .orient('left')
                          .ticks(10);
        group.append("g")
             .attr("class", "axis x-axis")
             .attr("transform", "translate(0,"+ (height-margin.bottom)+")")
             .call(xAxis);

        group.append("g")
             .attr("class", "axis y-axis")
             .attr("transform", "translate("+(margin.left+1)+",0)")
             .call(yAxis);
        
        // Gridlines

        var y_ticks = y.ticks(); 

            y_grid = group.selectAll("line.y_gridline").data(y_ticks)

            y_grid.enter()
                 .append("line")
                 .attr("class", "y_gridline")
                 .attr("x1", 0 + margin.left)
                 .attr("x2", width - margin.right - margin.left)
                 .attr("y1", function(d) {return y(d)})
                 .attr("y2", function(d) {return y(d)})
                 .attr("stroke", "white")
                 .attr("stroke-width", "2")

        var x_ticks = x.ticks(); 

            x_grid = group.selectAll("line.x_gridline").data(x_ticks)

            x_grid.enter()
                 .append("line")
                 .attr("class", "y_gridline")
                 .attr("x1", function(d) {return x(d)} )
                 .attr("x2", function(d) {return x(d)} )
                 .attr("y1", margin.top + margin.bottom)
                 .attr("y2", height - margin.bottom)
                 .attr("stroke", "white")
                 .attr("stroke-width", "2")
    // Enter
        var circles = group.selectAll("circle, .active")
                           .data(function(d) {return d}, function(d) {return d["Nombre De La Escuela"]});

        
//
            // Enter
            circles.enter()
               .append('circle')
               .attr('r', 2)
               .classed('active', true)
               .classed('inactive', false)
               .style('opacity', .6)
               .text(keyfunc)
               .on("mouseover", mouseover_func)
               .on("mouseout", mouseout_func)
               .on("click", click_func);



//          // Exit      
            circles.exit()
                   .classed('inactive', true)
                   .classed('active', false)
                   .transition()
                   .duration(1000)
             //      .style("opacity", .3)

            // Update
            circles.attr("class", "active")
                   .transition()
                   .duration(1000)
                   .style("opacity", .8)
                   .attr("cx", function(d,i) {return x(x_accessor(d,i))})
                   .attr("cy", function(d,i) {return height-y(y_accessor(d,i))});
            
            // Sort
//            circles.order()

    };

// getter-setters

    scatter.x_accessor = function(value){
        if(!arguments.length) return x_accessor;
        x_accessor = value;
        return scatter;
    }

    scatter.y_accessor = function(value){
        if(!arguments.length) return y_accessor;
        y_accessor = value;
        return scatter;
    }
    scatter.keyfunc = function(value){
        if(!arguments.length) return keyfunc;
        keyfunc = value;
        return scatter;
    }
    
    scatter.mouseover_func = function(value){
        if(!arguments.length) return mouseover_func;
        mouseover_func = value;
        return scatter;
    }

    scatter.mouseout_func = function(value){
        if(!arguments.length) return mouseout_func;
        mouseout_func = value;
        return scatter;
    }

    scatter.click_func = function(value){
        if(!arguments.length) return click_func;
        click_func = value;
        return scatter;
    }

    scatter.x_domain = function(value){
        if(!arguments.length) return x_domain;
        x_domain = value;
        return scatter;
    }

    scatter.y_domain = function(value){
        if(!arguments.length) return y_domain;
        y_domain = value;
        return scatter;
    }

return scatter;
}
