import { serviceApi } from '../base';
import {
	SearchArtistsQueryDto,
	SearchArtistsResponseDto
} from './dto/search-artists.dto';

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
		})
	})
});
