import ShadeGenerator, { Shade } from "shade-generator";

const shadeConfig: Record<Shade, number> = {
    "10": 0.9,
    "20": 0.8,
    "30": 0.7,
    "40": 0.6,
    "50": 0.5,
    "60": 0.4,
    "70": 0.3,
    "80": 0.2,
    "90": 0.1,
    "100": 0,
    "200": 0.9,
    "300": 0.8,
    "400": 0.7,
    "500": 0.6,
    "600": 0.5,
    "700": 0.4,
    "800": 0.3,
    "900": 0.2,
    "1000": 0.1,
}

export function generateColorShades(color: string = "#fffff"): Record<Shade, string> {
    return ShadeGenerator.hue(color).config(shadeConfig).shadesMap("hex");
}