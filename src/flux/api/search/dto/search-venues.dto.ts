import { NanoId } from '@/types';
import { SearchType } from '../types';

export interface SearchVenuesQueryDto {
	readonly q: string;
}

export interface VenueSearchItem {
	readonly venue_uid: NanoId;
	readonly name: string;
	readonly searchType: SearchType;
	readonly profile_image_url: string;
}

export interface SearchVenuesResponseDto {
	readonly hits: VenueSearchItem[];
	readonly query: string;
	readonly processingTimeMs: number;
	readonly limit: number;
	readonly offset: number;
	readonly estimatedTotalHits: number;
}
