import { NanoId } from '@/types';
import { Venue } from '../venue.entity';

export interface DeleteVenueParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
}

export interface DeleteVenueResponseDto extends Venue {}
