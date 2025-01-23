console.log('Navigation and theme switcher initialized.');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  // Add the rest of your pages here
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
        // if (!ARE_WE_HOME && !url.startsWith('http')) {
        //     url = '../' + url; 
        // }
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
