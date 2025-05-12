import { AddressComponent, LatLngBounds } from '@/types/google-maps';

export interface GetLocationDetailsByPlaceIdBodyDto {
	readonly place_id: string;
}

export interface LocationDetails {
	readonly google_place_id: string;
	readonly name: string;
	readonly formatted_address: string;
	readonly latitude: number;
	readonly longitude: number;
	readonly viewport: LatLngBounds;
	readonly address_components: AddressComponent[];
}

export interface LocationDetailsByPlaceIdResponseDto extends LocationDetails {}
