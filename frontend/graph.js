import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//Graph functions generated using Chat GPT
export function createBarGraph(containerId, dataX, dataY) {
    // Set up dimensions and margins for the SVG
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    d3.select(containerId).select("svg").remove();
    // Create SVG element
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create x and y scales
    const x = d3.scaleBand()
        .domain(dataX)
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataY)])
        .nice()
        .range([height, 0]);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add bars with animation
    svg.selectAll(".bar")
        .data(dataX)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d))
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", "steelblue")
        .transition()
        .duration(1500)
        .attr("y", (d, i) => y(dataY[i]))
        .attr("height", (d, i) => height - y(dataY[i]));

    // Add tooltips
    const tooltip = d3.select(containerId)
        .append("div")
        .style("position", "absolute")
        .style("background", "#f9f9f9")
        .style("padding", "5px")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "5px")
        .style("opacity", 0)
        .style("pointer-events", "none");

        svg.selectAll(".bar")
        .on("mouseover", function (event, d) {
            const [x, y] = d3.pointer(event, this);
            const index = dataX.indexOf(d);
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Value: ${dataY[index]}`)
                .style("left", `${x + margin.left + 5}px`)
                .style("top", `${y + margin.top - 28}px`);
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Add axis labels


    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-margin.left + 20},${height / 2})rotate(-90)`)
        .text("Data Count");

    // Add border to SVG
    d3.select(containerId).select("svg").attr("class", "bordered-svg");
}

export function createHorizontalBarGraph(containerId, dataX, dataY) {
    // Set up dimensions and margins for the SVG
    const margin = { top: 40, right: 150, bottom: 40, left: 150 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Remove existing SVG if any
    d3.select(containerId).select("svg").remove();

    // Create SVG element
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create x and y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(dataY)])
        .range([0, width])
        .nice();

    const y = d3.scaleBand()
        .domain(dataX)
        .range([0, height])
        .padding(0.2);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => `${d}%`))
        .selectAll("text")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add bars
    svg.selectAll(".bar")
        .data(dataX)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", 0)
        .attr("fill", (d, i) => color(i))
        .transition()
        .duration(1500)
        .attr("width", (d, i) => x(dataY[i]));

    // Add labels inside the bars
    svg.selectAll(".label")
        .data(dataX)
        .enter().append("text")
        .attr("class", "label")
        .attr("y", d => y(d) + y.bandwidth() / 2)
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("fill", "white")
        .text((d, i) => `${dataY[i]}%`);
        
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${-margin.left + 50},${height / 2})rotate(-90)`)
        .text("Data");
    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

    legend.selectAll("rect")
        .data(dataX)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", (d, i) => color(i));

    legend.selectAll("text")
        .data(dataX)
        .enter().append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 9)
        .text((d, i) => `${dataY[i]}%`)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");
    
    d3.select(containerId).select("svg").attr("class","bordered-svg")
}
