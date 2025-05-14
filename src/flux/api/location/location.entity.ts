import { AddressComponent, LatLngBounds } from '@/types/google-maps';
import { Polygon } from '@react-google-maps/api';

export interface Location {
	readonly latitude: number;
	readonly longitude: number;
	readonly place_id: string | null;
	readonly name: string | null;
	readonly formatted_address: string | null;
	readonly boundary: Polygon | null;
	readonly address_components: AddressComponent[] | null;
	readonly viewport: LatLngBounds | null;
}
