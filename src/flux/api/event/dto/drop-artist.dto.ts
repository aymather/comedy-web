import { NanoId } from '@/types';

export interface DropArtistParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
	event_uid: NanoId;
	artist_uid: NanoId;
}
