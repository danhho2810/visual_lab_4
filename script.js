// Margin convention:
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Loading dataset:
d3.csv("wealth-health-2014.csv", d3.autoType).then((data) => {

	let regionsArr = [];

	data.map((d) => {
		if (!regionsArr.includes(d.Region)) {
			regionsArr.push(d.Region);
		}
	});
	console.log(regionsArr);
	let regions = d3.extent(data, function (i) {
		return i.Region;
	});

	const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map((d) => d.Income)))
        .range([0, width]);
	const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map((d) => d.LifeExpectancy)))
        .range([height, 0]);

    let ordScale = d3
        .scaleOrdinal()
        .domain(regions)
        .range(d3.schemeTableau10);
	let rScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map((d) => d.Population)))
        .range([4, 15]);

    const yAxis = d3.axisLeft().scale(yScale);
	const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s");

	const svg = d3
        .select(".chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw the circles
	svg
        .selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(d.Income))
		.attr("cy", (d) => yScale(d.LifeExpectancy))
		.attr("r", (d) => rScale(d.Population))
		.attr("fill", (d) => ordScale(d.Region))
		.attr("stroke", "black")
        .style("opacity", ".7")
		.on("mouseenter", (event, d) => {
			const position = d3.pointer(event, window);
			let textdisplay =
				"Country: " +
				d.Country +
				"<br>Life Expectancy: " +
				d.LifeExpectancy +
				"<br>Income: " +
				d.Income.toLocaleString("en-US") +
				"<br>Population: " +
				d.Population.toLocaleString("en-US") +
				"<br>Region: " +
				d.Region;

			d3.select(".tooltip")
				.style("position", "fixed")
				.style("display", "block")
                .style("fill", "black")
				.style("left", position[0] + "px")
				.style("top", position[1] + "px")
                .html(textdisplay);
		})
		.on("mouseleave", (event, d) => {
			d3.select(".tooltip").style("display", "none");
		});
    
	// Draw the axes
	svg
        .append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", `translate(0, ${height})`);

	svg.append("g").attr("class", "axis y-axis").call(yAxis);

	svg
        .append("text")
		.attr("x", width - 50)
		.attr("y", height - 5)
        .attr("class", "axis-label")
		.text("Income");

	svg
        .append("text")
		.attr("x", 10)
		.attr("y", 0)
        .attr("class", "axis-label")
        .text("Life Expectancy")
        .style("writing-mode", "vertical-lr");

    svg
        .selectAll("rect")
        .data(ordScale.domain())
        .enter()
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", width - 150)
        .attr("y", (d, i) => height - 50 - i * 18)
        .style("fill", (d) => ordScale(d));
    
    svg
        .selectAll("text2")
        .data(ordScale.domain())
        .enter()
        .append("text")
        .attr("x", width - 130)
        .attr("y", (d, i) => height - 37 - i * 18)
        .text((d) => d);
});