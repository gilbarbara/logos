import _ from 'lodash';
import math from './Math';

/**
 * Colors
 * @class
 * @version 1.0
 */
class Colors {
    /**
     * @constructs Colors
     * @param {String|Array|Object} color
     */
    constructor (color = '#ff0044') {
        this.setColor(color);
    }

    /**
     * Change the color
     * @param {String|Array|Object} color
     */
    setColor (color) {
        if (!color) {
            throw new Error('Not a valid color');
        }

        if (color instanceof Array) {
            this.rgb = {
                r: color[0],
                g: color[1],
                b: color[2]
            };
            this.hex = this.rgb2hex();
            this.hsl = this.rgb2hsl(this.rgb);
        }
        else if (color.constructor === {}.constructor) {
            if (color.h) {
                this.hsl = color;
                this.rgb = this.hsl2rgb();
            }
            else if (color.r) {
                this.rgb = color;
                this.hsl = this.rgb2hsl();
            }

            this.hex = this.hsl2hex();
        }
        else if (typeof color === 'string') {
            this.hex = this.parseHex(color);
            this.rgb = this.hex2rgb();
            this.hsl = this.rgb2hsl();
        }
    }

    /**
     * Parse HEX color
     * @param {String} hex
     *
     * @returns {String}
     */
    parseHex (hex) {
        let color  = hex.replace('#', ''),
            newHex = '';

        if (color.length === 3) {
            color.split('').forEach(d => {
                newHex += d + d;
            });
        }
        else {
            newHex = color;
        }

        newHex = '#' + newHex;

        if (!this.validHex(newHex)) {
            throw new Error('Not a valid color');
        }

        return newHex;
    }

    /**
     * Validate HEX color
     * @param {String} hex
     *
     * @returns {Boolean}
     */
    validHex (hex) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
    }

    /**
     * Convert a hex string to RGB object
     * @param {String} hex
     * @returns {Object} {r: Number, g: Number, b: Number}
     */
    hex2rgb (hex = this.hex) {
        hex = this.parseHex(hex);
        if (hex.charAt(0) === '#') {
            hex = hex.substr(1);
        }

        return {
            r: parseInt(String(hex.charAt(0)) + hex.charAt(1), 16),
            g: parseInt(String(hex.charAt(2)) + hex.charAt(3), 16),
            b: parseInt(String(hex.charAt(4)) + hex.charAt(5), 16)
        };
    }

    /**
     * Convert a hex string to HSL object
     * @param {String} hex
     * @returns {Object} {h: Number, s: Number, l: Number}
     */
    hex2hsl (hex = this.hex) {
        hex = this.parseHex(hex);
        if (hex.charAt(0) === '#') {
            hex = hex.substr(1);
        }

        return this.rgb2hsl({
            r: parseInt(String(hex.charAt(0)) + hex.charAt(1), 16),
            g: parseInt(String(hex.charAt(2)) + hex.charAt(3), 16),
            b: parseInt(String(hex.charAt(4)) + hex.charAt(5), 16)
        });
    }

    /**
     * Convert a RGB object to HSL
     * @param {Object} rgb
     * @returns {Object} {h: Number, s: Number, l: Number}
     */
    rgb2hsl (rgb = this.rgb) {
        let r, g, b, h, s, l, d, max, min, _ref;
        _ref = [rgb.r, rgb.g, rgb.b];
        r = _ref[0];
        g = _ref[1];
        b = _ref[2];

        r /= 255;
        g /= 255;
        b /= 255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        d = max - min;
        h = (function () {
            switch (max) {
                case min:
                    return 0;
                case r:
                    return 60 * (g - b) / d;
                case g:
                    return 60 * (b - r) / d + 120;
                case b:
                    return 60 * (r - g) / d + 240;
                default:
                    break;
            }
        }());
        if (h < 0) {
            h = 360 + h;
        }
        l = (max + min) / 2.0;
        s = max === min ? 0 : l < 0.5 ? d / (2 * l) : d / (2 - 2 * l);
        return {
            h: Math.abs(+((h % 360).toFixed(5))),
            s: +((s * 100).toFixed(5)),
            l: +((l * 100).toFixed(5))
        };
    }

    /**
     * Convert a RGA object to hex
     * @public
     * @param {Object} rgb
     * @returns {String} #ffffff
     */
    rgb2hex (rgb = this.rgb) {
        return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

    /**
     * Convert a HSL object to RGB
     * @param {Object} hsl
     * @returns {Object} {r: Number, g: Number, b: Number}
     */
    hsl2rgb (hsl = this.hsl) {
        let b, g, h, l, p, q, r, s, _ref;
        _ref = [parseFloat(hsl.h).toFixed(5) / 360,
                parseFloat(hsl.s).toFixed(5) / 100,
                parseFloat(hsl.l).toFixed(5) / 100];
        h = _ref[0];
        s = _ref[1];
        l = _ref[2];

        if (s === 0) {
            r = g = b = l;
        }
        else {
            q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1 / 3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * hsl2hex
     * @param {Object} hsl
     * @returns {String}
     */
    hsl2hex (hsl = this.hsl) {
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * hue2rgb
     * @method
     * @param {Number} p
     * @param {Number} q
     * @param {Number} t
     * @returns {*}
     */
    hue2rgb (p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
    }

    /**
     * mod
     * @param {Object} attr
     * @returns {*}
     */
    mod (attr) {
        let hsl, out, rgb, type;
        if ((_.intersection(_.keys(attr), ['h', 's', 'l']).length > 0) &&
            (_.intersection(_.keys(attr), ['r', 'g', 'b']).length > 0)) {
            throw new Error('Only use a single color model');
        }

        if (_.intersection(_.keys(attr), ['r', 'g', 'b']).length > 0) {
            type = 'rgb';
        }
        else if (_.intersection(_.keys(attr), ['h', 's', 'l']).length > 0) {
            type = 'hsl';
        }
        else {
            return null;
        }

        _.each(attr, function (val, key, list) {
            if (val === null) {
                return delete list[key];
            }
        });

        switch (type) {
            case 'rgb':
                rgb = _.pick(attr, 'r', 'g', 'b');
                if (_.isEmpty(rgb) === false) {
                    out = _.extend(_.clone(this.rgb), rgb);
                }
                else {
                    out = this.rgb;
                }
                break;
            case 'hsl':
                hsl = _.pick(attr, 'h', 's', 'l');
                if (_.isEmpty(hsl) === false) {
                    out = _.extend(_.clone(this.hsl), hsl);
                }
                else {
                    out = this.hsl;
                }
                break;
            default:
                break;
        }
        return out;
    }

    /**
     * constrain
     * @method
     * @param {Number} attr
     * @param {Number} amount
     * @param {Array} limit
     * @param {String} direction
     * @returns {Number}
     */
    constrain (attr, amount, limit, direction) {
        let val  = math.expr(attr + direction + amount),
            test = (limit[1] >= val && val >= limit[0]);

        if (!test) {
            if (val < limit[0]) {
                val = limit[0];
            }
            if (val > limit[1]) {
                val = limit[1];
            }
        }

        return Math.abs(val);
    }

    /**
     * @method
     * @param {Number} attr
     * @param {Number} amount
     * @returns {Number}
     */
    constrainDegrees (attr, amount) {
        let val;
        val = attr + amount;
        if (val > 360) {
            val -= 360;
        }
        if (val < 0) {
            val += 360;
        }
        return Math.abs(val);
    }

    /**
     * Get Red
     * @returns {Number}
     */
    get red () {
        return Number(this.rgb.r);
    }

    /**
     * Get Green
     * @returns {Number}
     */
    get green () {
        return Number(this.rgb.g);
    }

    /**
     * Get Blue
     * @returns {Number}
     */
    get blue () {
        return Number(this.rgb.b);
    }

    /**
     * Get Hue
     * @returns {Number}
     */
    get hue () {
        return Number(this.hsl.h);
    }

    /**
     * Set Hue
     * @param {Number} value
     */
    set hue (value) {
        let hsl = this.mod({
            h: value
        });
        this.hex = this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Get Saturation
     * @returns {Number}
     */
    get saturation () {
        return Number(this.hsl.s);
    }

    /**
     * Get Lightness
     * @returns {Number}
     */
    get lightness () {
        return Number(this.hsl.l);
    }

    /**
     * Make the color lighter
     * @param {Number} percentage
     * @returns {String}
     */
    lighten (percentage) {
        let hsl;
        hsl = this.mod({
            l: this.constrain(this.lightness, percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Make the color darker
     * @param {Number} percentage
     * @returns {String}
     */
    darken (percentage) {
        let hsl;
        hsl = this.mod({
            l: this.constrain(this.lightness, percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Increase saturation
     * @param {Number} percentage
     * @returns {String}
     */
    saturate (percentage) {
        let hsl;
        hsl = this.mod({
            s: this.constrain(this.saturation, percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Descrease saturation
     * @param {Number} percentage
     * @returns {String}
     */
    desaturate (percentage) {
        let hsl;
        hsl = this.mod({
            s: this.constrain(this.saturation, percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Adjust the color hue
     * @param {Number} degrees
     * @returns {String}
     */
    adjustHue (degrees) {
        let hsl = this.mod({
            h: this.constrainDegrees(this.hue, +degrees)
        });

        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Alter color values
     * @param {Object} opts
     * @param {Boolean} hex
     * @returns {String}
     */
    remix (opts, hex = false) {
        let model = {},
            mod;

        Object.keys(opts).forEach(o => {
            model[o] = opts[o];
        });

        mod = this.mod(model);

        return hex ? (mod.r ? this.rgb2hex(mod) : this.hsl2hex(mod)) : mod;
    }

    /**
     * Generate a color scheme
     * @param {Array} degrees - ex: [0, 180] or [0, 120, 240]
     * @returns {Array} [Object]
     */
    schemeFromDegrees (degrees) {
        let newColors = [];
        for (let i = 0, j = degrees.length; i < j; i++) {
            let col = Object.assign({}, this.hsl);
            col.h = (col.h + degrees[i]) % 360;
            newColors.push(col);
        }
        return newColors;
    }

    /**
     * Generate a random color
     * @returns {Object} {hex: String, rgb: Object, hsl: Object}
     */
    random () {
        let hsl = {
            h: Math.floor(Math.random() * 360) + 1,
            s: Math.floor(Math.random() * 90) + 10,
            l: Math.floor(Math.random() * 80) + 10
        };

        return {
            hex: this.hsl2hex(hsl),
            rgb: this.hsl2rgb(hsl),
            hsl
        };
    }
}

export default Colors;
