import { NanoId } from '@/types';
import { Artist } from '../artist/artist.entity';
import { Event } from '../event';

export interface EventArtistLink {
	readonly event_artist_link_uid: NanoId;
	readonly artist: Artist;
	readonly event: Event;
}
