var Storage = {
    getItem: function (name) {
        return JSON.parse(localStorage.getItem(name));
    },

    setItem: function (name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    },

    removeItem: function (name) {
        localStorage.removeItem(name);
    },

    clearAll: function () {
        localStorage.clear();
    }
};

module.exports = Storage;
