import { NanoId } from '@/types';
import { VenueImageTag } from '../types';
import { VenueImage } from '../venue-image.entity';

export interface UpdateVenueImageParamsDto {
	readonly host_uid: NanoId;
	readonly venue_uid: NanoId;
	readonly venue_image_uid: NanoId;
}

export interface UpdateVenueImageBodyDto {
	readonly url: string;
	readonly tag: VenueImageTag;
}

export type UpdateVenueImageResponseDto = VenueImage;
