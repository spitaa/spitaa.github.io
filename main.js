const home = document.getElementById("home")

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