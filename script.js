// EDIT YOUR PLACEHOLDER LINKS HERE.
// Use a full https:// URL for external pages or #section-id for this page.
const links = {
    characterDesign: "#character-design",
    illustrations: "#illustrations",
    customInquiry: "mailto:hello@example.com?subject=Custom%20Inquiry",
    seeMore: "https://example.com/portfolio",
    contact: "mailto:hello@example.com",
    twitter: "https://x.com/",
    instagram: "https://instagram.com/",
    vgen: "https://vgen.co/",
    linkedin: "https://linkedin.com/"
};

// Make the original service cards clickable WITHOUT changing the HTML layout.
const serviceCards = document.querySelectorAll(".services .service");
const serviceDestinations = [
    links.characterDesign,
    links.illustrations,
    links.customInquiry
];

serviceCards.forEach((card, index) => {
    const destination = serviceDestinations[index];
    if (!destination) return;

    card.style.cursor = "pointer";

    if (card.tagName.toLowerCase() === "a") {
        card.href = destination;
        return;
    }

    // The first two cards are <div>s, so support mouse AND keyboard clicks.
    card.setAttribute("role", "link");
    card.tabIndex = 0;

    const openCard = () => { window.location.href = destination; };
    card.addEventListener("click", openCard);
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            openCard();
        }
    });
});

// Fill in the other placeholder destinations without rewriting original markup.
const seeMore = document.querySelector(".more a");
if (seeMore) seeMore.href = links.seeMore;

const contactHeading = document.querySelector(".contact-section h2 a");
if (contactHeading) contactHeading.href = links.contact;

const footerLinks = document.querySelectorAll(".footer-links a");
const footerDestinations = [
    links.contact,
    links.twitter,
    links.instagram,
    links.vgen,
    links.linkedin
];

footerLinks.forEach((anchor, index) => {
    if (footerDestinations[index]) anchor.href = footerDestinations[index];
});

// LOGO EASTER EGG + LIGHT MODE
// These extras are added through JavaScript, so the original HTML stays intact.

// Keep the selected theme when someone refreshes the page.
const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.className = "theme-toggle";
document.body.appendChild(themeButton);

let savedTheme = "dark";
try {
    savedTheme = localStorage.getItem("ray-portfolio-theme") || "dark";
} catch (error) {
    // Local storage may be unavailable in private browsing or file previews.
}

function setTheme(theme) {
    const light = theme === "light";
    document.body.classList.toggle("theme-light", light);
    themeButton.textContent = light ? "☾ DARK MODE" : "☀ LIGHT MODE";
    themeButton.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    themeButton.setAttribute("aria-pressed", String(light));
    try {
        localStorage.setItem("ray-portfolio-theme", light ? "light" : "dark");
    } catch (error) {
        // The toggle still works even if saving the preference is blocked.
    }
}

setTheme(savedTheme);
themeButton.addEventListener("click", () => {
    setTheme(document.body.classList.contains("theme-light") ? "dark" : "light");
});

// A full-page STOP screen appears after 10 clicks on either logo.
// Clicking the header and footer logos counts toward the SAME total.
const stopOverlay = document.createElement("div");
stopOverlay.id = "stop-overlay";
stopOverlay.className = "stop-overlay";
stopOverlay.hidden = true;
stopOverlay.setAttribute("role", "dialog");
stopOverlay.setAttribute("aria-modal", "true");
stopOverlay.setAttribute("aria-labelledby", "stop-heading");
stopOverlay.innerHTML = `
    <div class="stop-content">
        <h2 id="stop-heading">STOP.</h2>
        <button type="button" class="stop-return">RETURN TO PAGE</button>
    </div>
`;
document.body.appendChild(stopOverlay);

const returnButton = stopOverlay.querySelector(".stop-return");
let logoClicks = 0;
let lastClickedLogo = null;

function showStopScreen() {
    stopOverlay.hidden = false;
    document.body.classList.add("stop-mode");
    returnButton.focus();
}

function hideStopScreen() {
    stopOverlay.hidden = true;
    document.body.classList.remove("stop-mode");
    logoClicks = 0;
    if (lastClickedLogo) lastClickedLogo.focus();
}

// Prevent the original home links from reloading the page before click 10.
const logos = document.querySelectorAll(".site-header .brand, .footer .brand-logo");
logos.forEach((logo) => {
    logo.setAttribute("title", "Click 10 times for a secret");
    logo.addEventListener("click", (event) => {
        event.preventDefault();
        lastClickedLogo = logo;
        logoClicks += 1;

        // Restart a tiny wiggle on each click for a bit of feedback.
        logo.classList.remove("logo-tapped");
        void logo.offsetWidth;
        logo.classList.add("logo-tapped");

        if (logoClicks >= 10) showStopScreen();
    });
    logo.addEventListener("animationend", () => logo.classList.remove("logo-tapped"));
});

returnButton.addEventListener("click", hideStopScreen);
