import { GoogleMapsAutocompleteResult } from './autocomplete-result.dto';

export interface AutocompletePlaceBodyDto {
	searchText: string;
}

export interface AutocompletePlaceResponseDto
	extends Array<GoogleMapsAutocompleteResult> {}
