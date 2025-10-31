import { useMemo, type FC, type HTMLAttributes } from "react";

interface PointerProps extends HTMLAttributes<HTMLDivElement> {
    left?: string | number;
    top?: string | number;
    color?: string;
}

export const Pointer: FC<PointerProps> = ({ color, top, left }) => {
    return useMemo(
        () => (
            <div
                css={{
                    position: "absolute",
                    top,
                    left,
                }}
            >
                <div
                    css={{
                        width: 6,
                        height: 6,
                        transform: "translate(-3px, -3px)",
                        boxShadow:
                            "rgb(255 255 255) 0px 0px 0px 1.5px, rgb(0 0 0 / 30%) 0px 0px 1px 1px inset, rgb(0 0 0 / 40%) 0px 0px 1px 2px",
                        borderRadius: "50%",
                        backgroundColor: color,
                    }}
                />
            </div>
        ),
        [top, left, color],
    );
};
