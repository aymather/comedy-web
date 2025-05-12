import { NanoId } from '@/types';
import { Venue } from '../venue.entity';

export interface FindOneVenueParamsDto {
	host_uid: NanoId;
	venue_uid: NanoId;
}

export interface FindOneVenueResponseDto extends Venue {}
