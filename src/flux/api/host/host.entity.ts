import { NanoId } from '@/types';
import { Venue } from '../venue';
import { HostType } from './types';

export interface Host {
	readonly host_uid: NanoId;
	readonly name: string;
	readonly profile_image_url: string | null;
	readonly type: HostType;
	readonly venues: Venue[];
	readonly description: string | null;
	readonly website_url: string | null;
	readonly instagram_url: string | null;
	readonly instagram_handle: string | null;
	readonly tiktok_url: string | null;
	readonly tiktok_handle: string | null;
	readonly facebook_url: string | null;
	readonly facebook_handle: string | null;
	readonly x_url: string | null;
	readonly x_handle: string | null;
	readonly youtube_url: string | null;
	readonly youtube_handle: string | null;
	readonly stage_image_url: string | null;
}
