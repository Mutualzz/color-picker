import type { CSSObject } from "@emotion/react";
import type { HsvaColor, Interaction } from "@mutualzz/ui-core";
import type { HTMLAttributes, JSX } from "react";

export interface PointerProps extends HTMLAttributes<HTMLDivElement> {
    left?: string;
    top?: string;
    fillProps?: HTMLAttributes<HTMLDivElement> & { css?: CSSObject };

    css?: CSSObject;
}

export interface AlphaProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    width?: string | number;
    height?: string | number;
    hsva: HsvaColor;

    pointer?: (props: PointerProps) => JSX.Element;

    radius?: string | number;

    background?: string;

    bgProps?: HTMLAttributes<HTMLDivElement> & { css?: CSSObject };

    innerProps?: HTMLAttributes<HTMLDivElement> & { css?: CSSObject };
    pointerProps?: PointerProps;

    orientation?: "vertical" | "horizontal";
    onChange?: (newAlpha: { alpha: number }, offset: Interaction) => void;

    css?: CSSObject;
}
