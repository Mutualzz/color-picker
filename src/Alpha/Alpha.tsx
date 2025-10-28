import { styled, type Interaction, type SizeValue } from "@mutualzz/ui-core";
import Color from "color";
import { forwardRef, useCallback } from "react";
import type { AlphaProps } from "./Alpha.types";
import { Pointer } from "./Pointer";

export const BACKGROUND_IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==";

const AlphaWrapper = styled("div")<{
    radius?: SizeValue;
    width?: SizeValue;
    height?: SizeValue;
}>(({ theme, radius, width, height }) => ({
    borderRadius: radius,
    background: `url(${BACKGROUND_IMG}) left center`,
    backgroundColor: theme.colors.common.white,
    position: "relative",
    ...{ width, height },
}));

const AlphaBar = styled("div")<{ background: string; radius: SizeValue }>(
    ({ background, radius }) => ({
        inset: 0,
        position: "absolute",
        background,
        borderRadius: radius,
    }),
);

const Alpha = forwardRef<HTMLDivElement, AlphaProps>(
    (
        {
            hsva,
            radius = 0,
            width,
            height = 16,
            orientation = "horizontal",
            onChange,
            ...props
        },
        ref,
    ) => {
        const handleChange = (offset: Interaction) => {
            onChange?.(
                {
                    ...hsva,
                    a: orientation === "horizontal" ? offset.left : offset.top,
                },
                offset,
            );
        };

        const colorTo = new Color(hsva).hsl().object();

        const innerBackground = `linear-gradient(to ${
            orientation === "horizontal" ? "right" : "bottom"
        }, rgba(244, 67, 54, 0) 0%, ${colorTo} 100%)`;

        const comProps: { left?: string; top?: string } = {};

        if (orientation === "horizontal") comProps.left = `${hsva.a * 100}%`;
        else comProps.top = `${hsva.a * 100}%`;

        const handleKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                const step = 0.01; // 1% step
                const currentAlpha = hsva.a;
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
                        left: orientation === "horizontal" ? newAlpha : hsva.a,
                        top: orientation === "vertical" ? newAlpha : hsva.a,
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0,
                    };
                    onChange &&
                        onChange({ ...hsva, a: newAlpha }, syntheticOffset);
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

        const pointerElement = <Pointer {...comProps} />;

        return (
            <AlphaWrapper
                radius={radius as SizeValue}
                width={width as SizeValue}
                height={height as SizeValue}
                ref={ref}
                {...props}
            >
                <AlphaBar
                    background={innerBackground}
                    radius={radius as SizeValue}
                />
                <Interactive
            </AlphaWrapper>
        );
    },
);
