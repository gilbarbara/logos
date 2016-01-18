class ScaleLog {
  constructor(options) {
    const newOptions = options || {};
    this.minSize = newOptions.minSize || 1.2;
    this.maxSize = newOptions.maxSize || 5;
    this.unit = newOptions.unit || '';
    this.min = (newOptions.min || 1);
    this.max = (newOptions.max || 50);

    this.scale = (this.max - this.min) / (this.maxSize - this.minSize);
  }

  value(qty) {
    return (qty === this.min ? this.minSize : (qty / this.max) * (this.maxSize - this.minSize) + this.minSize).toFixed(2) + this.unit;
    // Math.exp((position - this.minSize) * this.scale + this.min);
  }
}

// Usage: new LogSlider({  min: 10, max: 100 });

export default ScaleLog;
