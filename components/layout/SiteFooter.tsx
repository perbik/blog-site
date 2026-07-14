import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoopingHeadline } from "@/components/home/LoopingHeadline";
import { cn } from "@/lib/utils";

const socialLinks = [
	{ icon: faGithub, label: "GitHub", href: "https://github.com/perbik" },
	{
		icon: faLinkedinIn,
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/fervicmarlagman/",
	},
	{ icon: faEnvelope, label: "Email", href: "fervicmardlagman@gmail.com" },
	{ icon: faGlobe, label: "Portfolio", href: "https://fervicmar.vercel.app/" },
];

interface SiteFooterProps {
	dark?: boolean;
}

export function SiteFooter({ dark = false }: SiteFooterProps) {
	return (
		<footer
			className={cn(
				"w-full overflow-hidden",
				dark ? "bg-[#0a0a0a] text-[#fcfcfc]" : "bg-[#f5f5f5] text-black",
			)}
		>
			<div className="flex items-center justify-center gap-3 px-6 pb-4 pt-14">
				<span className="shrink-0 select-none font-heading text-6xl font-bold leading-none md:text-8xl">
					[
				</span>

				<div className="max-w-lg flex-1 overflow-hidden font-heading text-3xl font-medium leading-none md:text-4xl">
					<LoopingHeadline />
				</div>

				<span className="shrink-0 select-none font-heading text-6xl font-bold leading-none md:text-8xl">
					]
				</span>
			</div>

			<div className="mb-4 mt-8 flex justify-center">
				<div
					className={cn(
						"flex size-15 items-center justify-center rounded-full",
						dark ? "bg-[#fcfcfc] text-black" : "bg-black text-white",
					)}
				>
					<svg
						width="26"
						height="26"
						viewBox="0 0 26 26"
						fill="none"
						aria-hidden="true"
					>
						<circle cx="13" cy="13" r="5" fill="currentColor" />
						<circle
							cx="13"
							cy="13"
							r="11"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
						/>
					</svg>
				</div>
			</div>

			<p className="mb-3 text-center font-heading text-5xl font-medium leading-none">
				echo
			</p>

			<p className="mx-auto mb-10 max-w-xs px-4 text-center font-mono text-sm leading-relaxed opacity-45">
				A personal blog for creator economy notes, internet culture, and open
				conversations.
			</p>

			<div className="flex items-center justify-center gap-5 pb-14">
				{socialLinks.map(({ icon, label, href }) => (
					<a
						key={label}
						href={href}
						aria-label={label}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(
							"flex size-11.5 items-center justify-center rounded-full transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25",
							dark ? "bg-[#fcfcfc] text-black" : "bg-black text-white",
						)}
					>
						<FontAwesomeIcon icon={icon} className="size-4.5" />
					</a>
				))}
			</div>
		</footer>
	);
}
