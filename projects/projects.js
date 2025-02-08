import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = '';
let selectedIndex = -1;
let searchInput = document.querySelector('.searchBar');
let projects = [];

async function loadProjects() {
    try {
        projects = await fetchJSON('../lib/projects.json'); 

        const projectsContainer = document.querySelector('.projects');
        const projectCountElement = document.querySelector('#project-count'); 

        if (!projectsContainer) {
            console.error("Error: `.projects` container not found in HTML.");
            return;
        }

        renderPieChart(projects);
        updateProjects();

        searchInput.addEventListener('input', (event) => {
            query = event.target.value;
            updateProjects();
        });

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

function updateProjects() {
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        let matchesQuery = values.includes(query.toLowerCase());

        let matchesYear = true;
        if (selectedIndex !== -1 && selectedIndex < newData.length) {
            let selectedYear = newData[selectedIndex].label;
            matchesYear = project.year === selectedYear;
        }

        return matchesQuery && matchesYear;
    });

    const projectsContainer = document.querySelector('.projects');
    const projectCountElement = document.querySelector('#project-count');

    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = "<p>No matching projects found.</p>";
        if (projectCountElement) projectCountElement.textContent = "0";
    } else {
        renderProjects(filteredProjects, projectsContainer, 'h2');
        if (projectCountElement) projectCountElement.textContent = filteredProjects.length;
    }
}

let newData = [];

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

    let svg = d3.select('#projects-pie-plot').html("");
    let legend = d3.select('.legend').html("");

    arcData.forEach((d, idx) => {
        svg.append('path')
          .attr('d', arcGenerator(d))
          .attr('fill', colors(idx))
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('class', 'pie-slice')
          .style('cursor', 'pointer')
          .on('click', function () {
              selectedIndex = selectedIndex === idx ? -1 : idx;

              svg.selectAll('path')
                 .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

              legend.selectAll('li')
                    .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

              updateProjects();
          });
    });

    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', function () {
                selectedIndex = selectedIndex === idx ? -1 : idx;

                svg.selectAll('path')
                   .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

                legend.selectAll('li')
                      .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

                updateProjects();
            });
    });
}

loadProjects();
