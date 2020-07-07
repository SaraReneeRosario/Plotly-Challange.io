// Plots plots plots
function getPlot(id) {
    d3.json("samples.json").then((data)=> {
        console.log(data)

        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var metaData = data.metadata.filter(meta => meta.id.toString() === id)[0];
        //console.log(`Washing Freq: ${wfreq}`)

        // filtering samples by id
        var samples = data.samples.filter(s=>s.id.toString() === id)[0];
        console.log(samples);  

        // Getting the top values
        var top = samples.sample_values.slice(0, 10).reverse();
        var top10 = (samples.otu_ids.slice(0, 10)).reverse();

        // Get ids for plots
        var top10ids = top10.map(d => "OTU " + d)
        console.log(`OTU IDS; ${top10ids}`)

        // Plot labels
        var labels = samples.otu_labels.slice(0, 10);
        var sample_values = samples.sample_values.slice(0, 10);

        // Building the plot
        var trace = {
            x: sample_values,
            y: top10ids,
            text: labels,
            marker: {
                color: `rgb(124, 124, 124)`},
            type: "bar",
            orientation: "h",
            }

        // Making a variable to store data
        var buttonData = [trace];
        // Establishing the trace layout
        var layout = {
            title: "Top 10 IDs",
            yaxis:{
                tickmode:"linear"
            },
            margin:{
                l:100,
                r:100,
                t:100,
                b:100,
            }
        };
        //Creating the Bar plot
        Plotly.newPlot("bar", buttonData, layout);
        //console.log(`ID: ${samples.out_ids}`)

        //Creating the bubble chart
        var traceBubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        // Bubble chart layout
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // creating data variable 
        var data1 = [traceBubble];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // The guage chart
  console.log(metaData.wfreq)
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(metaData.wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "rgba(0,105,11,.5)"},
                    { range: [2, 4], color: "rgba(14,127,0,.5)"},
                    { range: [4, 6], color: "rgba(170,202,42,.5)"},
                    { range: [6, 8], color: "rgba(210,206,145,.5)" },
                    { range: [8, 9], color: "rgba(240, 230,215,.5)"},
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
    });
}; 
// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();