var _ = require('lodash');

/*
 Color
 =====

 SassMe - an Arc90 Lab Project

 The MIT License (MIT)
 Copyright © 2012 Arc90 | http://arc90.com

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the “Software”), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Authors:
 --------

 Jim Nielsen
 Darren Newton
 Robert Petro
 Matt Quintanilla
 Jesse Reiner

 Color algorithms:
 -----------------
 RGB/HSL Algorithms adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-
 rgb-to-hsv-color-model-conversion-algorithms-in-javascript

 Syntactically Awesome Stylesheets:
 ----------------------------------
 The overall structure of the SASS conversions is based on the Ruby
 SASS project:
 https://github.com/nex3/sass/blob/stable/lib/sass/script/color.rb
 Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
 */

class Colors {
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

    hex2rgb (color) {
        if (color.charAt(0) === '#') {
            color = color.substr(1);
        }

        return {
            r: parseInt(color.charAt(0) + '' + color.charAt(1), 16),
            g: parseInt(color.charAt(2) + '' + color.charAt(3), 16),
            b: parseInt(color.charAt(4) + '' + color.charAt(5), 16)
        };
    }

    rgb2hsl (rgb) {
        var b, d, g, h, hsl, l, max, min, r, s, _ref;
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

    rgb2hex (rgb) {
        return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }

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

    hsl2rgb (hsl) {
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

    hsl2hex (hsl) {
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

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
        }
        return out;
    }

    static constrain (attr, amount, limit, direction) {
        var math, test, val;
        math = [attr, direction, amount].join(' ');
        val = eval(math);
        test = (limit[1] >= val && val >= limit[0]);
        if (test) {
            val;

        }
        else {
            if (val < limit[0]) {
                val = limit[0];
            }
            if (val > limit[1]) {
                val = limit[1];
            }
        }
        return Math.abs(val);
    }

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

    red () {
        return this.rgb.r;
    }

    green () {
        return this.rgb.g;
    }

    blue () {
        return this.rgb.b;
    }

    hue () {
        return +this.hsl.h;
    }

    saturation () {
        return +this.hsl.s;
    }

    lightness () {
        return +this.hsl.l;
    }

    lighten (percentage) {
        var hsl;
        hsl = this.mod({
            l: this.constructor.constrain(this.lightness(), percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    darken (percentage) {
        var hsl;
        hsl = this.mod({
            l: this.constructor.constrain(this.lightness(), percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    saturate (percentage) {
        var hsl;
        hsl = this.mod({
            s: this.constructor.constrain(this.saturation(), percentage, [0, 100], '+')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    desaturate (percentage) {
        var hsl;
        hsl = this.mod({
            s: this.constructor.constrain(this.saturation(), percentage, [0, 100], '-')
        });
        return this.rgb2hex(this.hsl2rgb(hsl));
    }

    adjust_hue (degrees) {
        var hsl = this.mod({
            h: this.constructor.constrain_degrees(this.hue(), degrees)
        });

        return this.rgb2hex(this.hsl2rgb(hsl));
    }
}

module.exports = Colors;
