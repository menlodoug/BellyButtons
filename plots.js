function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
});
}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
      
      PANEL.html("");  
      PANEL.append("h6").text("ID:" + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("BBTYPE: " + result.bbtype);
      PANEL.append("h6").text("WFREQ: " + result.wfreq);
    
});
  }

  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var otuArray = samples.filter(sampleObj => sampleObj.id == sample);
        var otu = otuArray[0];
        var otu_ids = otu.otu_ids;
        var otu_labels = otu.otu_labels;
        var sample_values = otu.sample_values;
        var yticks = otu_ids.slice(0,10).map(otuid =>`OTU${otuid}` ).reverse()
        var trace = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
          }
        var data = [trace];
        var layout = {
            title: "Top Ten Bacterial Species Found",
            height: 500,
            width: 500
        }
        Plotly.newPlot("bar", data, layout);
        });

        d3.json("samples.json").then((data) => {
            var samples = data.samples;
            var bubbleArray = samples.filter(sampleObj => sampleObj.id == sample);
            var bubble = bubbleArray[0];
            var otu_ids = bubble.otu_ids;
            var otu_labels = bubble.otu_labels;
            var sample_values = bubble.sample_values;
            var trace1 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
              };
              
              var data = [trace1];
              
              var layout = {
                xaxis: {
                    title: 'OTU IDs'
                },
                yaxis: {
                    title: 'Sample Values'
                },
                showlegend: false,
                height: 450,
                width: 900
              };
              
              Plotly.newPlot('bubble', data, layout);
            });

            d3.json("samples.json").then((data) => {
                var samples = data.metadata;
                var gaugeArray = samples.filter(sampleObj => sampleObj.id == sample);
                var gauged = gaugeArray[0];
                var washed = gauged.wfreq
                var data = [
                    {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: washed,
                        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
                        type: "indicator",
                        mode: "gauge+number",
                        gauge: {
                            axis: { range: [null, 9] },
                            steps: [
                              { range: [0, 1], color: "lightgray"},
                              { range: [1, 2], color: "lightgreen"},
                              { range: [2, 3], color: "lightgray"},
                              { range: [3, 4], color: "lightgreen"},
                              { range: [4, 5], color: "lightgray" },
                              { range: [5, 6], color: "lightgreen" },
                              { range: [6, 7], color: "lightgray" },
                              { range: [7, 8], color: "lightgreen" },
                              { range: [8, 9], color: "lightgray" },
                            ],
                            threshold: {
                              line: { color: "red", width: 4 },
                              thickness: 0.75,
                              value: washed
                            }
                          }
                    }
                ];
                
                var layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
                Plotly.newPlot('gauge', data, layout);
    });

        }
