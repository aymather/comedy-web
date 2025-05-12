import { artistApiSlice } from '@/flux/api/artist';
import { Artist } from '@/flux/api/artist/artist.entity';
import { searchApiSlice } from '@/flux/api/search';
import {
	Button,
	Card,
	CardBody,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	User
} from '@heroui/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface SearchAndSelectArtistProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onSelect: (artist: Artist) => void;
	eventName: string;
	eventImageUrl?: string;
	onEditArtist?: (artist: Artist) => void;
}

const SearchAndSelectArtist: React.FC<SearchAndSelectArtistProps> = ({
	isOpen,
	onOpenChange,
	onSelect,
	eventName,
	eventImageUrl,
	onEditArtist
}) => {
	const [searchQuery, setSearchQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const [createArtistMutation] = artistApiSlice.useCreateArtistMutation();
	const { data: searchArtists } = searchApiSlice.useSearchArtistsQuery(
		{
			query: {
				q: searchQuery
			}
		},
		{
			skip: !searchQuery
		}
	);

	useHotkeys('enter', () => handleCreateArtist(), {
		enableOnFormTags: true,
		preventDefault: true
	});

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleSelect = (artist: Artist) => {
		onSelect(artist);
		onOpenChange(false);
		setSearchQuery('');
	};

	const [isCreating, setIsCreating] = useState(false);

	const handleCreateArtist = async () => {
		if (!searchQuery) return;
		setIsCreating(true);
		try {
			const newArtist = await createArtistMutation({
				body: {
					name: searchQuery
				}
			}).unwrap();

			handleSelect(newArtist);

			// First close the search modal
			onOpenChange(false);
			setSearchQuery('');

			// Then trigger the edit modal for the new artist
			if (onEditArtist) {
				onEditArtist(newArtist);
			}
		} catch (e) {
			// Optionally handle error
		} finally {
			setIsCreating(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			setSearchQuery('');
			inputRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalBody className="flex flex-col p-6">
							{/* Header */}
							<div className="px-8">
								<ModalHeader className="flex flex-col gap-1 p-0">
									Search and Select Artist
								</ModalHeader>
							</div>
							<div className="flex flex-1 min-h-0 gap-6 w-full">
								{/* Left: Event Image */}
								<div className="flex-1 flex items-center justify-center min-w-0 py-6">
									{eventImageUrl ? (
										<img
											src={eventImageUrl}
											alt={eventName}
											className="w-full h-full object-contain rounded-lg shadow-lg border border-neutral-700 max-h-full max-w-full"
										/>
									) : null}
								</div>
								{/* Right: Details and Search */}
								<div className="flex-1 flex flex-col py-6 min-w-0">
									<h4 className="text-xl font-semibold mb-4">
										{eventName}
									</h4>
									<Input
										ref={inputRef}
										placeholder="Search artists..."
										value={searchQuery}
										onChange={(e) =>
											handleSearch(e.target.value)
										}
										isClearable
										onClear={() => setSearchQuery('')}
										startContent={
											<Search
												className="text-default-400"
												size={16}
											/>
										}
										className="mb-4"
									/>
									<Button
										fullWidth
										color="primary"
										isLoading={isCreating}
										onPress={handleCreateArtist}
										className="mb-2"
										isDisabled={!searchQuery}
									>
										Create new artist: &quot;{searchQuery}
										&quot;
									</Button>
									<div className="space-y-2 overflow-y-auto h-[12rem]">
										{searchArtists?.hits &&
										searchArtists.hits.length > 0 ? (
											searchArtists.hits.map(
												(artist: any) => (
													<Card
														key={
															artist.id ||
															artist.artist_uid
														}
														isPressable
														onPress={() =>
															handleSelect({
																artist_uid:
																	artist.artist_uid,
																name: artist.name,
																profile_image_url:
																	artist.profile_image_url
															})
														}
														className="hover:bg-default-100"
													>
														<CardBody>
															<User
																name={
																	artist.name
																}
																avatarProps={{
																	src: artist.profile_image_url
																}}
																className="text-default-900 dark:text-white"
															/>
														</CardBody>
													</Card>
												)
											)
										) : (
											<div className="text-default-400 italic text-center">
												No artists found.
											</div>
										)}
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Cancel
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default SearchAndSelectArtist;
