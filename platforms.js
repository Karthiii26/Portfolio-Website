document.addEventListener('DOMContentLoaded', () => {
    fetchLeetCode();
    fetchCodeChef();
    fetchCodeforces();
});

function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

async function fetchLeetCode() {
    const username = 'Karthii_26';
    const ratingEl = document.getElementById('leetcode-rating');
    const solvedEl = document.getElementById('leetcode-solved');

    try {
        const profileRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
        const profileData = await profileRes.json();
        
        if (profileData && profileData.totalSolved) {
            animateTextValue(solvedEl, 0, profileData.totalSolved, " Problems Solved");
        }

        const contestRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
        const contestData = await contestRes.json();

        if (contestData && contestData.contestRating) {
            animateValue(ratingEl, 0, Math.round(contestData.contestRating));
        } else {
            animateValue(ratingEl, 0, 1389); 
        }

    } catch (error) {
        animateValue(ratingEl, 0, 1389); 
        animateTextValue(solvedEl, 0, 150, " Problems Solved");
    }
}

async function fetchCodeChef() {
    const username = 'kit28aiml034';
    const ratingEl = document.getElementById('codechef-rating');

    try {
        const response = await fetch(`https://codechef-api-faisalshohag.vercel.app/${username}`);
        if (!response.ok) throw new Error('CodeChef API failed');
        const data = await response.json();

        if (data && data.currentRating) {
            animateValue(ratingEl, 0, data.currentRating);
        } else {
            throw new Error('Invalid data');
        }
    } catch (error) {
        animateValue(ratingEl, 0, 1080); 
    }
}

async function fetchCodeforces() {
    const username = 'karthikesh';
    const ratingEl = document.getElementById('codeforces-rating');
    const statusEl = document.getElementById('codeforces-status');

    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const data = await response.json();

        if (data.status === 'OK' && data.result.length > 0) {
            const user = data.result[0];
            if (user.rating) {
                animateValue(ratingEl, 0, user.rating);
            }
            statusEl.textContent = "Active";
            statusEl.style.opacity = '0';
            setTimeout(() => {
                statusEl.style.transition = 'opacity 1s ease';
                statusEl.style.opacity = '1';
            }, 100);
        }
    } catch (error) {
        animateValue(ratingEl, 0, 1000); 
    }
}

function animateValue(obj, start, end, duration = 1000) {
    if (isNaN(start) || isNaN(end) || start === end) {
        obj.innerHTML = end; return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}
function animateTextValue(obj, start, end, suffix, duration = 1200) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `${current}${suffix}`;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}
