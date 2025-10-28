import type {
    HSVObject,
    Interaction,
    Orientation,
    SizeValue,
} from "@mutualzz/ui-core";
import type { HTMLAttributes } from "react";

export interface AlphaProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    width?: SizeValue;
    height?: SizeValue;

    hsva: HSVObject;

    radius?: SizeValue;

    orientation?: Orientation;

    onChange?: (newAlpha: { a: number }, offset: Interaction) => void;
}
