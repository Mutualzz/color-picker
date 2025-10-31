import { Interactive, type Interaction } from "@mutualzz/ui-core";
import { forwardRef, useCallback, useMemo } from "react";
import { hsvaToHslaString } from "../Converters/Converters";
import { Pointer } from "./Pointer";
import type { SaturationProps } from "./Saturation.types";

const Saturation = forwardRef<HTMLDivElement, SaturationProps>(
    ({ radius = 0, hue = 0, hsva, onChange, pointer, ...props }, ref) => {
        const handleChange = (interaction: Interaction) => {
            hsva &&
                onChange?.({
                    h: hsva.h,
                    s: interaction.left * 100,
                    v: (1 - interaction.top) * 100,
                    alpha: hsva.alpha,
                });
        };

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (!hsva || !onChange) return;
                const step = 1;
                let newS = hsva.s;
                let newV = hsva.v;
                let changed = false;

                switch (event.key) {
                    case "ArrowLeft":
                        newS = Math.max(0, hsva.s - step);
                        changed = true;
                        event.preventDefault();
                        break;
                    case "ArrowRight":
                        newS = Math.min(100, hsva.s + step);
                        changed = true;
                        event.preventDefault();
                        break;
                    case "ArrowUp":
                        newV = Math.min(100, hsva.v + step);
                        changed = true;
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                        newV = Math.max(0, hsva.v - step);
                        changed = true;
                        event.preventDefault();
                        break;
                    default:
                        return;
                }
                if (changed) {
                    onChange({
                        h: hsva.h,
                        s: newS,
                        v: newV,
                        alpha: hsva.alpha,
                    });
                }
            },
            [hsva, onChange],
        );

        const pointerElement = useMemo(() => {
            if (!hsva) return null;
            const comProps = {
                top: `${100 - hsva.v}%`,
                left: `${hsva.s}%`,
                color: hsvaToHslaString(hsva),
            };

            if (pointer && typeof pointer === "function") {
                return pointer({ ...comProps });
            }

            return <Pointer {...comProps} />;
        }, [hsva, pointer]);

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                (event.target as HTMLElement).focus();
            },
            [],
        );

        return (
            <Interactive
                {...props}
                css={{
                    inset: 0,
                    cursor: "crosshair",
                    backgroundImage: `linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, hsl(${
                        hsva?.h ?? hue
                    }, 100%, 50%))`,
                    width: 200,
                    height: 200,
                    borderRadius: radius,
                    position: "relative",
                    outline: "none",
                }}
                ref={ref}
                onMove={handleChange}
                onDown={handleChange}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
            >
                {pointerElement}
            </Interactive>
        );
    },
);

Saturation.displayName = "Saturation";

export { Saturation };
