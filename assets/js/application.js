var scatter_target          = d3.select("#scatterplot");
var schools_table_target    = d3.select("#datatable");
var all_math_target         = d3.select("#bar-all-math");
//var filtered_schools      = d3.select("#bar-filtered-schools");
var one_school_math_target  = d3.select("#one-school-math");
var one_school_com_target   = d3.select("#one-school-com");

d3.csv("/datos/09_ESCUELAS_EMS2013.csv", function(data){
    //Clean up data first
    data.forEach(function(v,i,a){
        if(isNaN(+v['Matemáticas: Excelente'])){ v['Matemáticas: Excelente']=0}
        if(isNaN(+v['Matemáticas: Bueno'])){ v['Matemáticas: Bueno']=0}
        if(isNaN(+v['Comunicación: Excelente'])){ v['Comunicación: Excelente']=0}
        if(isNaN(+v['Comunicación: Bueno'])){ v['Comunicación: Bueno']=0}
    });

    var schools = crossfilter(data);
    /* ************************ Convenience Variables *****************/
    // These will be used to construct some of the visualizations.
    // If you want to exclude them from the vizs just add or remove them here

    var math_categories = ['Matemáticas: Excelente', 
                           'Matemáticas: Bueno',
                           'Matemáticas: Elemental', 
                           'Matemáticas: Insuficiente'];

    var com_categories = ['Comunicación: Excelente',
                          'Comunicación: Bueno',
                          'Comunicación: Elemental',
                          'Comunicación: Insuficiente'];
    // ******************** Dimensions ********************************/
    // DRY Dimensions
    var dimension_names = ['Nombre De La Escuela', 
                           'Turno', 'Delegación','Colonia', 
                           'Sostenimiento', 'Modalidad'];
    var dimensions = [];

    dimension_names.forEach(function(name){
        dimensions[name] = schools.dimension(function(d){return d[name];})
    });

    // Other dimensions
    dimensions['Matemáticas'] = schools.dimension(function(d){
        return (d['Matemáticas: Excelente']*1.2 + d['Matemáticas: Bueno'])
        });

    /*******************  Initialize Charts  ***********************************/
    var scatter_chart = d3.sv_scatter()
        .keyfunc(school_key)
        .x_accessor(function(d) {
            return (+d["Matemáticas: Excelente"]*1.2 + (+d["Matemáticas: Bueno"]))
            })
        .y_accessor(function(d) {
            return (+d["Comunicación: Excelente"]*1.2+ (+d["Comunicación: Bueno"]))
            })
        .x_domain([0, 120])
        .y_domain([0, 120])
        //.mouseover_func(scatter_mouseover_func)
        //.mouseout_func(scatter_mouseout_func)
        .click_func(scatter_click_func);

    var data_table = d3.sv_table()
        .column_names(['Nombre De La Escuela',
                       'Colonia',
                       'Turno',
                       'Sostenimiento',
                       'Matemáticas: Excelente'])

    var all_math_bar        = d3.sv_side_bar().chart_width(100),
        all_com_bar         = d3.sv_side_bar().chart_width(100),
        filtered_math_bar   = d3.sv_side_bar().chart_width(100),
        filtered_com_bar    = d3.sv_side_bar().chart_width(100),
        one_school_math     = d3.sv_side_bar().chart_width(100),
        one_school_com      = d3.sv_side_bar().chart_width(100);


    /* ************************ Bind initial data to charts *********************/
    schools_table_target.datum(dimensions['Nombre De La Escuela'].bottom(Infinity))
        .call(data_table);


    scatter_target.datum(dimensions['Nombre De La Escuela'].top(Infinity))
        .call(scatter_chart);

    /* ** Side by side bar charts ****/
    // TODO Make sure this function is called in an init function that is called
    // before any filters are applied to `schools`
    var all_schools_math_summary = make_summary(math_categories);

    all_math_target.datum(all_schools_math_summary).call(all_math_bar); 

    /* ******************  Filters *********************************/
    // Make a filter for each dimension!
    // (filter will be placed in a div called 'dimension-name-filter' 
    // (replace `dimension-name, obvs)

    dimension_names.forEach(function(name){
        var selector_name = "#"+name.toLowerCase().replace(/\s/g, "-")+"-filter";
        var filter_div = d3.select(selector_name);
        var all_of_dimension = dimensions[name].group().all()
        .sort(function (a, b) {
            return a.key === b.key ? 0 : a.key < b.key ? -1 : 1
        })
        .map(function(a){return a.key;});


        filter_div.append('select')
            .attr('class', 'chosen-select')
            .attr('name', name)
            .selectAll('option')
            .data(all_of_dimension)
            .enter()
            .append('option')
            .attr('value', function(d){return d})
            .text(function(d){return d});
    });

    // Add blank option to all selects
    d3.selectAll('select').insert('option', ":first-child")
    .attr('value',null)

    // Bind change function to each filter
    // TODO without JQuery
    var all_filter_selects = $('select').each(function(){
        $(this).change(function(){
            on_filter_change(this)
        })
    })

/* ********************* Helper Functions ***************/

    function make_summary(categories){
        // **Warning!**
        // Returns an array same length as `categories` where each item 
        // is the sum of all members of `schools` of each category
        //schools is a crossfilter, so calling this function will return different
        //values depending on the state of the crossfilter.
        var summary = [];
        for (var i=0; i<categories.length; i++) {
            summary[i] = schools.groupAll().reduceSum(function(d){
                return d[categories[i]];
            }).value()
        }
        return summary;
    }

    function make_school_summary(categories,school){
        var summary = [];
        for (var i=0; i<categories.length; i++){
            summary[i] = school[categories[i]];
        }
        return summary
    }

    function school_key(d){
        // This function returns a key for the school data.
        return d["Nombre De La Escuela"];
    }
    //  function scatter_mouseover_func(d){
    //    div.transition()
    //      .duration(200)
    //      .style("opacity",.9);
    //    div.style("left", (d3.event.pageX) + "px")
    //      .style("top", (d3.event.pageY - 28) + "px");
    //    div.append("ul")
    //      .append("li").text(d['NOMBRE DE LA ESCUELA'])
    //      .append("li").text(d['COM EXCEL'])
    //      .append("li").text(d['MAT EXCEL'])
    //      .append("li").text(Number(d.mat_buen)+Number(d.mat_excel));
    //  }
    //
    //  function scatter_mouseout_func(d) {
    //    div.transition()
    //      .duration(500)
    //      .style("opacity", 0);
    //    div.select("ul").remove();
    //  }

    function scatter_click_func(d){
        //this is the function the scatterplot will call when a point is clicked
        on_school_select(d);
    }

    function on_school_select(school){
        //call this function with an identifier. This function will then redraw
        //those charts that have one-school behavior
        //returns the school object

        var identifier = school_key(school);
        //Let's add the .clicked class to the selected element in the scatterplot
        scatter_target.selectAll('.data_elem')
            .classed('clicked', function(d){
                return school_key(d)===identifier;
            });

        //Let's add class .success to the row belonging to the selected element
        schools_table_target.selectAll('.data_elem')
            .classed('success', function(d){
                return school_key(d)===identifier;
            });

        //Let's re-draw the individual math plot
        one_school_math_target.datum(make_school_summary(math_categories,school))
            .call(one_school_math); 

        //Lets' re-draw the individual comm plot
        one_school_com_target.datum(make_school_summary(com_categories,school))
            .call(one_school_com);
    }

    function on_filter_change(obj){
        // Reset filter if blank is chosen
        if (obj.value == ""){
            dimensions[obj.name].filterAll();
        }
        // Or filter all the others
        else{
          dimensions[obj.name].filterExact(obj.value);
        }
        //
        scatter_target.datum(dimensions[obj.name].top(Infinity))
            .call(scatter_chart)
    }

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

}) //End d.csv 
