document.addEventListener('DOMContentLoaded', () => {
    fetchLeetCode();
    fetchCodeChef();
    fetchCodeforces();
});

let isSyncing = false;

window.addEventListener('load', () => {
    setTimeout(checkAndShowToast, 1200);
});

function checkAndShowToast() {
    const hasBeenShown = sessionStorage.getItem('platforms_toast_shown');
    
    const leetMissing = !sessionStorage.getItem('leetcode_data');
    const chefMissing = !sessionStorage.getItem('codechef_data');
    const forcesMissing = !sessionStorage.getItem('codeforces_data');

    if (!hasBeenShown && (isSyncing || leetMissing || chefMissing || forcesMissing)) {
        if (typeof showToast === 'function') {
            showToast("Syncing coding profiles...", 3500);
        }
        sessionStorage.setItem('platforms_toast_shown', 'true');
    }
}

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

    const cached = sessionStorage.getItem('leetcode_data');
    if (cached) {
        const data = tryParseJSON(cached);
        if (data) {
            if (data.totalSolved) animateTextValue(solvedEl, 0, data.totalSolved, " Problems Solved");
            if (data.contestRating) animateValue(ratingEl, 0, Math.round(data.contestRating));
            return;
        }
    }

    isSyncing = true;

    try {
        const profileRes = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
        const profileData = await profileRes.json();
        
        let savedData = {};
        
        if (profileData && profileData.totalSolved) {
            savedData.totalSolved = profileData.totalSolved;
            animateTextValue(solvedEl, 0, profileData.totalSolved, " Problems Solved");
        }

        const contestRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`);
        const contestData = await contestRes.json();

        if (contestData && contestData.contestRating) {
            savedData.contestRating = contestData.contestRating;
            animateValue(ratingEl, 0, Math.round(contestData.contestRating));
        } else {
            savedData.contestRating = 1389;
            animateValue(ratingEl, 0, 1389); 
        }

        sessionStorage.setItem('leetcode_data', JSON.stringify(savedData));

    } catch (error) {
        animateValue(ratingEl, 0, 1408);
        animateTextValue(solvedEl, 0, 293, " Problems Solved");
    }
}

async function fetchCodeChef() {
    const username = 'kit28aiml034';
    const ratingEl = document.getElementById('codechef-rating');
    const contestsEl = document.getElementById('codechef-contests');

    const cached = sessionStorage.getItem('codechef_data');
    if (cached) {
        const data = tryParseJSON(cached);
        if (data && data.rating) {
            animateValue(ratingEl, 0, parseInt(data.rating));
            if (data.contests && data.contests !== 'N/A') {
                animateTextValue(contestsEl, 0, parseInt(data.contests), ' Contests');
            }
            return;
        }
    }

    isSyncing = true;

    try {
        const response = await fetch(`/api/codechef?handle=${username}`);
        if (!response.ok) throw new Error('CodeChef API failed');
        const data = await response.json();

        if (data && data.rating) {
            sessionStorage.setItem('codechef_data', JSON.stringify(data));
            animateValue(ratingEl, 0, parseInt(data.rating));
            if (data.contests && data.contests !== 'N/A') {
                animateTextValue(contestsEl, 0, parseInt(data.contests), ' Contests');
            }
        } else {
            throw new Error('Invalid data');
        }
    } catch (error) {
        animateValue(ratingEl, 0, 1126);
    }
}

async function fetchCodeforces() {
    const username = 'karthikesh';
    const ratingEl = document.getElementById('codeforces-rating');
    const statusEl = document.getElementById('codeforces-status');

    const cached = sessionStorage.getItem('codeforces_data');
    if (cached) {
        const data = tryParseJSON(cached);
        if (data && data.rating) {
            animateValue(ratingEl, 0, data.rating);
            statusEl.textContent = "Active";
            statusEl.style.opacity = '1';
            return;
        }
    }

    isSyncing = true;

    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const data = await response.json();

        if (data.status === 'OK' && data.result.length > 0) {
            const user = data.result[0];
            if (user.rating) {
                sessionStorage.setItem('codeforces_data', JSON.stringify({ rating: user.rating }));
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
        animateValue(ratingEl, 0, 815);
    }
}

function animateValue(obj, start, end, duration = 1000) {
    if (isNaN(start) || isNaN(end) || start === end) {
        obj.innerHTML = isNaN(end) ? (obj.dataset.fallback || "0") : end; 
        return;
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
    if (isNaN(start) || isNaN(end)) {
        obj.innerHTML = isNaN(end) ? (obj.dataset.fallback || end) : `${end}${suffix}`;
        return;
    }
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
