console.log('Navigation and theme switcher initialized.');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'resume/index.html', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title; 
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  a.target = a.host !== location.host ? '_blank' : '';
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme; 
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark'); 
}

select.addEventListener('input', function (event) {
  console.log('Color scheme changed to:', event.target.value);
  setColorScheme(event.target.value);
  localStorage.colorScheme = event.target.value; 
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}
export function renderProjects(project, containerElement,headingLevel = 'h2' ) {
    // Your code will go here
    containerElement.innerHTML = '';
    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (!validHeadings.includes(headingLevel)) {
            console.warn(`Invalid heading level: ${headingLevel}. Defaulting to h2.`);
            headingLevel = 'h2';
        }
    for(const proj of project){
        const article = document.createElement('article');
        
        article.innerHTML = `
            <h3>${proj.title}</h3>
            <img src="${proj.image}" alt="${proj.title}">
            <p>${proj.description}</p>
        `;
        containerElement.appendChild(article);
    }

}

export async function fetchGitHubData(username) {
    // return statement here
    return fetchJSON(`https://api.github.com/users/${username}`);
}


