import { Event } from '@/flux/api/event';
import { VenueImageTag } from '@/flux/api/venue-image/types';
import { Venue } from '@/flux/api/venue/venue.entity';

interface IUseEventImagePriority {
	imagePriorityForEvent: (event?: Event) => string[] | null | undefined;
	imagePriorityForVenue: (venue?: Venue) => string[] | null | undefined;
}

const useEventImagePriority = (): IUseEventImagePriority => {
	/**
	 * The only purpose of this is to be able to easily determine how to
	 * present images on a carousel in priority order.
	 */
	const imagePriorityForEvent = (
		event?: Event
	): string[] | null | undefined => {
		/**
		 * Priority list
		 *  1. Event image
		 *  2. Room profile image (picture of the room)
		 *  3. Venue profile image (venue exterior)
		 *  4. Miscellaneous images (VenueImageTag)
		 *      - Other
		 *      - Menu
		 */
		if (!event) {
			return undefined;
		}

		const images = [];

		if (event.image_url) {
			images.push(event.image_url);
		}

		if (event.room?.profile_image_url) {
			images.push(event.room.profile_image_url);
		}

		if (event.venue?.profile_image_url) {
			images.push(event.venue.profile_image_url);
		}

		if (event.venue?.images) {
			for (const image of event.venue.images) {
				if (image.tag === VenueImageTag.OTHER) {
					images.push(image.url);
				}
			}

			for (const image of event.venue.images) {
				if (image.tag === VenueImageTag.MENU) {
					images.push(image.url);
				}
			}
		}

		if (images?.length > 0) {
			return images;
		}

		return null;
	};

	const imagePriorityForVenue = (
		venue?: Venue
	): string[] | null | undefined => {
		/**
		 * Priority list
		 *  1. Venue profile image (venue exterior)
		 *  2. All rooms' profile images
		 *  3. Miscellaneous images (VenueImageTag)
		 *      - Other
		 *      - Menu
		 */
		if (!venue) {
			return undefined;
		}

		const images = [];

		if (venue.rooms) {
			for (const room of venue.rooms) {
				if (room.profile_image_url) {
					images.push(room.profile_image_url);
				}
			}
		}

		if (venue.profile_image_url) {
			images.push(venue.profile_image_url);
		}

		if (venue.images) {
			for (const image of venue.images) {
				if (image.tag === VenueImageTag.OTHER) {
					images.push(image.url);
				}
			}

			for (const image of venue.images) {
				if (image.tag === VenueImageTag.MENU) {
					images.push(image.url);
				}
			}
		}

		if (images?.length > 0) {
			return images;
		}

		return null;
	};

	return {
		imagePriorityForEvent,
		imagePriorityForVenue
	};
};

export default useEventImagePriority;
