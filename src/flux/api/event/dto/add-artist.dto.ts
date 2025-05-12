import { NanoId } from '@/types';

export interface AddArtistParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
	event_uid: NanoId;
	artist_uid: NanoId;
}
