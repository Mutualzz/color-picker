import type { AlphaProps } from "../Alpha/Alpha.types";

export interface HueProps extends Omit<AlphaProps, "hsva" | "onChange"> {
    onChange?: (newHue: { h: number }) => void;
    hue?: number;
}
