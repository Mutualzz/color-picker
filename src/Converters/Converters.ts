import {
    handleColor,
    type HslaColor,
    type HslColor,
    type HsvaColor,
    type HsvColor,
    type ObjectColor,
    type RgbaColor,
    type RgbColor,
    type XYColor,
} from "@mutualzz/ui-core";

const RGB_MAX = 255;
const HUE_MAX = 360;
const SV_MAX = 100;

/**
 * ```js
 * rgbaToHsva({ r: 255, g: 255, b: 255, a: 1 }) //=> { h: 0, s: 0, v: 100, a: 1 }
 * ```
 */
export const rgbaToHsva = ({ r, g, b, alpha }: RgbaColor): HsvaColor => {
    const max = Math.max(r, g, b);
    const delta = max - Math.min(r, g, b);

    // prettier-ignore
    const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

    return {
        h: 60 * (hh < 0 ? hh + 6 : hh),
        s: max ? (delta / max) * SV_MAX : 0,
        v: (max / RGB_MAX) * SV_MAX,
        alpha,
    };
};

export const hsvaToHslString = (hsva: HsvaColor): string => {
    const { h, s, l } = hsvaToHsla(hsva);
    // return `hsl(${h}, ${s}%, ${l}%)`;
    return `hsl(${h}, ${Math.round(s)}%, ${Math.round(l)}%)`;
};

export const hsvaToHsvString = ({ h, s, v }: HsvaColor): string => {
    return `hsv(${h}, ${s}%, ${v}%)`;
};

export const hsvaToHsvaString = ({ h, s, v, alpha }: HsvaColor): string => {
    return `hsva(${h}, ${s}%, ${v}%, ${alpha})`;
};

export const hsvaToHslaString = (hsva: HsvaColor): string => {
    const { h, s, l, alpha } = hsvaToHsla(hsva);
    return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
};

export const hslStringToHsla = (str: string): HslaColor => {
    const [h, s, l, alpha] = (str.match(/\d+/g) || []).map(Number);
    return { h, s, l, alpha };
};

export const hslaStringToHsva = (hslString: string): HsvaColor => {
    const matcher =
        /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
    const match = matcher.exec(hslString);

    if (!match) return { h: 0, s: 0, v: 0, alpha: 1 };

    return hslaToHsva({
        h: parseHue(match[1], match[2]),
        s: Number(match[3]),
        l: Number(match[4]),
        alpha:
            match[5] === undefined
                ? 1
                : Number(match[5]) / (match[6] ? 100 : 1),
    });
};

export const hslStringToHsva = hslaStringToHsva;

export const hslaToHsva = ({ h, s, l, alpha }: HslaColor): HsvaColor => {
    s *= (l < 50 ? l : SV_MAX - l) / SV_MAX;

    return {
        h: h,
        s: s > 0 ? ((2 * s) / (l + s)) * SV_MAX : 0,
        v: l + s,
        alpha,
    };
};

export const hsvaToHsla = ({ h, s, v, alpha }: HsvaColor): HslaColor => {
    const hh = ((200 - s) * v) / SV_MAX;

    return {
        h,
        s:
            hh > 0 && hh < 200
                ? ((s * v) / SV_MAX / (hh <= SV_MAX ? hh : 200 - hh)) * SV_MAX
                : 0,
        l: hh / 2,
        alpha,
    };
};

export const hsvaStringToHsva = (hsvString: string): HsvaColor => {
    const matcher =
        /hsva?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
    const match = matcher.exec(hsvString);

    if (!match) return { h: 0, s: 0, v: 0, alpha: 1 };

    return {
        h: parseHue(match[1], match[2]),
        s: Number(match[3]),
        v: Number(match[4]),
        alpha:
            match[5] === undefined
                ? 1
                : Number(match[5]) / (match[6] ? SV_MAX : 1),
    };
};

/**
 * Valid CSS <angle> units.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
const angleUnits: Record<string, number> = {
    grad: HUE_MAX / 400,
    turn: HUE_MAX,
    rad: HUE_MAX / (Math.PI * 2),
};

export const parseHue = (value: string, unit = "deg"): number => {
    return Number(value) * (angleUnits[unit] || 1);
};

export const hsvStringToHsva = hsvaStringToHsva;
export const rgbaStringToHsva = (rgbaString: string): HsvaColor => {
    const matcher =
        /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
    const match = matcher.exec(rgbaString);

    if (!match) return { h: 0, s: 0, v: 0, alpha: 1 };

    return rgbaToHsva({
        r: Number(match[1]) / (match[2] ? SV_MAX / RGB_MAX : 1),
        g: Number(match[3]) / (match[4] ? SV_MAX / RGB_MAX : 1),
        b: Number(match[5]) / (match[6] ? SV_MAX / RGB_MAX : 1),
        alpha:
            match[7] === undefined
                ? 1
                : Number(match[7]) / (match[8] ? SV_MAX : 1),
    });
};

export const rgbStringToHsva = rgbaStringToHsva;

/** Converts an RGBA color plus alpha transparency to hex */
export const rgbaToHex = ({ r, g, b }: RgbaColor): string => {
    return rgbToHex({ r, g, b });
};

export const rgbToHex = ({ r, g, b }: RgbColor): string => {
    const bin = (r << 16) | (g << 8) | b;
    return `#${((h) => new Array(7 - h.length).join("0") + h)(bin.toString(16))}`;
};

export const rgbaToHexa = ({ r, g, b, alpha }: RgbaColor): string => {
    const alphaVal =
        typeof alpha === "number" &&
        ((alpha * 255) | (1 << 8)).toString(16).slice(1);
    return `${rgbToHex({ r, g, b })}${alphaVal ? alphaVal : ""}`;
};

export const hexToHsva = (hex: string): HsvaColor => rgbaToHsva(hexToRgba(hex));
export const hexToRgba = (hex: string): RgbaColor => {
    const htemp = hex.replace("#", "");
    if (/^#?/.test(hex) && htemp.length === 3) {
        hex = `#${htemp.charAt(0)}${htemp.charAt(0)}${htemp.charAt(1)}${htemp.charAt(1)}${htemp.charAt(2)}${htemp.charAt(2)}`;
    }
    const reg = new RegExp(`[A-Za-z0-9]{2}`, "g");
    const [r, g, b = 0, a] = hex.match(reg)!.map((v) => parseInt(v, 16));
    return {
        r,
        g,
        b,
        alpha: (a ?? 255) / RGB_MAX,
    };
};

/**
 * Converts HSVA to RGBA. Based on formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 * @param color HSVA color as an array [0-360, 0-1, 0-1, 0-1]
 */
export const hsvaToRgba = ({ h, s, v, alpha }: HsvaColor): RgbaColor => {
    let _h = h / 60,
        _s = s / SV_MAX,
        _v = v / SV_MAX,
        hi = Math.floor(_h) % 6;

    let f = _h - Math.floor(_h),
        _p = RGB_MAX * _v * (1 - _s),
        _q = RGB_MAX * _v * (1 - _s * f),
        _t = RGB_MAX * _v * (1 - _s * (1 - f));
    _v *= RGB_MAX;
    const rgba = {} as RgbaColor;
    switch (hi) {
        case 0:
            rgba.r = _v;
            rgba.g = _t;
            rgba.b = _p;
            break;
        case 1:
            rgba.r = _q;
            rgba.g = _v;
            rgba.b = _p;
            break;
        case 2:
            rgba.r = _p;
            rgba.g = _v;
            rgba.b = _t;
            break;
        case 3:
            rgba.r = _p;
            rgba.g = _q;
            rgba.b = _v;
            break;
        case 4:
            rgba.r = _t;
            rgba.g = _p;
            rgba.b = _v;
            break;
        case 5:
            rgba.r = _v;
            rgba.g = _p;
            rgba.b = _q;
            break;
    }
    rgba.r = Math.round(rgba.r);
    rgba.g = Math.round(rgba.g);
    rgba.b = Math.round(rgba.b);
    return { ...rgba, alpha };
};

export const hsvaToRgbString = (hsva: HsvaColor): string => {
    const { r, g, b } = hsvaToRgba(hsva);
    return `rgb(${r}, ${g}, ${b})`;
};

export const hsvaToRgbaString = (hsva: HsvaColor): string => {
    const { r, g, b, alpha } = hsvaToRgba(hsva);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbaToRgb = ({ r, g, b }: RgbaColor): RgbColor => ({ r, g, b });
export const hslaToHsl = ({ h, s, l }: HslaColor): HslColor => ({ h, s, l });
export const hsvaToHex = (hsva: HsvaColor): string =>
    rgbToHex(hsvaToRgba(hsva));
export const hsvaToHexa = (hsva: HsvaColor): string =>
    rgbaToHexa(hsvaToRgba(hsva));
export const hsvaToHsv = ({ h, s, v }: HsvaColor): HsvColor => ({ h, s, v });
export const hexToXY = (hex: string): XYColor =>
    rgbToXY(rgbaToRgb(hexToRgba(hex)));
export const xyToHex = (xy: XYColor): string =>
    rgbToHex({
        ...xyToRgb(xy),
    });

/**
 * Converts XY to RGB. Based on formula from https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/
 * @param color XY color and brightness as an array [0-1, 0-1, 0-1]
 */
export const xyToRgb = ({ x, y, bri = 255 }: XYColor): RgbColor => {
    const red = x * 3.2406255 + y * -1.537208 + bri * -0.4986286;
    const green = x * -0.9689307 + y * 1.8757561 + bri * 0.0415175;
    const blue = x * 0.0557101 + y * -0.2040211 + bri * 1.0569959;

    const translate = function (color: number) {
        return color <= 0.0031308
            ? 12.92 * color
            : 1.055 * Math.pow(color, 1 / 2.4) - 0.055;
    };

    return {
        r: Math.round(255 * translate(red)),
        g: Math.round(255 * translate(green)),
        b: Math.round(255 * translate(blue)),
    };
};

/**
 * Converts RGB to XY. Based on formula from https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/
 * @param color RGB color as an array [0-255, 0-255, 0-255]
 */
export const rgbToXY = ({ r, g, b }: RgbColor): XYColor => {
    const translateColor = function (color: number) {
        return color <= 0.04045
            ? color / 12.92
            : Math.pow((color + 0.055) / 1.055, 2.4);
    };

    const red = translateColor(r / 255);
    const green = translateColor(g / 255);
    const blue = translateColor(b / 255);

    const xyz = {} as XYColor;
    xyz.x = red * 0.4124 + green * 0.3576 + blue * 0.1805;
    xyz.y = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    xyz.bri = red * 0.0193 + green * 0.1192 + blue * 0.9505;

    return xyz;
};

export const getContrastingColor = (str: string | HsvaColor) => {
    if (!str) {
        return "#ffffff";
    }
    const col = handleColor(str);
    const yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
};

export const equalColorObjects = (
    first: ObjectColor,
    second: ObjectColor,
): boolean => {
    if (first === second) return true;

    for (const prop in first) {
        // The following allows for a type-safe calling of this function (first & second have to be HSL, HSV, or RGB)
        // with type-unsafe iterating over object keys. TS does not allow this without an index (`[key: string]: number`)
        // on an object to define how iteration is normally done. To ensure extra keys are not allowed on our types,
        // we must cast our object to unknown (as RGB demands `r` be a key, while `Record<string, x>` does not care if
        // there is or not), and then as a type TS can iterate over.
        if (
            (first as unknown as Record<string, number>)[prop] !==
            (second as unknown as Record<string, number>)[prop]
        )
            return false;
    }

    return true;
};

export const equalColorString = (first: string, second: string): boolean => {
    return first.replace(/\s/g, "") === second.replace(/\s/g, "");
};

export const equalHex = (first: string, second: string): boolean => {
    if (first.toLowerCase() === second.toLowerCase()) return true;

    // To compare colors like `#FFF` and `ffffff` we convert them into RGB objects
    return equalColorObjects(hexToRgba(first), hexToRgba(second));
};
