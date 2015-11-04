let Storage = {
    getItem (name) {
        return JSON.parse(localStorage.getItem(name));
    },

    setItem (name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    },

    removeItem (name) {
        localStorage.removeItem(name);
    },

    clearAll () {
        localStorage.clear();
    }
};

module.exports = Storage;
