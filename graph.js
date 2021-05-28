//This plugin creates the canvas background used for the graph.
const axios = require("axios")
const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      //Change the fill style below to change the background colour.
      //By default, it is set to Discord's chat background.
      ctx.fillStyle = "#36393E";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

let baseConfig = {
    type: 'line',
    options: {
        scales: {
            xAxes: [{
                type: "time",
                time: {unit: "day"},
                scaleLabel: {
                    display: true,
                    labelString: "Time in Days"
                }
            }],
            yAxes: [{
            scaleLabel: {
                display: true,
                labelString: "Cases per million"
            }}]
        },
    },
    plugins: plugin
}

const all = res =>{
    if(res.data.timeline){
        var data = res.data.timeline
        if(!(res.data.province instanceof Array)){
            var location = res.data.province
        } else {
            var location = res.data.country
        }
    } else {
        var data = res.data
        var location = "Global"
    }
    //Converts the day to a date format to make processing faster later.
    let days = Object.keys(data.cases).map(val => new Date(val))
    let cases = Object.values(data.cases)
    let config = baseConfig
    config.data = { 
        labels: days,
        datasets: [{
            data: cases,
            label: "Currently active cases",
            borderColor: "#000000",
            fill: false
        }],
    }
    config.options.title = {
        display: true,
        text:`${location} Active Cases (Going back ${days.length} days)`,
        fontSize: 18
    }
    config.options.scales.yAxes[0].ticks =  {
        // Sets the values to be in Millions (Better legibility)
        callback: function(value, index, values) {
            return (value / 1000000) + 'M';
        }}
    return config 
}

module.exports = {all}