document.addEventListener('DOMContentLoaded', () => {
    // --- Welcome Section Sparkles ---
    const welcomeSection = document.getElementById('welcome');
    const welcomeContainer = document.getElementById('welcome-container');
    welcomeSection.classList.add('fade-in');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSparkles();
            } else {
                stopSparkles();
            }
        });
    });

    observer.observe(welcomeSection);

    // --- Work Section Fade-In ---
    const workSection = document.querySelector('.work-section');
    const workObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const elements = workSection.querySelectorAll('.btn, p, .work-pic');
            if (entry.isIntersecting) {
                elements.forEach(el => el.style.opacity = 1);
            } else {
                elements.forEach(el => el.style.opacity = 0);
            }
        });
    });
    workObserver.observe(workSection);

    let sparkleInterval;

    function startSparkles() {
        if (!sparkleInterval) {
            sparkleInterval = setInterval(createSparkle, 100);
        }
    }

    function stopSparkles() {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
    }

    function createSparkle() {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '&#x2728;'; // Star character
        const rect = welcomeContainer.getBoundingClientRect();
        sparkle.style.left = Math.random() * rect.width + 'px';
        sparkle.style.top = Math.random() * rect.height + 'px';
        welcomeContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }

    // --- Trail Canvas ---
    const canvas = document.getElementById('trail-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let points = [];
    document.addEventListener('mousemove', e => {
        points.push({ x: e.clientX, y: e.clientY, life: 0 });
    });

    function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            p.life++;
            if (p.life > 50) {
                points.splice(i, 1);
                i--;
                continue;
            }
            const alpha = 1 - (p.life / 50);
            ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.lineWidth = 5;
            if (i > 0) {
                ctx.beginPath();
                ctx.moveTo(points[i-1].x, points[i-1].y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        }
        requestAnimationFrame(drawTrail);
    }

    drawTrail();
    sizeProfilePic();

    // --- Lazy Load Spotify Iframes ---
    const spotifyIframes = document.querySelectorAll('iframe.spotify-embed[data-src]');
    const spotifyObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src; // set actual src
                iframe.title = "Spotify Playlist"; // Accessible name
                obs.unobserve(iframe);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    spotifyIframes.forEach(iframe => spotifyObserver.observe(iframe));
});

// --- Scroll Event ---
window.addEventListener('scroll', () => {
    const welcomeSection = document.getElementById('welcome');
    if (window.scrollY < 100) {
        welcomeSection.classList.add('fade-in');
    } else {
        welcomeSection.classList.remove('fade-in');
    }

    const scrollPosition = window.pageYOffset;
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = bodyHeight - windowHeight;
    const scrollPercentage = scrollPosition / scrollableHeight;
    document.body.style.backgroundPosition = `center ${-scrollPosition * 0.1}px`;
});

// --- Resize Event ---
window.addEventListener('resize', () => {
    const canvas = document.getElementById('trail-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sizeProfilePic();
});

// --- Profile Pic Sizing ---
function sizeProfilePic() {
    const textContainer = document.querySelector('#about .col-md-6:first-child');
    const profilePic = document.querySelector('.profile-pic');
    if (textContainer && profilePic) {
        profilePic.style.height = `${textContainer.offsetHeight}px`;
        profilePic.style.width = `${textContainer.offsetWidth * 0.8}px`;
    }
}

// --- Tableau Visualizations ---
function renderViz(vizId) {
    const divElement = document.getElementById(vizId);
    if (!divElement) return;

    const vizElement = divElement.getElementsByTagName('object')[0];
    if (!vizElement) return;

    vizElement.style.height = (divElement.offsetWidth * 0.65) + 'px';

    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
    vizElement.parentNode.insertBefore(scriptElement, vizElement);
}

const tableauVizIds = ['viz1', 'viz2', 'viz3'];
tableauVizIds.forEach(id => renderViz(id));
