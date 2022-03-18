export const save = (id, data) => {
    localStorage.setItem(id, JSON.stringify(data));
}

export const load = (id) => {
    return JSON.parse(localStorage.getItem(id))
}

export const forget = (id) => {
    localStorage.removeItem(id)
}