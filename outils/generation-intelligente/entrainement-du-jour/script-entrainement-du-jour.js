function selectItem(elt, nameComponent) {
    document.querySelector(nameComponent+".selected").classList.remove("selected")
    elt.classList.add("selected")
}