var schools_chart         = d3.select("#scatterplot");
var schools_table         = d3.select("#datatable");
//var all_schools_chart     = d3.select("#bar-all-schools");
//var filtered_schools      = d3.select("#bar-filtered-schools");
//var one_school_chart      = d3.select("#bar-one-school");

d3.csv("/datos/09_ESCUELAS_EMS2013.csv", function(data){
//Clean up data first
  data.forEach(function(v,i,a){
    if(isNaN(+v['Matemáticas: Excelente'])){ v['Matemáticas: Excelente']=0}
    if(isNaN(+v['Matemáticas: Bueno'])){ v['Matemáticas: Bueno']=0}
    if(isNaN(+v['Comunicación: Excelente'])){ v['Comunicación: Excelente']=0}
    if(isNaN(+v['Comunicación: Bueno'])){ v['Comunicación: Bueno']=0}
  });

  var schools = crossfilter(data);
  
  // DRY Dimensions
  var dimension_names = ['Nombre De La Escuela', 'Turno', 'Delegación','Colonia', 'Sostenimiento', 'Modalidad']
  var dimensions = [];

  dimension_names.forEach(function(name){
      dimensions[name] = schools.dimension(function(d){return d[name];})
      });

  // Other dimensions
  dimensions['Matemáticas'] = schools.dimension(function(d){return (d['Matemáticas: Excelente']*1.2 + d['Matemáticas: Bueno'])})

  // Charts
  var scatter_chart = d3.sv_scatter()
         .keyfunc(function(d){
           return d["Nombre De La Escuela"]
           })
         .x_accessor(function(d) {
             return (+d["Matemáticas: Excelente"]*1.2 + (+d["Matemáticas: Bueno"]))
             })
         .y_accessor(function(d) {
             return (+d["Comunicación: Excelente"]*1.2+ (+d["Comunicación: Bueno"]))
             })
         .x_domain([0, 120])
         .y_domain([0, 120]);
//         .mouseover_func(scatter_mouseover_func)
//         .mouseout_func(scatter_mouseout_func)
//         .click_func(on_school_click);
  
  var data_table = d3.sv_table()
                     .column_names(['Nombre De La Escuela','Colonia'])
  schools_table
    .datum(dimensions['Nombre De La Escuela'].top(Infinity))
    .call(data_table);
  

   schools_chart
     .datum(dimensions['Nombre De La Escuela'].top(Infinity))
     .call(scatter_chart);
  /* ********************* Helper Functions ***************/

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

  var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);
})
