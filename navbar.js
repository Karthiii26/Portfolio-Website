function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}

let isScrolling;

window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollTopBtn');
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10);

    if (isAtBottom) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
    document.body.classList.add('is-scrolling');
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 1000);
});
