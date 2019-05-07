function buildMetadata(sample) {

  // Function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function(data) {
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");  

    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("p").html(key + ": " + value);
    });  

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });  
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then(function(data) {

    // Build a Bubble Chart using the sample data
    var bubbledata = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: 'Viridis'
      }
    }];
    
    var bubblelayout = {
      height: 500,
      width: 1000,
      xaxis: {
        title: {
          text: 'OTU ID'
        }  
      }
    }
    
    Plotly.newPlot("bubble", bubbledata, bubblelayout);
    

    // Build a Pie Chart
    // Slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pievalues = data.sample_values.slice(0, 10);
    var pielabels = data.otu_ids.slice(0, 10);
    var piehvrtxt = data.otu_labels.slice(0, 10);
    
    var piedata = [{
      values: pievalues,
      labels: pielabels,
      hovertext: piehvrtxt,
      type: 'pie'  
    }];

    var pielayout = {
      height: 600,
      width: 800
    };
    
    Plotly.newPlot("pie", piedata, pielayout);
  });  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();