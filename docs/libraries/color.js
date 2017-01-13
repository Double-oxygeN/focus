'use strict';

/*
 * Main class
 */

function Color(args) {
  const args_type = Object.prototype.toString.call(args),
    color_code_checker = /^#[0-9a-fA-F]+$/,
    rgb_checker = /^(rgb|RGB)\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*\)$/,
    hsv_checker = /^(hs(v|b)|HS(V|B))\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?%?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?%?\s*\)$/,
    hsl_checker = /^(hsl|HSL)\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?%?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?%?\s*\)$/,
    xyz_checker = /^(xyz|XYZ)\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*\)$/,
    xy_checker = /^xy\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*\)$/,
    Yxy_checker = /^Yxy\(\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*,\s*([1-9][0-9]*|0)(\.[0-9]+)?\s*\)$/,
    numbers_checker = /([1-9][0-9]*|0)(\.[0-9]+)?/g;
  let numbers = [],
    rgb, hsv, hsl, xyz;

  switch (args_type) {
  case '[object Array]':
    if (args.length === 2) {
      // Yxy
      if (args[1] !== 0) {
        xyz = XYZColor(args[0] / args[1], 1.0, (1 - args[0]) / args[1] - 1);
      } else {
        xyz = XYZColor(0, 0, 0);
      }
      rgb = XYZtoRGB(xyz);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
    } else if (args.length === 3) {
      // RGB
      rgb = RGBColor(args[0], args[1], args[2]);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
      xyz = RGBtoXYZ(rgb);
    }
    break;
  case '[object String]':
    if (color_code_checker.test(args)) {
      let fixed_args = args + "00";
      if (args.length <= 4) {
        numbers = [1, 2, 3].map(i => parseInt(fixed_args.charAt(i), 16) * 0x11);
      } else {
        numbers = [1, 3, 5].map(i => parseInt(fixed_args.substr(i, 2), 16));
      }
      rgb = RGBColor(numbers[0], numbers[1], numbers[2]);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
      xyz = RGBtoXYZ(rgb);
    } else if (rgb_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      rgb = RGBColor(numbers[0], numbers[1], numbers[2]);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
      xyz = RGBtoXYZ(rgb);
    } else if (hsv_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      hsv = HSVColor(numbers[0], numbers[1], numbers[2]);
      rgb = HSVtoRGB(hsv);
      hsl = RGBtoHSL(rgb);
      xyz = RGBtoXYZ(rgb);
    } else if (hsl_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      hsl = HSLColor(numbers[0], numbers[1], numbers[2]);
      rgb = HSLtoRGB(hsl);
      hsv = RGBtoHSV(rgb);
      xyz = RGBtoXYZ(rgb);
    } else if (xyz_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      xyz = XYZColor(numbers[0], numbers[1], numbers[2]);
      rgb = XYZtoRGB(xyz);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
    } else if (xy_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      if (numbers[1] !== 0) {
        xyz = XYZColor(numbers[0] / numbers[1], 1.0, (1 - numbers[0]) / numbers[1] - 1);
      } else {
        xyz = XYZColor(0, 0, 0);
      }
      rgb = XYZtoRGB(xyz);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
    } else if (Yxy_checker.test(args)) {
      numbers = args.match(numbers_checker).map(i => parseFloat(i));
      if (numbers[2] !== 0) {
        xyz = XYZColor(numbers[0] * numbers[1] / numbers[2], numbers[0], (1 - numbers[1] - numbers[2]) * numbers[0] / numbers[2]);
      } else {
        xyz = XYZColor(0, 0, 0);
      }
      rgb = XYZtoRGB(xyz);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
    } else {
      let g = document.createElement('canvas').getContext('2d');
      g.fillStyle = args;
      numbers = [1, 3, 5].map(i => parseInt(g.fillStyle.substr(i, 2), 16));
      rgb = RGBColor(numbers[0], numbers[1], numbers[2]);
      hsv = RGBtoHSV(rgb);
      hsl = RGBtoHSL(rgb);
      xyz = RGBtoXYZ(rgb);
    }
    break;
  default:
    rgb = RGBColor(0, 0, 0);
    hsv = HSVColor(0, 0, 0);
    hsl = HSLColor(0, 0, 0);
    xyz = XYZColor(0, 0, 0);
  }

  this.rgb = rgb;
  this.hsv = hsv;
  this.hsl = hsl;
  this.xyz = xyz;
  this.naturality = calcNaturality(hsv);
  this.toString = function () {
    return this.xyz.toString();
  };
  this.equals = function (another) {
    return this.toString() === another.toString();
  };
  this.rotate = function (degree) {
    return new Color(this.hsl.rotate(degree).toString());
  };
  this.add = function (another) {
    return new Color(this.xyz.add(another.xyz).toString());
  };
  this.subtract = function (another) {
    return new Color(this.xyz.subtract(another.xyz).toString());
  };
  this.multiply_rgb = function (another) {
    return new Color(this.rgb.var_mix(another.rgb, (x, y) => x * y / 255).toString());
  };
  this.multiply_xyz = function (another) {
    return new Color(this.xyz.var_mix(another.xyz, (x, y) => x * y).toString());
  };
  this.geo_mean_rgb = function (another) {
    return new Color(this.rgb.var_mix(another.rgb, (x, y) => 255 * Math.sqrt((x / 255) * (y / 255))).toString());
  };
  this.geo_mean_xyz = function (another) {
    return new Color(this.xyz.var_mix(another.xyz, (x, y) => Math.sqrt(x * y)).toString());
  };
  this.harm_mean_rgb = function (another) {
    return new Color(this.rgb.var_mix(another.rgb, (x, y) => 255 / (255 / x + 255 / y)).toString());
  };
  this.harm_mean_xyz = function (another) {
    return new Color(this.xyz.var_mix(another.xyz, (x, y) => 1 / (1 / x + 1 / y)).toString());
  };
  this.einstein_rgb = function (another) {
    return new Color(this.rgb.var_mix(another.rgb, (x, y) => (x + y) * 255 * 255 / (255 * 255 + x * y)).toString());
  };
  this.amplify = function (rate) {
    return new Color(this.rgb.amplify(rate).toString());
  };
  this.neutralColor = function (another, percentage) {
    if (percentage === 0) {
      return this;
    } else if (percentage === 100) {
      return another;
    }
    let this_hsl = this.hsl,
      another_hsl = another.hsl,
      h_diff = Math.abs(another_hsl.h - this_hsl.h),
      new_h = this_hsl.h + (((h_diff < 180) ? 0 : ((this_hsl.h < another_hsl.h) ? -360 : 360)) + another_hsl.h - this_hsl.h) * percentage / 100,
      new_s = this_hsl.s + (another_hsl.s - this_hsl.s) * percentage / 100,
      new_l = this_hsl.l + (another_hsl.l - this_hsl.l) * percentage / 100;

    return new Color((new HSLColor(new_h, new_s, new_l)).toString());
  };
}

function Eye(corn, rod) {
  this.corn = corn;
  this.rod = rod;
  this.color_id = Math.floor(Math.random() * 1024);
  this.colors = [];
  this.iris = 1;
  this.regColor = function (color, painter) {
    this.colors.push({
      id: this.color_id,
      color: color,
      painter: painter
    });
    this.iris = this.colors.map(c => c.color.rgb.maxValue).sort((a, b) => b - a)[0];
    this.color_id++;
    return this.color_id - 1;
  };
  this.chgColor = function (id, new_color) {
    // idの色を変更
    this.colors = this.colors.map(c => {
      if (c.id === id) {
        return {
          id: c.id,
          color: new_color,
          painter: c.painter
        };
      } else {
        return c;
      }
    });
    this.iris = this.colors.map(c => c.color.rgb.maxValue).sort((a, b) => b - a)[0];
  };
  this.delColor = function (id) {
    // idの色とその描画を削除
    this.colors = this.colors.filter(c => {
      if (c.id !== id) return c;
    });
    this.iris = this.colors.map(c => c.color.rgb.maxValue).sort((a, b) => b - a)[0];
  };
  this.sync = function () {
    // 色を画面に描画
    this.colors.forEach((c) => {
      c.painter(c.color.amplify(Math.min(1, 1 / this.iris)));
    });
  };
}

/*
 * Subclasses
 */

function RGBColor(r, g, b) {
  let red = Math.min(Math.round(r), 0xff),
    green = Math.min(Math.round(g), 0xff),
    blue = Math.min(Math.round(b), 0xff);
  return {
    r: r,
    g: g,
    b: b,
    maxValue: Math.max(r, Math.max(g, b)) / 0xff,
    toArray: function () {
      return [r, g, b];
    },
    toColorCode: function () {
      return "#" + ("0" + red.toString(16)).slice(-2) + ("0" + green.toString(16)).slice(-2) + ("0" + blue.toString(16)).slice(-2);
    },
    toString: function () {
      return "rgb(" + red.toString(10) + "," + green.toString(10) + "," + blue.toString(10) + ")";
    },
    amplify: function (rate) {
      return RGBColor(r * rate, g * rate, b * rate);
    },
    var_mix: function (another, f) {
      return RGBColor(f(this.r, another.r), f(this.g, another.g), f(this.b, another.b));
    }
  };
}

function HSVColor(h, s, v) {
  if (h < 0) return HSVColor(h + 360, s, v);
  else if (h >= 360) return HSVColor(h - 360, s, v);
  let hue = Math.round(h),
    saturation = Math.min(Math.round(s), 100),
    brightness = Math.min(Math.round(v), 100);
  return {
    h: h,
    s: s,
    v: v,
    b: v,
    toArray: function () {
      return [h, s, v];
    },
    toString: function () {
      return "hsv(" + hue.toString(10) + "," + saturation.toString(10) + "%," + brightness.toString(10) + "%)";
    },
    rotate: function (degree) {
      return HSVColor(h + degree, s, v);
    },
    setSV: function (new_s, new_v) {
      return HSVColor(h, new_s, new_v);
    }
  };
}

function HSLColor(h, s, l) {
  if (h < 0) return HSLColor(h + 360, s, l);
  else if (h >= 360) return HSLColor(h - 360, s, l);
  let hue = Math.round(h),
    saturation = Math.min(Math.round(s), 100),
    lightness = Math.min(Math.round(l), 100);
  return {
    h: h,
    s: s,
    l: l,
    toArray: function () {
      return [h, s, l];
    },
    toString: function () {
      return "hsl(" + hue.toString(10) + "," + saturation.toString(10) + "%," + lightness.toString(10) + "%)";
    },
    rotate: function (degree) {
      return HSLColor(h + degree, s, l);
    },
    setSL: function (new_s, new_l) {
      return HSLColor(h, new_s, new_l);
    }
  };
}

function XYZColor(X, Y, Z) {
  let sum = X + Y + Z,
    x = (sum !== 0) ? X / sum : 1 / 3,
    y = (sum !== 0) ? Y / sum : 1 / 3,
    z = (sum !== 0) ? Z / sum : 1 / 3;
  return {
    X: X,
    Y: Y,
    Z: Z,
    x: x,
    y: y,
    z: z,
    toArray: function () {
      return [X, Y, Z];
    },
    toString: function () {
      return "XYZ(" + X.toString(10) + "," + Y.toString(10) + "," + Z.toString(10) + ")";
    },
    toYxyString: function () {
      return "Yxy(" + Y.toString(10) + "," + x.toString(10) + "," + y.toString(10) + ")";
    },
    toPosition: function () {
      return {
        Y: Y,
        x: x,
        y: y
      };
    },
    add: function (another) {
      return XYZColor(this.X + another.X, this.Y + another.Y, this.Z + another.Z);
    },
    subtract: function (another) {
      return XYZColor((this.X + another.X) / 2, (this.Y + another.Y) / 2, (this.Z + another.Z) / 2);
    },
    var_mix: function (another, f) {
      return XYZColor(f(this.X, another.X), f(this.Y, another.Y), f(this.Z, another.Z));
    },
    amplify: function (rate) {
      return XYZColor(this.X * rate, this.Y * rate, this.Z * rate);
    }
  };
}

/*
 * Converters
 */

function RGBtoHSV(rgb) {
  let red = rgb.r,
    green = rgb.g,
    blue = rgb.b,
    max = Math.max(red, Math.max(green, blue)),
    min = Math.min(red, Math.min(green, blue)),
    sat = (max - min) * 100 / max,
    val = max * 100 / 0xff;

  if (red === green && green === blue) {
    return HSVColor(0, 0, val);
  } else if (red === max) {
    return HSVColor(60 * (green - blue) / (max - min), sat, val);
  } else if (green === max) {
    return HSVColor(60 * (blue - red) / (max - min) + 120, sat, val);
  } else {
    return HSVColor(60 * (red - green) / (max - min) + 240, sat, val);
  }
}

function HSVtoRGB(hsv) {
  let hue = hsv.h,
    sat = hsv.s,
    val = hsv.v,
    max = val * 0xff / 100,
    min = max - sat * max / 100;

  if (hue < 60) {
    return RGBColor(max, hue * (max - min) / 60 + min, min);
  } else if (hue < 120) {
    return RGBColor((120 - hue) * (max - min) / 60 + min, max, min);
  } else if (hue < 180) {
    return RGBColor(min, max, (hue - 120) * (max - min) / 60 + min);
  } else if (hue < 240) {
    return RGBColor(min, (240 - hue) * (max - min) / 60 + min, max);
  } else if (hue < 300) {
    return RGBColor((hue - 240) * (max - min) / 60 + min, min, max);
  } else {
    return RGBColor(max, min, (360 - hue) * (max - min) / 60 + min);
  }
}

function RGBtoHSL(rgb) {
  let red = rgb.r,
    green = rgb.g,
    blue = rgb.b,
    max = Math.max(red, Math.max(green, blue)),
    min = Math.min(red, Math.min(green, blue)),
    lgt = (max + min) * 50 / 0xff,
    sat = (max === min) ? 0 : ((lgt < 50) ? (max - min) * 100 / (max + min) : (max - min) * 100 / (2 * 0xff - max - min));

  if (red === green && green === blue) {
    return HSLColor(0, sat, lgt);
  } else if (red === max) {
    return HSLColor(60 * (green - blue) / (max - min), sat, lgt);
  } else if (green === max) {
    return HSLColor(60 * (blue - red) / (max - min) + 120, sat, lgt);
  } else {
    return HSLColor(60 * (red - green) / (max - min) + 240, sat, lgt);
  }
}

function HSLtoRGB(hsl) {
  let hue = hsl.h,
    sat = hsl.s,
    lgt = hsl.l,
    max = (lgt < 50) ? (lgt + lgt * sat / 100) * 0xff / 100 : (lgt + (100 - lgt) * sat / 100) * 0xff / 100,
    min = (lgt < 50) ? (lgt - lgt * sat / 100) * 0xff / 100 : (lgt - (100 - lgt) * sat / 100) * 0xff / 100;

  if (hue < 60) {
    return RGBColor(max, hue * (max - min) / 60 + min, min);
  } else if (hue < 120) {
    return RGBColor((120 - hue) * (max - min) / 60 + min, max, min);
  } else if (hue < 180) {
    return RGBColor(min, max, (hue - 120) * (max - min) / 60 + min);
  } else if (hue < 240) {
    return RGBColor(min, (240 - hue) * (max - min) / 60 + min, max);
  } else if (hue < 300) {
    return RGBColor((hue - 240) * (max - min) / 60 + min, min, max);
  } else {
    return RGBColor(max, min, (360 - hue) * (max - min) / 60 + min);
  }
}

function RGBtoXYZ(rgb) {
  let red = rgb.r / 0xff,
    green = rgb.g / 0xff,
    blue = rgb.b / 0xff;
  return XYZColor(0.398 * red + 0.416 * green + 0.150 * blue,
    0.235 * red + 0.667 * green + 0.098 * blue,
    0.038 * red + 0.092 * green + 0.695 * blue);
}

function XYZtoRGB(xyz) {
  let x = xyz.X,
    y = xyz.Y,
    z = xyz.Z,
    red = (3.98876 * x - 2.41599 * y - 0.520211 * z) * 0xff,
    green = (-1.40053 * x + 2.37729 * y - 0.0329421 * z) * 0xff,
    blue = (-0.0326964 * x - 0.182594 * y + 1.47165 * z) * 0xff;
  return RGBColor(Math.max(red, 0), Math.max(green, 0), Math.max(blue, 0));
}

/*
 * Utilities
 */

function calcNaturality(hsv) {
  let hue = hsv.h,
    saturation = hsv.s,
    brightness = hsv.v,
    hue_fixed = ((hue < 60) ? (hue + 30) : ((hue < 240) ? (150 - hue) : (hue - 330))) / 90,
    nat_h = (hue_fixed === 0) ? 30 : ((brightness - 50) / hue_fixed);

  return [nat_h, saturation + nat_h * Math.abs(hue_fixed)];
}
