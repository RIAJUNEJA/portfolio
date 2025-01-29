// import { fetchJSON, renderProjects } from '../global.js';
// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');
import { fetchJSON, renderProjects } from '../global.js';

fetchJSON('../lib/projects.json').then(projects => {
    const projectsContainer = document.querySelector('.projects');

    projects.forEach(project => {
        renderProjects(project, projectsContainer, 'h2');
    });
});
