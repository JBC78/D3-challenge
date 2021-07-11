// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 500;
// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Print the d3Data
    // console.log(censusData);

    // Cast the hours value to a number for each piece of d3Data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.state = data.state;
    });  

    // Create scale functions
    // ==============================
    var xMin = d3.min(censusData, d => d.poverty);
    var xMax = d3.max(censusData, d => d.poverty);
    var xLinearScale = d3.scaleLinear()
      .domain([xMin*.9,xMax*1.05])
      .range([0, chartWidth]);

    var yMin = d3.min(censusData, d => d.healthcare);
    var yMax = d3.max(censusData, d => d.healthcare);
    var yLinearScale = d3.scaleLinear()
      .domain([yMin*.8, yMax*1.05])
      .range([chartHeight, 0]);
    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    // Append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
    // Append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
    
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.append("g")
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // append text (state abbreviation) to inside of circles 
    var textCircles = chartGroup.append("g")
        .selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare)+3)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .style("fill", "white")
        .attr("font-weight", "bold");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      // .offset([80, -10])
    
      .html(function(d) {
        return (`${d.state}<br>${d.poverty} %`)
      });
    
    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    // Create axis labels

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - (chartHeight / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });

