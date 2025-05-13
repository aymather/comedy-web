import { NanoId } from '@/types';
import { Venue } from '../venue.entity';

export interface UpdateVenueParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
}

export interface UpdateVenueBodyDto {
	name?: string;
	profile_image_url?: string;
	place_id?: string;
}

export interface UpdateVenueResponseDto extends Venue {}
