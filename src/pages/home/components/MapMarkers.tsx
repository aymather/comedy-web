import { Host } from '@/flux/api/host';
import { Venue } from '@/flux/api/venue';
import { Image } from '@heroui/react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import {
	HoveredEvent,
	HoveredVenue,
	SelectedEvent,
	SelectedVenue
} from '../home.page';

interface VenueMapMarkerProps {
	host: Host;
	venue: Venue;
	image_url: string | null;
	isHovered: boolean;
	setHoveredVenue: (venue: SelectedVenue | null) => void;
	onSelect: () => void;
}

export const VenueMapMarker: React.FC<VenueMapMarkerProps> = ({
	host,
	venue,
	image_url,
	isHovered,
	setHoveredVenue,
	onSelect
}) => {
	if (!venue.location) return null;

	return (
		<AdvancedMarker
			position={{
				lat: Number(venue.location.latitude),
				lng: Number(venue.location.longitude)
			}}
			onClick={onSelect}
			zIndex={isHovered ? 1000 : 1}
			onMouseEnter={() =>
				setHoveredVenue({
					host_uid: host.host_uid,
					venue_uid: venue.venue_uid
				})
			}
			onMouseLeave={() => setHoveredVenue(null)}
		>
			<Image
				src={image_url || venue.profile_image_url || ''}
				alt={venue.name}
				className={`h-6 w-6 object-cover rounded-full border-1 border-transparent cursor-pointer transition-all ${isHovered ? 'border-default-700' : ''}`}
				style={{
					opacity: isHovered ? 1 : 0.4,
					transform: isHovered ? 'scale(1.5)' : undefined,
					transition: 'transform 0.2s, opacity 0.2s'
				}}
			/>
		</AdvancedMarker>
	);
};

interface HostMapMarkerProps {
	host: Host;
	hoveredEvent: HoveredEvent | null;
	hoveredVenue: HoveredVenue | null;
	selectedVenue: SelectedVenue | null;
	setSelectedVenue: (venue: SelectedVenue | null) => void;
	setHoveredVenue: (venue: SelectedVenue | null) => void;
	selectedEvent: SelectedEvent | null;
	map: google.maps.Map | null;
}

export const HostMapMarker: React.FC<HostMapMarkerProps> = ({
	host,
	hoveredEvent,
	hoveredVenue,
	selectedVenue,
	setSelectedVenue,
	setHoveredVenue,
	selectedEvent,
	map
}) => {
	const getMarkerIsHovered = (venue: Venue) => {
		const eventHovered =
			hoveredEvent && hoveredEvent.venue_uid === venue.venue_uid;
		const venueHovered =
			hoveredVenue && hoveredVenue.venue_uid === venue.venue_uid;
		const venueSelected =
			selectedVenue && selectedVenue.venue_uid === venue.venue_uid;
		const eventSelected =
			selectedEvent && selectedEvent.venue_uid === venue.venue_uid;

		if (
			!hoveredEvent &&
			!hoveredVenue &&
			!selectedEvent &&
			!selectedVenue
		) {
			return true;
		}

		return !!(
			eventHovered ||
			venueHovered ||
			venueSelected ||
			eventSelected
		);
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
					setHoveredVenue={setHoveredVenue}
					onSelect={() => {
						map?.setZoom(12);
						map?.panTo({
							lat: Number(venue.location?.latitude || 0),
							lng: Number(venue.location?.longitude || 0)
						});

						setSelectedVenue({
							host_uid: host.host_uid,
							venue_uid: venue.venue_uid
						});
					}}
				/>
			))}
		</>
	);
};
