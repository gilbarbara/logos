var _    = require('lodash'),
    math = require('./Math');

/**
 * Colors
 * @class
 * @classdesc RGB/HSL Algorithms adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 * @version 1.0
 */
export default class Colors {
    /**
     * @constructs Colors
     * @param {string} color
     * @returns {Colors}
     */
    constructor (color) {
        this.hex = color.charAt(0) === '#' ? color : '#' + color;

        if (color != null) {
            this.rgb = this.hex2rgb(this.hex);
        }

        if (this.rgb != null) {
            this.hsl = this.rgb2hsl(this.rgb);
        }

        return this;
    }

    /**
     * Convert a hex string to RGB object
     * @instance
     * @param {string} color
     * @returns {object} {r: Number, g: Number, b: Number}
     */
    hex2rgb (color = this.hex) {
        if (color.charAt(0) === '#') {
            color = color.substr(1);
        }

        return {
            r: parseInt(String(color.charAt(0)) + color.charAt(1), 16),
            g: parseInt(String(color.charAt(2)) + color.charAt(3), 16),
            b: parseInt(String(color.charAt(4)) + color.charAt(5), 16)
        };
    }

    /**
     * Convert a RGB object to HSL
     * @instance
     * @param {object} rgb
     * @returns {object} {h: number, s: number, l: number}
     */
    rgb2hsl (rgb = this.rgb) {
        var r, g, b, h, s, l, d, max, min, _ref;
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
     * @param {object} rgb
     * @returns {string} #ffffff
     */
    rgb2hex (rgb = this.rgb) {
        return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

    /**
     * Convert a HSL object to RGB
     * @instance
     * @param {object} hsl
     * @returns {object} {r: number, g: number, b: number}
     */
    hsl2rgb (hsl = this.hsl) {
        var b, g, h, l, p, q, r, s, _ref;
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
            r = this.constructor.hue2rgb(p, q, h + 1 / 3);
            g = this.constructor.hue2rgb(p, q, h);
            b = this.constructor.hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * hsl2hex
     * @param {object} hsl
     * @returns {string}
     */
    hsl2hex (hsl = this.hsl) {
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * hue2rgb
     * @static
     * @param {number} p
     * @param {number} q
     * @param {number} t
     * @returns {*}
     */
    static hue2rgb (p, q, t) {
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
     * @instance
     * @param {object} attr
     * @returns {*}
     */
    mod (attr) {
        var hsl, out, rgb, type;
        if ((_.intersection(_.keys(attr), ['h', 's', 'l']).length > 0) &&
            (_.intersection(_.keys(attr), ['r', 'g', 'b']).length > 0)) {
            return null;
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
     * @static
     * @param {number} attr
     * @param {number} amount
     * @param {Array} limit
     * @param {string} direction
     * @returns {number}
     */
    static constrain (attr, amount, limit, direction) {
        var val  = math.expr(attr + direction + amount),
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
     * constrain_degrees
     * @static
     * @param {number} attr
     * @param {number} amount
     * @returns {number}
     */
    static constrain_degrees (attr, amount) {
        var val;
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
     * @member
     * @returns {number}
     */
    get red () {
        return this.rgb.r;
    }

    /**
     * Get Green
     * @member
     * @returns {number}
     */
    get green () {
        return this.rgb.g;
    }

    /**
     * Get Blue
     * @member
     * @returns {number}
     */
    get blue () {
        return this.rgb.b;
    }

    /**
     * Get Hue
     * @instance
     * @returns {number}
     */
    get hue () {
        return +this.hsl.h;
    }

    /**
     * Get Saturation
     * @member
     * @returns {number}
     */
    get saturation () {
        return +this.hsl.s;
    }

    /**
     * Get Lightness
     * @member
     * @returns {number}
     */
    get lightness () {
        return +this.hsl.l;
    }

    /**
     * Make the color lighter
     * @instance
     * @param {number} percentage
     * @returns {string}
     */
    lighten (percentage) {
        var hsl;
        hsl = this.mod({
            l: this.constructor.constrain(this.lightness, percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Make the color darker
     * @instance
     * @param {number} percentage
     * @returns {string}
     */
    darken (percentage) {
        var hsl;
        hsl = this.mod({
            l: this.constructor.constrain(this.lightness, percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Increase saturation
     * @instance
     * @param {number} percentage
     * @returns {string}
     */
    saturate (percentage) {
        var hsl;
        hsl = this.mod({
            s: this.constructor.constrain(this.saturation, percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Descrease saturation
     * @instance
     * @param {number} percentage
     * @returns {string}
     */
    desaturate (percentage) {
        var hsl;
        hsl = this.mod({
            s: this.constructor.constrain(this.saturation, percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    /**
     * Adjust the color hue
     * @instance
     * @param {number} degrees
     * @returns {string}
     */
    adjust_hue (degrees) {
        var hsl = this.mod({
            h: this.constructor.constrain_degrees(this.hue, degrees)
        });

        return this.rgb2hex(this.hsl2rgb(hsl));
    }
}

