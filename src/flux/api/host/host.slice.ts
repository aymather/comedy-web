import { serviceApi } from '../base';
import { FindAllHostsResponseDto } from './dto/host-find-all.dto';
import {
	FindOneHostParamsDto,
	FindOneHostResponseDto
} from './dto/host-find-one.dto';
import {
	UpdateHostBodyDto,
	UpdateHostParamsDto,
	UpdateHostResponseDto
} from './dto/host-update.dto';

export default serviceApi.injectEndpoints({
	endpoints: (builder) => ({
		findAllHosts: builder.query<FindAllHostsResponseDto, void>({
			query: () => ({
				url: '/host',
				method: 'GET'
			})
		}),
		findOneHost: builder.query<
			FindOneHostResponseDto,
			{
				params: FindOneHostParamsDto;
			}
		>({
			query: ({ params }) => ({
				url: `/host/${params.host_uid}`,
				method: 'GET'
			}),
			providesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid }
			]
		}),
		updateHost: builder.mutation<
			UpdateHostResponseDto,
			{
				params: UpdateHostParamsDto;
				body: UpdateHostBodyDto;
			}
		>({
			query: ({ params, body }) => ({
				url: `/host/${params.host_uid}`,
				method: 'PUT',
				body
			}),
			invalidatesTags: (result, error, { params }) => [
				{ type: 'Host', id: params.host_uid }
			]
		})
	})
});
