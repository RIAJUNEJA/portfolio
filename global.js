console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
const navLinks = $$("nav a");
console.log(navLinks);
//asked chatGPT to help me with this step as i was a little lost
const currentPage = window.location.pathname;

navLinks.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("current");
  }
});