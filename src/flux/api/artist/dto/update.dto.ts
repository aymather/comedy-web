import { NanoId } from '@/types';
import { Artist } from '../artist.entity';

export interface UpdateArtistParamsDto {
	artist_uid: NanoId;
}

export interface UpdateArtistBodyDto {
	name?: string;
	image_url?: string | null;
}

export interface UpdateArtistResponseDto extends Artist {}
