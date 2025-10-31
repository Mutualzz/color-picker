import { forwardRef } from "react";
import { Alpha } from "../Alpha/Alpha";
import type { HueProps } from "./Hue.types";

const Hue = forwardRef<HTMLDivElement, HueProps>(
    ({ hue = 0, onChange, orientation = "horizontal", ...props }, ref) => {
        return (
            <Alpha
                ref={ref}
                {...props}
                orientation={orientation}
                background={`linear-gradient(to ${
                    orientation === "horizontal" ? "right" : "bottom"
                }, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)`}
                hsva={{ h: hue, s: 100, v: 100, alpha: hue / 360 }}
                onChange={(_, interaction) => {
                    onChange &&
                        onChange({
                            h:
                                orientation === "horizontal"
                                    ? 360 * interaction.left
                                    : 360 * interaction.top,
                        });
                }}
            />
        );
    },
);

Hue.displayName = "Hue";

export { Hue };
