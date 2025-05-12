import { googleMapsApiSlice } from '@/flux/api/google-maps';
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure
} from '@heroui/react';
import { useState } from 'react';

// Define the shape of a place result (matches API response)
type PlaceResult = {
	place_id: string;
	description: string;
	main_text: string;
	secondary_text: string;
};

interface SearchAndSelectPlaceIdProps {
	onSelect: (place: PlaceResult) => void;
	buttonText?: string;
}

const SearchAndSelectPlaceId = ({
	onSelect,
	buttonText = 'Search Place'
}: SearchAndSelectPlaceIdProps) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [search, setSearch] = useState('');

	const {
		data: results = [],
		isFetching,
		error
	} = googleMapsApiSlice.useAutocompletePlaceQuery(
		search.trim()
			? { body: { searchText: search } }
			: { body: { searchText: '' } },
		{ skip: !search.trim() }
	);

	const onClear = () => {
		setSearch('');
	};

	return (
		<>
			<Button onPress={onOpen}>{buttonText}</Button>
			<Modal
				backdrop="opaque"
				isOpen={isOpen}
				radius="lg"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Search and Select Place
							</ModalHeader>
							<ModalBody>
								<Input
									isClearable
									onClear={onClear}
									placeholder="Search for a place..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
								{/* {isFetching && <Spinner className="mt-4" />} */}
								{error && (
									<div className="text-danger mt-2">
										Failed to fetch places
									</div>
								)}
								<div className="mt-4 max-h-64 overflow-y-auto">
									{results.length === 0 &&
										!isFetching &&
										!error &&
										search && (
											<div className="text-center">
												No results
											</div>
										)}
									{results.map((result) => (
										<Button
											key={result.place_id}
											variant="light"
											className="w-full justify-start mb-2 text-left"
											onPress={() => {
												onSelect(result);
												onClear();
												onClose();
											}}
										>
											<div>
												<div className="font-medium">
													{result.main_text ||
														result.description}
												</div>
												{result.secondary_text && (
													<div className="text-xs">
														{result.secondary_text}
													</div>
												)}
											</div>
										</Button>
									))}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									onPress={() => {
										onClear();
										onClose();
									}}
								>
									Cancel
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SearchAndSelectPlaceId;
