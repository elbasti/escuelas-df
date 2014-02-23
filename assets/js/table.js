d3.sv_table = function(){
  //default values
  var column_names = ['Name']

  function table(selection){
    var data = selection.data()

    // Data Join
    var all_rows = selection.selectAll('tbody')
                            .data(data);
    
    // Create a row for each school
    var rows = all_rows.selectAll('tr')
                       .data(function(d) {return d})

        rows.enter()
            .append('tr')
            
            .selectAll('td')
            .data(function(d){
              var outs = [];
              for (var i=0; i<column_names.length; i++){
              outs[i]=d[column_names[i]]
              }
              return outs;
            })
            .enter().append('td')
            .text(function(d,i){ return d})
            }

  // getter-setters

  table.column_names = function(value){
        if(!arguments.length) return column_names;
        column_names = value;
        return table;
    }
 return table;
}
