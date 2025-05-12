import { NanoId } from '@/types';
import { SearchType } from '../types';

export interface SearchArtistsQueryDto {
	readonly q: string;
}

export interface ArtistSearchItem {
	readonly artist_uid: NanoId;
	readonly name: string;
	readonly searchType: SearchType;
	readonly profile_image_url: string;
}

export interface SearchArtistsResponseDto {
	readonly hits: ArtistSearchItem[];
	readonly query: string;
	readonly processingTimeMs: number;
	readonly limit: number;
	readonly offset: number;
	readonly estimatedTotalHits: number;
}
