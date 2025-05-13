import { googleMapsApiSlice } from '@/flux/api/google-maps';
import { Host } from '@/flux/api/host';
import { Venue } from '@/flux/api/venue';
import { Image } from '@heroui/react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

interface VenueMapMarkerProps {
	host: Host;
	venue: Venue;
	image_url: string | null;
	isHovered: boolean;
	onSelect: (host: Host, venue: Venue) => void;
}

export const VenueMapMarker: React.FC<VenueMapMarkerProps> = ({
	host,
	venue,
	image_url,
	isHovered,
	onSelect
}) => {
	const { data } = googleMapsApiSlice.useGetLocationDetailsByPlaceIdQuery(
		{
			body: {
				place_id: venue.place_id || ''
			}
		},
		{
			skip: !venue.place_id
		}
	);

	if (!data) return null;

	return (
		<AdvancedMarker
			position={{
				lat: data.latitude,
				lng: data.longitude
			}}
			onClick={() => onSelect(host, venue)}
		>
			<Image
				src={image_url || venue.profile_image_url || ''}
				alt={venue.name}
				className="h-6 w-6 object-cover rounded-full border-1 hover:border-default-900 cursor-pointer"
				style={{
					opacity: isHovered ? 1 : 0.2,
					zIndex: isHovered ? 999 : -1,
					transform: isHovered ? 'scale(1.5)' : undefined,
					position: 'relative',
					transition: 'transform 0.2s, opacity 0.2s'
				}}
			/>
		</AdvancedMarker>
	);
};

interface HostMapMarkerProps {
	host: Host;
	hoveredEventVenueUid: string | null;
	onVenueSelect: (host: Host, venue: Venue) => void;
}

export const HostMapMarker: React.FC<HostMapMarkerProps> = ({
	host,
	hoveredEventVenueUid,
	onVenueSelect
}) => {
	const getMarkerIsHovered = (venue: Venue) => {
		if (
			hoveredEventVenueUid === null ||
			hoveredEventVenueUid === venue.venue_uid
		) {
			return true;
		}

		return false;
	};

	return (
		<>
			{host.venues.map((venue) => (
				<VenueMapMarker
					key={venue.venue_uid}
					host={host}
					venue={venue}
					image_url={host.profile_image_url}
					isHovered={getMarkerIsHovered(venue)}
					onSelect={() => onVenueSelect(host, venue)}
				/>
			))}
		</>
	);
};
