"use client";

import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "#171717",
					"--normal-text": "#ffffff",
					"--normal-border": "rgba(255, 255, 255, 0.12)",
					"--border-radius": "18px",
				} as React.CSSProperties
			}
			toastOptions={{
				classNames: {
					toast:
						"cn-toast !min-h-16 !rounded-[18px] !border !border-white/10 !bg-[#171717] !px-4 !py-3 !text-white !shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
					success: "!border-l-4 !border-l-[#848C41]",
					error: "!border-l-4 !border-l-[#EA4D30]",
					warning: "!border-l-4 !border-l-[#F5B22D]",
					info: "!border-l-4 !border-l-[#4381C1]",
					title: "!font-heading !text-sm !font-semibold !text-white",
					description: "!text-xs !text-white/60",
					icon: "!text-[#F5B22D]",
					closeButton:
						"!border-white/10 !bg-[#262626] !text-white hover:!bg-[#333333]",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
