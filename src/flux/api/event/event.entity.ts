import { NanoId } from '@/types';
import { EventArtistLink } from '../event-artist-link/event-artist-link.entity';
import { Room } from '../room';
import { Venue } from '../venue/venue.entity';

export interface Event {
	readonly event_uid: NanoId;
	readonly room: Room;
	readonly venue: Venue;
	readonly name: string;
	readonly image_url: string | null;
	readonly description: string | null;
	readonly doors_time: Date | null;
	readonly start_time: Date | null;
	readonly end_time: Date | null;
	readonly two_drink_minimum: boolean;
	readonly phone_free_zone: boolean;
	readonly serves_alcohol: boolean;
	readonly serves_food: boolean;
	readonly twenty_one_plus: boolean;
	readonly sold_out: boolean | null;
	readonly event_link: string | null;
	readonly ticket_link: string | null;
	readonly artists: EventArtistLink[];
}
