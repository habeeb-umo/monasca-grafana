/* global _ */

/*
 * Complex scripted dashboard
 * This script generates a dashboard object that Grafana can load. It also takes a number of user
 * supplied URL parameters (in the ARGS variable)
 *
 * Return a dashboard object, or a function
 *
 * For async scripts, return a function, this function must take a single callback function as argument,
 * call this callback function with the dashboard object (look at scripted_async.js for an example)
 */

'use strict';
// accessible variables in this scope
var window, document, ARGS, $, jQuery, moment, kbn;

// Setup some variables
var dashboard;

// All url parameters are available via the ARGS object
var ARGS;

// Intialize a skeleton with nothing but a rows array and service object
dashboard = {
  rows : [],
};

// Set a title
dashboard.title = 'Metrics Dashboard';

// Set default time
// time can be overriden in the url using from/to parameters, but this is
// handled automatically in grafana core during dashboard initialization
dashboard.time = {
  from: "now-6h",
  to: "now"
};

var rows = 1;
var seriesName = 'argName';

if(!_.isUndefined(ARGS.rows)) {
  rows = parseInt(ARGS.rows, 10);
}

if(!_.isUndefined(ARGS.name)) {
  seriesName = ARGS.name;
}

for (var i = 0; i < rows; i++) {

  dashboard.rows.push({
      collapse: false,
      height: "250px",
      panels: [
        {
          aliasColors: {},
          bars: false,
          dashLength: 10,
          dashes: false,
          datasource: "Monasca",
          fill: 1,
          id: 1,
          legend: {
            avg: false,
            current: false,
            max: false,
            min: false,
            show: true,
            total: false,
            values: false
          },
          lines: true,
          linewidth: 1,
          links: [],
          nullPointMode: "null",
          percentage: false,
          pointradius: 5,
          points: false,
          renderer: "flot",
          seriesOverrides: [],
          spaceLength: 10,
          span: 12,
          stack: false,
          steppedLine: false,
          targets: [
            {
            "aggregator": "none",
            "dimensions": [
              {
                "key": "deployment",
                "value": "monasca-aggregator"
              },
              {
                "key": "namespace",
                "value": "monitoring"
              },
              {
                "key": "app",
                "value": "monasca-monasca"
              },
              {
                "key": "pod_name",
                "value": "monasca-aggregator-1701964035-g9m5l"
              }
            ],
            "error": "",
            "metric": "pod.restart_count",
            "period": "300",
            "refId": "A"
            }
          ],
          thresholds: [],
          timeFrom: null,
          timeShift: null,
          title: "Metric",
          tooltip: {
            shared: true,
            sort: 0,
            value_type: "individual"
          },
          type: "graph",
          xaxis: {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          yaxes: [
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            }
          ]
        }
      ],
      repeat: null,
      repeatIteration: null,
      repeatRowId: null,
      showTitle: false,
      title: "Dashboard Row",
      titleSize: "h6"
    });
}


return dashboard;
