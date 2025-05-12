import { hostApiSlice } from '@/flux/api/host';
import { roomApiSlice } from '@/flux/api/room';
import { venueApiSlice } from '@/flux/api/venue';
import { NanoId } from '@/types';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';

interface HostBreadcrumbsProps {
	host_uid?: NanoId;
	venue_uid?: NanoId;
	room_uid?: NanoId;
}

const HostBreadcrumbs: React.FC<HostBreadcrumbsProps> = ({
	host_uid,
	venue_uid,
	room_uid
}) => {
	const { data: hostData } = hostApiSlice.useFindOneHostQuery(
		{
			params: {
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !host_uid
		}
	);

	const { data: venueData } = venueApiSlice.useFindOneVenueQuery(
		{
			params: {
				venue_uid: venue_uid ?? '',
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !venue_uid || !host_uid
		}
	);

	const { data: roomData } = roomApiSlice.useFindOneRoomQuery(
		{
			params: {
				room_uid: room_uid ?? '',
				venue_uid: venue_uid ?? '',
				host_uid: host_uid ?? ''
			}
		},
		{
			skip: !room_uid || !venue_uid || !host_uid
		}
	);

	return (
		<Breadcrumbs underline="active" className="py-4">
			<BreadcrumbItem key="hosts" href="/dashboard">
				Hosts
			</BreadcrumbItem>
			{host_uid && hostData?.name && (
				<BreadcrumbItem key="host" href={`/host/${host_uid}`}>
					{hostData.name}
				</BreadcrumbItem>
			)}
			{venue_uid && venueData?.name && (
				<BreadcrumbItem
					key="venue"
					href={`/host/${host_uid}/venue/${venue_uid}`}
				>
					{venueData.name}
				</BreadcrumbItem>
			)}
			{room_uid && roomData?.name && (
				<BreadcrumbItem key="room" isCurrent>
					{roomData.name}
				</BreadcrumbItem>
			)}
		</Breadcrumbs>
	);
};

export default HostBreadcrumbs;
