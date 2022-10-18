const home = document.getElementById("home"),
    links = document.getElementById("links"),
    projects = document.getElementById("projects"),
    about = document.getElementById("about"),
    contact = document.getElementById("contact"),

    aLinks = home.querySelector(".top a"),
    aProjects = home.querySelector(".bottom a"),
    aAbout = home.querySelector(".left a"),
    aContact = home.querySelector(".right a"),

    homeLinks = links.querySelector(".home a"),
    homeProjects = projects.querySelector(".home a"),
    homeAbout = about.querySelector(".home a"),
    homeContact = contact.querySelector(".home a")

var lastSlide = "null"
document.querySelectorAll("section nav a").forEach((ele) => {
    ele.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()
        home.classList.remove(lastSlide)
        lastSlide = `slide-${ele.dataset.slide}`
        home.classList.add(lastSlide)
    })
})

window.addEventListener("keydown", function (e) {
    switch (lastSlide) {
        case "slide-down":
            if (e.key == "ArrowDown")
                homeLinks.click()
            break;
        case "slide-up":
            if (e.key == "ArrowUp")
                homeProjects.click()
            break;
        case "slide-right":
            if (e.key == "ArrowRight")
                homeAbout.click()
            break;
        case "slide-left":
            if (e.key == "ArrowLeft")
                homeContact.click()
            break;

        default:
            switch (e.key) {
                case "ArrowUp":
                    aLinks.click()
                    break;
                case "ArrowDown":
                    aProjects.click()
                    break;
                case "ArrowLeft":
                    aAbout.click()
                    break;
                case "ArrowRight":
                    aContact.click()
                    break;
            }
            break;
    }
})

const reposGET = await fetch('https://api.github.com/users/spitaa/repos').then((response) => response.json())

const repos = {}

reposGET.forEach(async (repo) => {
    repos[repo.name] = { langs: [] }
    const langs = await fetch(repo.languages_url).then((response) => response.json())

    for (const [lang, rows] of Object.entries(langs)) {
        repos[repo.name].langs.push([lang, rows])
    }
})

console.log(repos);