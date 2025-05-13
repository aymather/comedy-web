import { NanoId } from '@/types';
import { Host } from '../host/host.entity';
import { Room } from '../room';
import { VenueImage } from '../venue-image/venue-image.entity';

export interface Venue {
	readonly venue_uid: NanoId;
	readonly rooms: Room[];
	readonly host: Host;
	readonly name: string;
	readonly profile_image_url: string | null;
	readonly stage_image_url: string | null;
	readonly place_id: string | null;
	readonly images: VenueImage[];
}
