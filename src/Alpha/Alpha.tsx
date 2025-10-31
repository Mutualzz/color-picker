import { Interactive, type Interaction } from "@mutualzz/ui-core";
import { forwardRef, useCallback } from "react";
import { hsvaToHslaString } from "../Converters/Converters";
import type { AlphaProps } from "./Alpha.types";
import { Pointer } from "./Pointer";

export const BACKGROUND_IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==";

const Alpha = forwardRef<HTMLDivElement, AlphaProps>(
    (
        {
            hsva,
            background,
            bgProps = {},
            innerProps = {},
            pointerProps = {},
            radius = 0,
            width,
            height = 16,
            orientation = "horizontal",
            css,
            onChange,
            pointer,
            ...props
        },
        ref,
    ) => {
        const handleChange = (offset: Interaction) => {
            onChange?.(
                {
                    ...hsva,
                    alpha:
                        orientation === "horizontal" ? offset.left : offset.top,
                },
                offset,
            );
        };

        const colorTo = hsvaToHslaString(Object.assign({}, hsva, { alpha: 1 }));
        const innerBackground = `linear-gradient(to ${
            orientation === "horizontal" ? "right" : "bottom"
        }, rgba(244, 67, 54, 0) 0%, ${colorTo} 100%)`;

        const comProps: { left?: string; top?: string } = {};

        if (orientation === "horizontal")
            comProps.left = `${hsva.alpha * 100}%`;
        else comProps.top = `${hsva.alpha * 100}%`;

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                const step = 0.01;
                const currentAlpha = hsva.alpha;
                let newAlpha = currentAlpha;
                switch (event.key) {
                    case "ArrowLeft":
                        if (orientation === "horizontal") {
                            newAlpha = Math.max(0, currentAlpha - step);
                            event.preventDefault();
                        }
                        break;
                    case "ArrowRight":
                        if (orientation === "horizontal") {
                            newAlpha = Math.min(1, currentAlpha + step);
                            event.preventDefault();
                        }
                        break;
                    case "ArrowUp":
                        if (orientation === "vertical") {
                            newAlpha = Math.max(0, currentAlpha - step);
                            event.preventDefault();
                        }
                        break;
                    case "ArrowDown":
                        if (orientation === "vertical") {
                            newAlpha = Math.min(1, currentAlpha + step);
                            event.preventDefault();
                        }
                        break;
                    default:
                        return;
                }

                if (newAlpha !== currentAlpha) {
                    const syntheticOffset: Interaction = {
                        left:
                            orientation === "horizontal"
                                ? newAlpha
                                : hsva.alpha,
                        top: orientation === "vertical" ? newAlpha : hsva.alpha,
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0,
                    };
                    onChange &&
                        onChange({ ...hsva, alpha: newAlpha }, syntheticOffset);
                }
            },
            [hsva, orientation, onChange],
        );

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                (event.target as HTMLElement).focus();
            },
            [],
        );

        const pointerElement =
            pointer && typeof pointer === "function" ? (
                pointer({ ...pointerProps, ...comProps })
            ) : (
                <Pointer {...pointerProps} {...comProps} />
            );

        return (
            <div
                ref={ref}
                {...props}
                css={{
                    borderRadius: radius,
                    background: `url(${BACKGROUND_IMG}) left center`,
                    backgroundColor: "#fff",
                    ...{ width, height },
                    ...css,
                    position: "relative",
                }}
            >
                <div
                    {...bgProps}
                    css={{
                        inset: 0,
                        position: "absolute",
                        background: background || innerBackground,
                        borderRadius: radius,
                        ...bgProps.css,
                    }}
                />
                <Interactive
                    {...innerProps}
                    css={{
                        ...innerProps.css,
                        inset: 0,
                        zIndex: 1,
                        position: "absolute",
                        outline: "none",
                    }}
                    onMove={handleChange}
                    onDown={handleChange}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                >
                    {pointerElement}
                </Interactive>
            </div>
        );
    },
);

Alpha.displayName = "Alpha";

export { Alpha };
