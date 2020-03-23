
function buildCharts(sample){

  // Import Data
  d3.json("static/json/samples.json").then(function(data){
    
    // Building Bar Chart showing sample_values data for each patientIdNumber
    // Get data/values under "samples"
    var sampleDictionaries = data.samples;

    // -- Using .filter build in method -- //
    // var targetDictionary = sampleDictionaries.filter(function(sampleData){
    //   return sampleData.id == sample;
    // })[0];
    // ----------------------------------- //

    // Filter the sample data for specific patientIdNumber according what's selected in the dropDownMenu
    // An empty array to hold the filtered dictionary
    var filteredData = [];

    for (index = 0; index < sampleDictionaries.length; index++){
      var patientSampleDict = sampleDictionaries[index];

      // Get the dictionary for specific patientIdNumber and the dictionary is added to an array
      if (patientSampleDict.id == sample){
        filteredData.push(patientSampleDict)
      };
    };

    // From the filteredData, extract the values we need to plug into bar charts
    // .slice and .reverse the data for the "top 10 values" and "the highest values from the top" in the bar chart
    var sampleValues = filteredData[0].sample_values.slice(0, 10).reverse();
    var otuIds = filteredData[0].otu_ids.slice(0, 10).reverse();
    var otuLabels = filteredData[0].otu_labels.slice(0,10).reverse();

    // -- if we use .filter -- //
    // sampleValues = targetDictionary.sample_values.slice(0, 10).reverse();
    // otuIds = targetDictionary.otu_ids.slice(0, 10).reverse();
    // otuLabels = targetDictionary.otu_labels.slice(0,10).reverse();
    // ----------------------- //

    // Convert otuIds number to strings for yticks
    // -- Using .map build in method -- //
    // var yticks = otuIds.map(function(otuId){
    //   return `OTU ${otuId}`
    // });
    // -------------------------------- //

    // -- Using a for loop -- //
    otuIdsConverted = []

    for (var index = 0; index < otuIds.length; index++){
      // Convert each item to string and add it to the new array
      otuIdsConverted.push(`OTU ${otuIds[index].toString()}`);
    };
    // ---------------------- //

    var barChartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30, l: 150}
    };

    var barChartData = [
      {
        type: "bar",
        x: sampleValues,
        // y: yticks, // -- if we use .map -- //
        y: otuIdsConverted,
        text: otuLabels,
        orientation: "h"
      }
    ];

    Plotly.newPlot("bar", barChartData, barChartLayout);

    // Build Bubble Chart showing sample_values data for each patientIdNumber
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {t: 30}
    };

    // -- if we use .filter -- //
    // var bubbleData = [
    //   {
    //     x: targetDictionary.otu_ids,
    //     y: targetDictionary.sample_values,
    //     text: targetDictionary.otu_labels,
    //     mode: "markers",
    //     marker: {
    //       size: targetDictionary.sample_values,
    //       color: targetDictionary.otu_ids,
    //       colorscale: "Earth"
    //     }
    //   }
    // ];
    // ------------------------ //

    var bubbleData = [
      {
        x: filteredData[0].otu_ids,
        y: filteredData[0].sample_values,
        text: filteredData[0].otu_labels,
        mode: "markers",
        marker: {
          size: filteredData[0].sample_values,
          color: filteredData[0].otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
};

function buildMetadata(sample){

  // Import Data
  d3.json("static/json/samples.json").then(function(data){
    
    // Get data/values under "samples"
    var metadataDictionaries = data.metadata;

    // Filter the metadata for specific patientIdNumber according what's selected in the dropDownMenu
    // An empty array to hold the filtered metadata
    var filteredMetadata = [];

    for (index = 0; index < metadataDictionaries.length; index++){
      var metadataDict = metadataDictionaries[index];

      // Get the dictionary for specific patientIdNumber and the dictionary is added to an array
      if (metadataDict.id == sample){
        filteredMetadata.push(metadataDict)
      };
    };

    console.log(filteredMetadata[0]);

    // Select the position of demographic info in html
    var demograhicInfo = d3.select("#sample-metadata");

    // Clear any existing data in demograhic info
    demograhicInfo.html("");

    // From the filteredMetadata, extract the values and plug into the Demograhic Info Table
    Object.entries(filteredMetadata[0]).forEach(function([key, value]){
      demograhicInfo.append("h6").text(`${key}: ${value}`)
    });
    
  });
};

function init(){
  // Import Data
  d3.json("static/json/samples.json").then(function(data) {
    
    // Test the data is loaded properly in console
    console.log('Here is the data from samples.json:');
    console.log(data);

    // -- Building the dropdown menu listing the patientIdNumber -- //
    
    // Select the position of dropdown in html
    var dropDownMenu = d3.select("#selDataset");

    // Get array of sample names (ids)
    var sampleNames = data.names;

    // Build dropDownMenu items by looping through the sampleNames array
    for (var index = 0; index < sampleNames.length; index++){
      var patienIdNumber = sampleNames[index];

      dropDownMenu
        .append("option")
        .text(patienIdNumber)
        .property("value", patienIdNumber);
    };

    // By default the website will show patientIdNumber = "940"
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Creating a function for controlling the charts and metadata showing 
// for specific patientIdNumber in dropDownMenu
function optionChanged(newSample){
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the Dashboard
init();

