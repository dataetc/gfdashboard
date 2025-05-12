// Parallax scrolling effect
window.addEventListener('scroll', function() {
  let parallax = document.querySelector('.hero');
  let scrollPosition = window.pageYOffset;

  parallax.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
});
