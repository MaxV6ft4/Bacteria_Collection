function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleresultArray = samples.filter(sampleObj2 => sampleObj2.id == sample);
    // Create a variable that holds the first sample in the array.
    var sampleresult = sampleresultArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = sampleresult.otu_ids;
    var labels = sampleresult.otu_labels;
    var values = sampleresult.sample_values;

    // Create the yticks for the bar chart.
    var yticks = ids.slice(0,10).map(id => 'OTU ' + id).reverse();

    // Create the trace for the bar chart. 
    var barData = [{
        x: values.slice(0,10).reverse(),
        y: yticks,
        type: 'bar',
        text: labels.slice(0,10).reverse(),
        orientation: 'h'
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      width: 400,
      height: 350
    };
     
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
        x: ids,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
            size: values,
            color: ids,
            colorscale: 'Earth'
        }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: {t: 0},
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
      margin: {t: 30},
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // Create a variable that holds the washing frequency.
    var washingFrequency = result.wfreq.toFixed(2);

    // Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: '<span style = "color: black; font-size:20px;">Belly Button Washing Frequency</span>' +
      '<br><span style="color:dimgray; font-size: 18px;">Scrubs Per Week</span>'},
      gauge: {
        axis: {range: [null, 10], nticks: 6},
        bar: {color: 'black'},
        steps: [
          {range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'yellowgreen'},
          {range: [8,10], color: 'green'}
        ]
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 400, height: 350, margin: {t:0, b:0}
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    
  });
}
