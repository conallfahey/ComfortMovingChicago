// Inject shared footer across pages
document.addEventListener('DOMContentLoaded', () => {
  const fetchFooter = () => fetch('partials/footer.html', { cache: 'no-cache' }).then(r => r.text());

  const replaceFooter = (html) => {
    const target = document.getElementById('shared-footer') || document.querySelector('footer');
    if (target) {
      target.outerHTML = html;
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      const footerEl = wrapper.firstElementChild;
      if (footerEl) {
        document.body.appendChild(footerEl);
      }
    }
  };

  fetchFooter()
    .then(html => replaceFooter(html))
    .catch(err => console.error('Footer include failed:', err));
});