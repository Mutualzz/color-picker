import { formatColor } from "@mutualzz/ui-core";
import type { FC } from "react";
import type { PointerProps } from "./Alpha.types";

export const Pointer: FC<PointerProps> = ({
    top,
    left,
    css,
    fillProps,
    ...props
}) => {
    return (
        <div
            css={{
                ...css,
                position: "absolute",
                top,
                left,
            }}
            {...props}
        >
            <div
                {...fillProps}
                css={{
                    width: 18,
                    height: 18,
                    boxShadow: "rgb(0 0 0 / 37%) 0px 1px 4px 0px",
                    backgroundColor: formatColor("#fff", {
                        format: "rgba",
                        darken: 0.15,
                    }),
                    borderRadius: "50%",
                    ...fillProps?.css,
                    transform: left
                        ? "translate(-9px, -1px)"
                        : "translate(-1px, -9px)",
                }}
            />
        </div>
    );
};
