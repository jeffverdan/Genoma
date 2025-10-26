"use client";

import * as React from "react";
import { Popover, PopoverProps, PopoverOrigin, Box } from "@mui/material";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BasePopoverProps = Omit<
  PopoverProps,
  "open" | "anchorEl" | "children" | "content"
>;

interface MuiPopoverProps extends BasePopoverProps {
  trigger: React.ReactElement;      // o elemento que abre o popover
  children: React.ReactNode;        // conteúdo do popover (no lugar de "content")
  className?: string;
}

export function MuiPopover({
  trigger,
  children,
  className,
  anchorOrigin,
  transformOrigin,
  ...props
}: MuiPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <>
      {/* Trigger (clonamos para manter props/refs do elemento original) */}
      {React.cloneElement(trigger, { onClick: handleOpen })}

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={
          anchorOrigin ?? ({ vertical: "bottom", horizontal: "center" } as PopoverOrigin)
        }
        transformOrigin={
          transformOrigin ?? ({ vertical: "top", horizontal: "center" } as PopoverOrigin)
        }
        {...props}
      >
        <Box
          className={cn(
            "rounded-md border p-4 shadow-md",
            "transition-transform duration-150 ease-in-out",
            className
          )}
        >
          {children}
        </Box>
      </Popover>
    </>
  );
}
