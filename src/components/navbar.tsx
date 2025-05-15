import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle
} from '@heroui/navbar';
import { useDisclosure } from '@heroui/react';

import {
	GithubIcon,
	HeartFilledIcon,
	Logo,
	SearchIcon
} from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';
import { useCallback, useEffect, useState } from 'react';
import SearchModal from './SearchModal';

export const Navbar = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	// Cmd+K and / shortcut
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const isInput =
				['INPUT', 'TEXTAREA'].includes(
					(e.target as HTMLElement)?.tagName
				) || (e.target as HTMLElement)?.isContentEditable;
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				if (!isSearchOpen) setIsSearchOpen(true);
			} else if (e.key === '/' && !isInput && !isSearchOpen) {
				e.preventDefault();
				setIsSearchOpen(true);
			} else if (e.key === 'Escape' && isSearchOpen) {
				setIsSearchOpen(false);
			}
		},
		[isSearchOpen]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	const searchInput = (
		<button
			type="button"
			aria-label="Search"
			className="w-full flex items-center bg-default-100 rounded-lg px-3 py-2 text-sm text-left text-default-700 focus:outline-none focus:ring-2 focus:ring-primary/50 gap-2"
			onClick={() => setIsSearchOpen(true)}
			onFocus={() => setIsSearchOpen(true)}
		>
			<SearchIcon className="text-base text-default-400 flex-shrink-0" />
			<span className="flex-1 text-sm text-default-700 opacity-70">
				Search...
			</span>
			<Kbd className="hidden lg:inline-block ml-2" keys={['command']}>
				K
			</Kbd>
		</button>
	);

	return (
		<>
			<HeroUINavbar maxWidth="xl" position="sticky">
				<NavbarContent
					className="basis-1/5 sm:basis-full"
					justify="start"
				>
					<NavbarBrand className="gap-3 max-w-fit">
						<Link
							className="flex justify-start items-center gap-1"
							color="foreground"
							href="/"
						>
							<Logo />
							<p className="font-bold text-inherit">Comedy</p>
						</Link>
					</NavbarBrand>
					{/* <div className="hidden lg:flex gap-4 justify-start ml-2">
						{siteConfig.navItems.map((item) => (
							<NavbarItem key={item.href}>
								<Link
									className={clsx(
										linkStyles({ color: 'foreground' }),
										'data-[active=true]:text-primary data-[active=true]:font-medium'
									)}
									color="foreground"
									href={item.href}
								>
									{item.label}
								</Link>
							</NavbarItem>
						))}
					</div> */}
				</NavbarContent>

				<NavbarContent
					className="hidden sm:flex basis-1/5 sm:basis-full"
					justify="end"
				>
					<NavbarItem className="hidden sm:flex gap-2">
						<ThemeSwitch />
					</NavbarItem>
					<NavbarItem className="hidden lg:flex">
						{searchInput}
					</NavbarItem>
					<NavbarItem className="hidden md:flex">
						<Button
							isExternal
							as={Link}
							className="text-sm font-normal text-default-600 bg-default-100"
							href={siteConfig.links.sponsor}
							startContent={
								<HeartFilledIcon className="text-danger" />
							}
							variant="flat"
						>
							Sponsor
						</Button>
					</NavbarItem>
				</NavbarContent>

				<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
					<Link isExternal href={siteConfig.links.github}>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
					<NavbarMenuToggle />
				</NavbarContent>

				<NavbarMenu>
					{searchInput}
					<div className="mx-4 mt-2 flex flex-col gap-2">
						{siteConfig.navMenuItems.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Link
									color={
										index === 2
											? 'primary'
											: index ===
												  siteConfig.navMenuItems
														.length -
														1
												? 'danger'
												: 'foreground'
									}
									href="#"
									size="lg"
								>
									{item.label}
								</Link>
							</NavbarMenuItem>
						))}
					</div>
				</NavbarMenu>
			</HeroUINavbar>
			<SearchModal
				isOpen={isSearchOpen}
				onClose={() => setIsSearchOpen(false)}
			/>
		</>
	);
};
