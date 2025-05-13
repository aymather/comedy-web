import { NanoId } from '@/types';
import { VenueImageTag } from './types';

export interface VenueImage {
	readonly venue_image_uid: NanoId;
	readonly url: string;
	readonly tag: VenueImageTag;
}
