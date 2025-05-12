import { NanoId } from '@/types';

export interface Artist {
	readonly artist_uid: NanoId;
	readonly name: string;
	readonly profile_image_url: string | null;
}
