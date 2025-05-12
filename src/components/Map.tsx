import {
	APIProvider,
	ColorScheme,
	MapProps,
	Map as RNMap
} from '@vis.gl/react-google-maps';
import { useTheme } from 'next-themes';

export const DEFAULT_MAP_ID = '60226c10d83c46f5';
export const GOOGLE_MAP_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;

const Map: React.FC<MapProps> = ({ children, ...props }) => {
	const { theme } = useTheme();

	return (
		<APIProvider apiKey={GOOGLE_MAP_API_KEY}>
			<RNMap
				mapId={DEFAULT_MAP_ID}
				colorScheme={
					theme === 'light' ? ColorScheme.LIGHT : ColorScheme.DARK
				}
				defaultZoom={13}
				gestureHandling="greedy"
				disableDefaultUI={true}
				style={{ width: '100%', height: '100%' }}
				{...props}
			>
				{children}
			</RNMap>
		</APIProvider>
	);
};

export default Map;
