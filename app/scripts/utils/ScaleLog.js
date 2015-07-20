class ScaleLog {
    constructor (options) {
        options = options || {};
        this.minSize = options.minSize || 1.2;
        this.maxSize = options.maxSize || 5;
        this.unit = options.unit || '';
        this.min = (options.min || 1);
        this.max = (options.max || 50);

        this.scale = (this.max - this.min) / (this.maxSize - this.minSize);
    }

    value (qty) {
        return (qty === this.min ? this.minSize : (qty / this.max) * (this.maxSize - this.minSize) + this.minSize).toFixed(2) + this.unit;
        //Math.exp((position - this.minSize) * this.scale + this.min);
    }
}

// Usage: new LogSlider({  min: 10, max: 100 });

module.exports = ScaleLog;
