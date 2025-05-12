import { NanoId } from '@/types';
import { Artist } from '../artist.entity';

export interface DeleteArtistParamsDto {
	artist_uid: NanoId;
}

export interface DeleteArtistResponseDto extends Artist {}
