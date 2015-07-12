class ScaleLog {
    constructor (options) {
        options = options || {};
        this.fontMin = options.fontMin || 1.2;
        this.fontMax = options.fontMax || 5;
        this.unit = options.unit || 'rem';
        this.min = (options.min || 1);
        this.max = (options.max || 50);

        this.scale = (this.max - this.min) / (this.fontMax - this.fontMin);
    }

    value (qty) {
        return (qty === this.min ? this.fontMin : (qty / this.max) * (this.fontMax - this.fontMin) + this.fontMin).toFixed(2) + this.unit;
        //Math.exp((position - this.fontMin) * this.scale + this.min);
    }
}

// Usage: new LogSlider({  min: 10, max: 100 });

module.exports = ScaleLog;
