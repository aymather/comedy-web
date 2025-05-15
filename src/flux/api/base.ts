import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serviceApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_URL,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	}),
	reducerPath: 'serviceApi',
	tagTypes: [
		'Host',
		'Venue',
		'Room',
		'Event',
		'Revision',
		'Artist',
		'SearchArtists',
		'SearchVenues'
	],
	endpoints: () => ({})
});
