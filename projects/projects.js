
import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json'); 

        const projectsContainer = document.querySelector('.projects');
        const projectCountElement = document.querySelector('#project-count'); 

        if (!projectsContainer) {
            console.error("Error: `.projects` container not found in HTML.");
            return;
        }

        if (!projects || projects.length === 0) {
            projectsContainer.innerHTML = "<p>No projects available at the moment.</p>";

            if (projectCountElement) {
                projectCountElement.textContent = "0";
            }
            return;
        }

        if (projectCountElement) {
            projectCountElement.textContent = projects.length;
        } 

        renderProjects(projects, projectsContainer, 'h2');

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

loadProjects();
