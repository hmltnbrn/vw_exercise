/*
 *
 * Function to build the grid when called
 * Uses d3.js, JavaScript, and jQuery
 *
*/

function build(height, width, number, p, blockColor, highColor) {

    data = [];
    var yCount = 0;
    var count = 0;
    for(var y = 0; y < number; y++) { //builds arrays of coordinates/nth count and puts it in an array
        var tempData = [number];
        var xCount = 0;
        for(var x = 0; x < number; x++) {
            tempData[x] = [xCount, yCount, count];
            xCount += 1;
            count += 1;
        };
        yCount += 1;
        data.push(tempData);
    };

    d3.select("svg").remove(); //remove old grid if there is one

    var grid = d3.select("#grid").append("svg"); //add grid svg

    //attributes for grid svg
    grid
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart");

    //sets of rows in separate g's
    var row = grid.selectAll(".row")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "row");

    //puts each individual box in a row
    var box = row.selectAll(".box")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("class", "box");

    //attributes for box
    box
        .attr("x", function (d) { //x-coordinate -- times by width/number to stretch to fit svg
            return d[0]*(width/number);
        })
        .attr("y", function (d) { //y-coordinate -- times by height/number to stretch to fit svg
            return d[1]*(height/number);
        })
        .attr("i", function(d) { //nth number of the node
            return d[2];
        })
        .attr("height", height/number) //height based on svg height and number of boxes in a column
        .attr("width", width/number) //width based on svg width and number of boxes in a row
        .style("stroke", "#000000") //box border color
        .style("stroke-width", 1) //box border width
        .attr("fill", blockColor) //box fill color
        .on('mouseover', function (d) {

            //coordinates of box the mouse is over
            var mouseX = d[0];
            var mouseY = d[1];

            //filters out data that is in the same column or row/checks for checked radio button
            if ($("#location").is(':checked')) {
              d3.selectAll(".box").filter(function (d) {
                return (d[0] == mouseX || d[1] == mouseY);
              }).attr("fill", highColor);
            }

            //filters out nodes that are in the neighborhood based on the inputted p value/checks for checked radio button
            if ($("#neighbor").is(':checked')) {
              d3.selectAll(".box").filter(function (d) {
                return ((d[0] >= mouseX-p && d[0] <= mouseX+p) && (d[1] >= mouseY-p && d[1] <= mouseY+p));
              }).attr("fill", highColor);
            }

            //sets highlighted node textboxes with values
            $("#xCoor").val(mouseX);
            $("#yCoor").val(mouseY);
            $("#iVal").val(d[2]);

        })
        .on('mouseout', function (d) { //returns everything to normal
            d3.selectAll(".box").attr("fill", blockColor);
            $("#xCoor").val("");
            $("#yCoor").val("");
            $("#iVal").val("");
        });

    box.exit().remove(); //exits and removes

}