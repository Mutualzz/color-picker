import type { AlphaProps } from "../Alpha/Alpha.types";

export interface ShadeSliderProps extends Omit<AlphaProps, "onChange"> {
    onChange?: (newShade: { v: number }) => void;
}
