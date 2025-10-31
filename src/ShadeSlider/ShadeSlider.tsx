import { forwardRef } from "react";
import { Alpha } from "../Alpha/Alpha";
import { hsvaToHslaString } from "../Converters/Converters";
import type { ShadeSliderProps } from "./ShadeSlider.types";

const ShadeSlider = forwardRef<HTMLDivElement, ShadeSliderProps>(
    ({ onChange, orientation = "horizontal", hsva, ...props }, ref) => {
        const colorFrom = hsvaToHslaString({ ...hsva, alpha: 1, v: 100 });
        return (
            <Alpha
                ref={ref}
                {...props}
                hsva={{
                    h: hsva.h,
                    s: hsva.s,
                    v: hsva.v,
                    alpha: 1 - hsva.v / 100,
                }}
                orientation={orientation}
                background={`linear-gradient(to ${orientation === "horizontal" ? "right" : "bottom"}, ${colorFrom}, rgb(0, 0, 0))`}
                onChange={(_, interaction) => {
                    onChange?.({
                        v:
                            orientation === "horizontal"
                                ? 100 - interaction.left * 100
                                : 100 - interaction.top * 100,
                    });
                }}
            />
        );
    },
);

ShadeSlider.displayName = "ShadeSlider";

export { ShadeSlider };
