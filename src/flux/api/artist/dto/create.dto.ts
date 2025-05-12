import { Artist } from '../artist.entity';

export interface CreateArtistBodyDto {
	name: string;
}

export interface CreateArtistResponseDto extends Artist {}
