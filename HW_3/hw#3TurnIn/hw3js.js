// creating the interaction 
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
 [document.getElementById('generation').addEventListener(
     eventType,
     function (e) {
         var chart,
             point,
             i,
             event;

         for (i = 0; i < Highcharts.charts.length; i = i + 1) {
             chart = Highcharts.charts[i];
             // Find coordinates within the chart
             event = chart.pointer.normalize(e);
             // Get the hovered point
             point = chart.series[0].searchPoint(event, true);


             if (point) {
                 point.highlight(e);
             }
         }
     }
 ),

 //adding the interaction to the price chart
 document.getElementById('price').addEventListener(
     eventType,
     function (e) {
         var chart,
             point,
             i,
             event;

         for (i = 0; i < Highcharts.charts.length; i = i + 1) {
             chart = Highcharts.charts[i];
             // Find coordinates within the chart
             event = chart.pointer.normalize(e);
             // Get the hovered point
             point = chart.series[0].searchPoint(event, true);

             if (point) {
                 point.highlight(e);
             }
         }
     }
 ),

 //adding the interaction to the temperature chart
 document.getElementById('temperature').addEventListener(
     eventType,
     function (e) {
         var chart,
             point,
             i,
             event;

         for (i = 0; i < Highcharts.charts.length; i = i + 1) {
             chart = Highcharts.charts[i];
             // Find coordinates within the chart
             event = chart.pointer.normalize(e);
             // Get the hovered point
             point = chart.series[0].searchPoint(event, true);

             if (point) {
                 point.highlight(e);
             }
         }
     }
 )]

});



/**
* Override the reset function, we don't need to hide the tooltips and
* crosshairs.
*/
Highcharts.Pointer.prototype.reset = function () {
 return undefined;
};

/**
* Highlight a point by showing tooltip, setting hover state and draw crosshair
*/
Highcharts.Point.prototype.highlight = function (event) {
 event = this.series.chart.pointer.normalize(event);
 this.onMouseOver(); // Show the hover marker
 this.series.chart.tooltip.refresh(this); // Show the tooltip
 this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
* Synchronize zooming through the setExtremes event handler.
*/
function syncExtremes(e) {
 var thisChart = this.chart;

 if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
     Highcharts.each(Highcharts.charts, function (chart) {
         if (chart !== thisChart) {
             if (chart.xAxis[0].setExtremes) { // It is null while updating
                 chart.xAxis[0].setExtremes(
                     e.min,
                     e.max,
                     undefined,
                     false,
                     { trigger: 'syncExtremes' }
                 );
             }
         }
     });
 }
};

// Get the data. The contents of the data file can be viewed at
var divs = ['generation', 'price', 'temperature'];


// creates the Temperature graph
Highcharts.ajax({
 url: 'springfield.json',
 dataType: 'text',
 success: function (datasets) {

     datasets = JSON.parse(datasets);
     dataset = datasets[10];

     var chartDiv = document.getElementById('temperature'); //document.createElement('div');
         
     Highcharts.chart(chartDiv, {
         chart: {
             marginLeft: 50, // Keep all charts left aligned
             spacingTop: 10,
             spacingRight: 40,
             spacingBottom: 20,
             backgroundColor: '#ece9e6' //change the background color
         },

         //title of the chart
         title: {
             text: 'Temperature (°F)',
             align: 'left',
             margin: 0,
             x: 30
         },
         credits: {
             enabled: false
         },
         legend: {
             enabled: false
         },

         xAxis: {
             type: 'datetime',
             crosshair: {
                 color : 'red',
                 width: 0.5,
             },
             
             events: {
                 setExtremes: syncExtremes
             },
             labels: {
                 enabled: true,
                 // format: '{value}'
             }
         },
         yAxis: {
             gridLineDashStyle: 'longdash',
             minorTickInterval: '0.2',
             tickAmount: 5,
             min: 0,
             ceiling: 100,
             title: {
                 text: null
             },
         },
         tooltip: {
             positioner: function () {
                 return {
                     // right aligned
                     x: this.chart.chartWidth - this.label.width - 50,
                     y: 10 // align to title
                 };
             },
             borderWidth: 0,
             backgroundColor: 'none',
             pointFormat: '{point.y}',
             headerFormat: '',
             shadow: false,
             style: {
                 fontSize: '18px'
             },
             valueDecimals: dataset.valueDecimals
         },
         series: [{
             data: dataset.history.data,
             name: dataset.id,
             pointStart: dataset.history.start*1000,
             pointInterval: 1000*60*30,
             type: "line",
             color: '#FF0000',
             fillOpacity: 0.3,
             tooltip: {
                 valueSuffix: ' ' +  '°F'
             }
         }]
     })
 }
});
var price = [];


// Creates the Price chart
Highcharts.ajax({
 url: 'springfield.json',
 dataType: 'text',
 success: function (datasets) {

     datasets = JSON.parse(datasets);
     dataset = datasets[8];
     price = dataset;

     var chartDiv = document.getElementById('price'); 
         
     Highcharts.chart(chartDiv, {
         chart: {
             marginLeft: 50, // Keep all charts left aligned
             spacingTop: 10,
             spacingRight: 40,
             spacingBottom: 20,
             backgroundColor: '#ece9e6'
         },
         title: {
             text: 'Price ($/MWh)',
             align: 'left',
             margin: 0,
             x: 30
         },
         credits: {
             enabled: false
         },
         legend: {
             enabled: false
         },
         xAxis: {
             gridLineDashStyle: 'longdash',
             type: 'datetime',
             crosshair: {
                color : 'red',
            },
             events: {
                 setExtremes: syncExtremes
             },
             labels: {
                 enabled: false,
                 // format: '{value}'
             }
         },
         yAxis: {
             gridLineDashStyle: 'longdash',
             minorTickInterval: '0.2',
             tickAmount: 5,
             min: 0,
             max:300,
             ceiling: 300,
             title: {
                 text: null
             },
         },
         tooltip: {
             positioner: function () {
                 return {
                     // right aligned
                     x: this.chart.chartWidth - this.label.width - 50,
                     y: 10 // align to title
                 };
             },
             borderWidth: 0,
             backgroundColor: 'none',
             pointFormat: '{point.y}',
             headerFormat: '',
             shadow: false,
             style: {
                 fontSize: '18px'
             },
             valueDecimals: dataset.valueDecimals
         },
         series: [{
             data: dataset.history.data,
             name: dataset.id,
             type: "line",
             color: '#FF0000',
             width: 0.5,
             fillOpacity: 0.3,
             tooltip: {
                 valuePrefix: '$',//dataset.unit
                 valueSuffix: '/MWh'
             }
         }]
     })
 }
});


var seriesOptions = [],
 seriesCounter = 0,
 names = [0,1,2,3,4,5,6];


// creates the Generation chart
function createChart() {
    console.log(seriesOptions)
 Highcharts.chart('generation', {
     title: {
         text: 'Generation (MW)',
         align: 'left',
         margin: 0,
         x: 30
     },
     chart: {
         type: 'area',
         marginLeft: 50, // Keep all charts left aligned
         spacingTop: 10,
         spacingRight: 40,
         spacingBottom: 40,
         backgroundColor: '#ece9e6',

     },

     
     legend: {
         enabled: false,
     },
     xAxis: {
             type: 'datetime',
             crosshair: {
                color : 'red',
                width:0.5,
            },
             events: {
                 setExtremes: syncExtremes
             },
             labels: {
                 enabled: false,
                 // format: '{value}'
             }
         },
     yAxis: {
         startOnTick: false,
         endOnTick: false,
         max: 9500,
         min:-1000,
         offset: -20,
         labels: {
             formatter: function () {
                 return (this.value > 0 ? ' ' : ' ') + this.value + 'MW';
             }
         },
         plotLines: [{
             value: 0,
             width: 2,
             // color: 'silver'
         }]
     },
     plotOptions: {
         area: {
             stacking: 'normal',
         }
     },
     tooltip: {
         pointFormat: '',
         valueDecimals: 2,
         split: true,
     },

     

     series: seriesOptions.reverse(),

 });
}

//colors for the generation chart 
var colors = ['black', 'red' , '#FFA500', '#157DEC' , 'Purple', 'Green', 'yellow']

//Imports the data for the Generation chart
Highcharts.ajax({
 url: 'springfield.json',
 dataType: 'text',
 success: function (datasets) {
     datasets = JSON.parse(datasets);
     for (i = 0; i < 7; i++) {
         
         dataset = datasets[i];
         sample = dataset.history.data.filter((_,i) => i % 6 == 0); // get every 6th

         if (i == 6 || i == 4) {
             for(var j=0; j<sample.length; j++) {
                 sample[j] *= -1;
             }
         }
         seriesOptions[i] = {
             name: dataset.fuel_tech,
             data: sample,
             pointStart: dataset.history.start*1000,
             pointInterval: 1000*60*30,
             type: 'area',
             stacking: 'normal',
             color: colors[i]

         };


         seriesCounter += 1;
         if (seriesCounter === names.length) {
             createChart();
         }
     }
 }
});


