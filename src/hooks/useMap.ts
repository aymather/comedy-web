import { MapEvent } from '@vis.gl/react-google-maps';
import { useCallback, useState } from 'react';

interface IUseMap {
	isReady: boolean;
	map: google.maps.Map | null;
	onIdle: (e: MapEvent) => void;
}

const useMap = (): IUseMap => {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [isMapReady, setIsMapReady] = useState(false);

	const onIdle = useCallback(
		(e: MapEvent) => {
			if (!isMapReady) {
				setMap(e.map);
				setIsMapReady(true);
			}
		},
		[isMapReady]
	);

	return {
		isReady: isMapReady,
		map,
		onIdle
	};
};

export default useMap;
