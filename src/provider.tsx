import { ToastProvider } from '@heroui/react';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import type { NavigateOptions } from 'react-router-dom';
import { useHref, useNavigate } from 'react-router-dom';
import { store } from './flux';

declare module '@react-types/shared' {
	interface RouterConfig {
		routerOptions: NavigateOptions;
	}
}

export function Provider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<HeroUIProvider navigate={navigate} useHref={useHref}>
			<NextThemesProvider attribute="class">
				<ReduxProvider store={store}>
					<ToastProvider />
					{children}
				</ReduxProvider>
			</NextThemesProvider>
		</HeroUIProvider>
	);
}
