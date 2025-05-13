import { NanoId } from '@/types';
import { VenueImage } from '../venue-image.entity';

export interface DeleteVenueImageParamsDto {
	readonly host_uid: NanoId;
	readonly venue_uid: NanoId;
	readonly venue_image_uid: NanoId;
}

export interface DeleteVenueImageResponseDto extends VenueImage {}
