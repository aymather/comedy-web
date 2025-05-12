import { serviceApi } from '../base';
import { CreateArtistBodyDto, CreateArtistResponseDto } from './dto/create.dto';
import {
	DeleteArtistParamsDto,
	DeleteArtistResponseDto
} from './dto/delete.dto';
import {
	FindOneArtistParamsDto,
	FindOneArtistResponseDto
} from './dto/find-one.dto';
import {
	UpdateArtistBodyDto,
	UpdateArtistParamsDto,
	UpdateArtistResponseDto
} from './dto/update.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		findOneArtist: builder.query<
			FindOneArtistResponseDto,
			{
				params: FindOneArtistParamsDto;
			}
		>({
			query: ({ params }) => ({
				url: `/artist/${params.artist_uid}`,
				method: 'GET'
			}),
			providesTags: (result, error, { params }) => [
				{ type: 'Artist', id: params.artist_uid }
			]
		}),
		createArtist: builder.mutation<
			CreateArtistResponseDto,
			{
				body: CreateArtistBodyDto;
			}
		>({
			query: ({ body }) => ({
				url: '/artist',
				method: 'POST',
				body
			}),
			invalidatesTags: ['SearchArtists']
		}),
		deleteArtist: builder.mutation<
			DeleteArtistResponseDto,
			{
				params: DeleteArtistParamsDto;
			}
		>({
			query: ({ params }) => ({
				url: `/artist/${params.artist_uid}`,
				method: 'DELETE'
			})
		}),
		updateArtist: builder.mutation<
			UpdateArtistResponseDto,
			{
				params: UpdateArtistParamsDto;
				body: UpdateArtistBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/artist/${params.artist_uid}`,
				method: 'PUT',
				body
			})
		})
	})
});
