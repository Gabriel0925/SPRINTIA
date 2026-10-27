function gererTabsOnglets(idElement) {
    const tabsOngletsSelectionner = document.querySelector("div.tabs-onglets.selected")
    if (tabsOngletsSelectionner) {
        tabsOngletsSelectionner.classList.remove("selected")
    }

    const newSelected = document.getElementById(idElement)
    if (newSelected) {
        newSelected.classList.add("selected")
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const tabsOngletsRemotivation = document.getElementById("tabs-onglets-remotivation")
    if (tabsOngletsRemotivation) {
        tabsOngletsRemotivation.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-remotivation")
        })
    }

    const tabsOngletsMental = document.getElementById("tabs-onglets-mental")
    if (tabsOngletsMental) {
        tabsOngletsMental.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-mental")
        })
    }

    const tabsOngletsConfiance = document.getElementById("tabs-onglets-confiance")
    if (tabsOngletsConfiance) {
        tabsOngletsConfiance.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-confiance")
        })
    }
})