document.addEventListener("DOMContentLoaded", () => {
    const rootStyle = getComputedStyle(document.documentElement)

    const colorRed = rootStyle.getPropertyValue("--COLOR_RED")
    const colorRedHover = rootStyle.getPropertyValue("--COLOR_RED_HOVER")
    const colorRedActive = rootStyle.getPropertyValue("--COLOR_RED_ACTIVE")
    const colorRedText = rootStyle.getPropertyValue("--COLOR_RED_TEXT")

    const rootCSS = document.documentElement.style
    rootCSS.setProperty("--COLOR_ACCENT", colorRed)
    rootCSS.setProperty("--COLOR_ACCENT_HOVER", colorRedHover)
    rootCSS.setProperty("--COLOR_ACCENT_ACTIVE", colorRedActive)
    rootCSS.setProperty("--COLOR_ACCENT_TEXT", colorRedText)
})