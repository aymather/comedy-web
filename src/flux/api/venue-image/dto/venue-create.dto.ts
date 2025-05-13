import { NanoId } from '@/types';
import { VenueImageTag } from '../types';
import { VenueImage } from '../venue-image.entity';

export interface CreateVenueImageParamsDto {
	readonly host_uid: NanoId;
	readonly venue_uid: NanoId;
}

export interface CreateVenueImageBodyDto {
	readonly url: string;
	readonly tag: VenueImageTag;
}

export interface CreateVenueImageResponseDto extends VenueImage {}
