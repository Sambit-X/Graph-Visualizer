import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { createBarGraph, createHorizontalBarGraph } from './graph.js';

document.querySelectorAll(".filter_class").forEach(element => {
    element.addEventListener("change", () => {
        getDatasets();
    });
});

const filterEndpoints = [
    "filter_topic",
    "filter_sector",
    "filter_region",
    "filter_pestle",
    "filter_source",
    "filter_country"
];

//Fetch request to populate all the filters
filterEndpoints.forEach(endpoint => {
    fetch(`http://127.0.0.1:5000/api/${endpoint}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            d3.select(`#${endpoint}`)
                .selectAll("option")
                .data(data).enter()
                .append("option")
                .attr("id", "vars")
                .text(d => d);
        })
        .catch(error => console.error(`Error fetching ${endpoint}:`, error));
});

let selectedVar;

//Fetch request to populate the Variables
fetch("http://127.0.0.1:5000/api/vars", { method: "GET" })
    .then(response => response.json())
    .then(data => {
        d3.select("select")
            .selectAll("option")
            .data(data).enter()
            .append("option")
            .attr("id", "vars")
            .text(d => d);

        document.querySelectorAll("#vars").forEach(option => {
            option.addEventListener("click", () => {
                selectedVar = option.textContent;
                getDatasets();
            });
        });
    })
    .catch(error => console.error('Error fetching vars:', error));

//Function that generates the graph
function getDatasets() {
    const filters = {
        var: selectedVar,
        filter_endyear: document.querySelector("#filter_endyear").value,
        filter_topic: document.querySelector("#filter_topic").value,
        filter_sector: document.querySelector("#filter_sector").value,
        filter_region: document.querySelector("#filter_region").value,
        filter_pestle: document.querySelector("#filter_pestle").value,
        filter_source: document.querySelector("#filter_source").value,
        filter_country: document.querySelector("#filter_country").value
    };

    fetch("http://127.0.0.1:5000/api/dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    })
        .then(response => response.json())
        .then(data => {
            const { data: dataX, counts: dataY } = data;
            
            console.log("X-Axis", dataX);
            console.log("Y-Axis", dataY);

            d3.select("#container").select("svg").remove();

            // Use the fetched data to create the graph
            createHorizontalBarGraph("#container", dataX, dataY);
        })
        .catch(error => console.error('Error fetching datasets:', error));
}
