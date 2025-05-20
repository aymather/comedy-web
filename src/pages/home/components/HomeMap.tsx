import Map from '@/components/Map';
import { Host } from '@/flux/api/host';
import { Venue } from '@/flux/api/venue';
import useMap from '@/hooks/useMap';
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
	hosts?: Host[];
	hoveredEvent: HoveredEvent | null;
	selectedVenue: SelectedVenue | null;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
	hoveredVenue: HoveredVenue | null;
	setHoveredVenue: (venue: HoveredVenue | null) => void;
	selectedEvent: SelectedEvent | null;
}

const HomeMap = ({
	hosts,
	hoveredEvent,
	selectedVenue,
	setSelectedVenue,
	hoveredVenue,
	setHoveredVenue,
	selectedEvent
}: HomeMapProps) => {
	const { map, onIdle } = useMap();

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
		<div className="relative w-full h-full">
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
		</div>
	);
};

export default HomeMap;
