import { NanoId } from '@/types';
import { Artist } from '../artist.entity';

export interface FindOneArtistParamsDto {
	artist_uid: NanoId;
}

export interface FindOneArtistResponseDto extends Artist {}
