import Map from '@/components/Map';
import { hostApiSlice } from '@/flux/api/host';
import { HostMapMarker } from './MapMarkers';

const placeDetails = {
	google_place_id: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
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

const HomeMap = ({
	hoveredEventVenueUid
}: {
	hoveredEventVenueUid: string | null;
}) => {
	const { data: hosts } = hostApiSlice.useFindAllHostsQuery();

	const center = {
		lat: placeDetails.latitude,
		lng: placeDetails.longitude
	};

	return (
		<Map
			center={center}
			zoom={10}
			gestureHandling="greedy"
			disableDefaultUI={true}
			style={{
				width: '100%',
				height: '600px',
				borderRadius: '2rem',
				overflow: 'hidden'
			}}
		>
			{hosts?.map((host) => (
				<HostMapMarker
					key={host.host_uid}
					host={host}
					hoveredEventVenueUid={hoveredEventVenueUid}
				/>
			))}
		</Map>
	);
};

export default HomeMap;
