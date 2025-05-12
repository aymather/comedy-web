import { NanoId } from '@/types';
import { Venue } from '../venue.entity';

export interface CreateVenueParamsDto {
	host_uid: NanoId;
}

export interface CreateVenueBodyDto {
	name: string;
}

export interface CreateVenueResponseDto extends Venue {}
