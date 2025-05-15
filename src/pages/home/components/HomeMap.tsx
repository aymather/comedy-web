import Map from '@/components/Map';
import { hostApiSlice } from '@/flux/api/host';
import { Venue, venueApiSlice } from '@/flux/api/venue';
import useMap from '@/hooks/useMap';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import {
	HoveredEvent,
	HoveredVenue,
	SelectedEvent,
	SelectedVenue
} from '../home.page';
import { HostMapMarker } from './MapMarkers';

export const losAngelesDefaultPlaceDetails = {
	place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
	name: 'Los Angeles',
	formatted_address: 'Los Angeles, CA, USA',
	latitude: 34.0549076,
	longitude: -118.242643,
	viewport: {
		northeast: {
			lat: 34.33730604252446,
			lng: -118.155289077463
		},
		southwest: {
			lat: 33.70365193147634,
			lng: -118.6681761264879
		}
	},
	address_components: [
		{
			long_name: 'Los Angeles',
			short_name: 'Los Angeles',
			types: ['locality', 'political']
		},
		{
			long_name: 'Los Angeles County',
			short_name: 'Los Angeles County',
			types: ['administrative_area_level_2', 'political']
		},
		{
			long_name: 'California',
			short_name: 'CA',
			types: ['administrative_area_level_1', 'political']
		},
		{
			long_name: 'United States',
			short_name: 'US',
			types: ['country', 'political']
		}
	]
};

interface HomeMapProps {
	hoveredEvent: HoveredEvent | null;
	selectedVenue: SelectedVenue | null;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
	hoveredVenue: HoveredVenue | null;
	setHoveredVenue: (venue: HoveredVenue | null) => void;
	selectedEvent: SelectedEvent | null;
}

const HomeMap = ({
	hoveredEvent,
	selectedVenue,
	setSelectedVenue,
	hoveredVenue,
	setHoveredVenue,
	selectedEvent
}: HomeMapProps) => {
	const { data: hosts } = hostApiSlice.useFindAllHostsQuery();
	const { map, onIdle } = useMap();

	const { data: venue } = venueApiSlice.useFindOneVenueQuery(
		{
			params: {
				host_uid: selectedVenue?.host_uid || '',
				venue_uid: selectedVenue?.venue_uid || ''
			}
		},
		{
			skip: !selectedVenue
		}
	);

	const center = {
		lat: losAngelesDefaultPlaceDetails.latitude,
		lng: losAngelesDefaultPlaceDetails.longitude
	};

	useEffect(() => {
		if (selectedEvent && hosts && map) {
			let venue: Venue | undefined;
			for (const host of hosts) {
				venue = host.venues.find(
					(v) => v.venue_uid === selectedEvent.venue_uid
				);
				if (venue) {
					break;
				}
			}
			if (venue) {
				map.setZoom(12);
				map.panTo({
					lat: Number(venue.location?.latitude || 0),
					lng: Number(venue.location?.longitude || 0)
				});
			}
		}
	}, [selectedEvent, map, hosts]);

	useEffect(() => {
		if (selectedVenue && hosts && map) {
			let venue: Venue | undefined;
			for (const host of hosts) {
				venue = host.venues.find(
					(v) => v.venue_uid === selectedVenue.venue_uid
				);
				if (venue) {
					break;
				}
			}
			if (venue) {
				map.setZoom(12);
				map.panTo({
					lat: Number(venue.location?.latitude || 0),
					lng: Number(venue.location?.longitude || 0)
				});
			}
		}
	}, [selectedVenue, map, hosts]);

	return (
		<div className="relative w-full h-[60vh] border-1 border-default-100 rounded-3xl overflow-hidden">
			<Map
				defaultCenter={center}
				defaultZoom={10}
				gestureHandling="greedy"
				disableDefaultUI={true}
				onIdle={onIdle}
				style={{
					width: '100%',
					height: '100%',
					overflow: 'hidden'
				}}
			>
				{hosts?.map((host) => (
					<HostMapMarker
						key={host.host_uid}
						host={host}
						hoveredVenue={hoveredVenue}
						selectedVenue={selectedVenue}
						setSelectedVenue={setSelectedVenue}
						hoveredEvent={hoveredEvent}
						setHoveredVenue={setHoveredVenue}
						selectedEvent={selectedEvent}
						map={map}
					/>
				))}
			</Map>
			{selectedVenue && venue && (
				<div className="absolute bottom-0 left-0 right-0 border-t border-default-200 bg-white/90 dark:bg-black/70 backdrop-blur-xl p-4 flex items-center gap-4 rounded-b-2xl shadow">
					<img
						src={
							venue.host.profile_image_url ||
							venue.profile_image_url ||
							''
						}
						alt={venue.name}
						className="w-12 h-12 rounded-full object-cover"
					/>
					<span className="flex-1 text-base font-medium text-black dark:text-white">
						{venue.name}
					</span>
					<button
						onClick={() => setSelectedVenue(null)}
						className="ml-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
					>
						<X size={24} className="text-black dark:text-white" />
					</button>
				</div>
			)}
		</div>
	);
};

export default HomeMap;
