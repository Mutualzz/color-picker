import type { HsvaColor } from "@mutualzz/ui-core";
import type { HTMLAttributes, JSX } from "react";
import type { PointerProps } from "../Alpha/Alpha.types";

export interface SaturationProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    hsva?: HsvaColor;
    hue?: number;
    radius?: string | number;

    pointer?: ({ left, top, color }: PointerProps) => JSX.Element;

    onChange?: (newColor: HsvaColor) => void;
}
