import { formatColor, styled } from "@mutualzz/ui-core";
import type { FC, HTMLAttributes } from "react";

export interface PointerProps extends HTMLAttributes<HTMLDivElement> {
    left?: string;
    top?: string;
}

const PointerWrapper = styled("div")<PointerProps>(({ top, left }) => ({
    position: "absolute",
    top,
    left,
}));

const PointerItself = styled("div")<PointerProps>(({ theme, left }) => ({
    width: 18,
    height: 18,
    boxShadow: "rgb(0 0 0 / 37%) 0px 1px 4px 0px",
    backgroundColor: formatColor(theme.colors.common.white, {
        format: "rgb",
        darken: 0.15,
    }),
    borderRadius: "50%",
    transform: left ? "translate(-9px, -1px)" : "translate(-1px, -9px)",
}));

export const Pointer: FC<PointerProps> = ({ top, left, ...props }) => {
    return (
        <PointerWrapper top={top} left={left} {...props}>
            <PointerItself left={left} />
        </PointerWrapper>
    );
};
