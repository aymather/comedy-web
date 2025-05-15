import { serviceApi } from '../base';
import {
	SearchArtistsQueryDto,
	SearchArtistsResponseDto
} from './dto/search-artists.dto';
import {
	SearchVenuesQueryDto,
	SearchVenuesResponseDto
} from './dto/search-venues.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		searchArtists: builder.query<
			SearchArtistsResponseDto,
			{
				query: SearchArtistsQueryDto;
			}
		>({
			query: ({ query }) => ({
				url: '/search/artists',
				method: 'GET',
				params: query
			}),
			providesTags: ['SearchArtists']
		}),
		searchVenues: builder.query<
			SearchVenuesResponseDto,
			{
				query: SearchVenuesQueryDto;
			}
		>({
			query: ({ query }) => ({
				url: '/search/venues',
				method: 'GET',
				params: query
			}),
			providesTags: ['SearchVenues']
		})
	})
});
