import { SearchIcon } from '@/components/icons';
import { VenueSearchItem } from '@/flux/api/search/dto/search-venues.dto';
import searchSlice from '@/flux/api/search/search.slice';
import { Kbd } from '@heroui/kbd';
import {
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader
} from '@heroui/react';
import { ChevronRight, MapPin } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect?: (result: VenueSearchItem) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
	isOpen,
	onClose,
	onSelect
}) => {
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState(0); // start at first result
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: searchVenues } = searchSlice.useSearchVenuesQuery(
		{ query: { q: query } },
		{ skip: !query }
	);

	const results = searchVenues?.hits || [];

	useEffect(() => {
		if (isOpen) {
			setQuery('');
			setSelected(0);
			setTimeout(() => inputRef.current?.focus(), 10);
		}
	}, [isOpen]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === 'Escape') {
				onClose();
			} else if (e.key === 'ArrowDown') {
				let next = selected + 1;
				if (next < results.length) setSelected(next);
				e.preventDefault();
			} else if (e.key === 'ArrowUp') {
				let prev = selected - 1;
				if (prev >= 0) setSelected(prev);
				e.preventDefault();
			} else if (e.key === 'Enter') {
				const item = results[selected];
				if (item) {
					onSelect?.(item);
					onClose();
				}
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [isOpen, results, selected, onClose, onSelect]);

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onClose}
			placement="top-center"
			hideCloseButton
		>
			<ModalContent>
				{(onModalClose) => (
					<>
						<ModalHeader>
							<Input
								ref={inputRef}
								className="w-full rounded-lg text-base placeholder:text-[#6c6c81] outline-none focus:ring-2 focus:ring-[#2563eb]"
								placeholder="Search venues"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								startContent={
									<SearchIcon className="text-[#6c6c81] text-lg" />
								}
								endContent={<Kbd key={'esc'}>esc</Kbd>}
							/>
						</ModalHeader>
						<ModalBody>
							<div>
								{results.length === 0 && query && (
									<div className="text-center text-[#6c6c81] py-8">
										No results found.
									</div>
								)}
								{results.slice(0, 3).map((item, i) => (
									<button
										key={item.venue_uid}
										type="button"
										tabIndex={0}
										className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors select-none text-left focus:outline-none focus:ring-2 focus:ring-[#2563eb] group ${
											i === selected
												? 'bg-[#2563eb] text-white'
												: 'text-[#a8b0d3] hover:bg-[#2563eb1A] dark:hover:bg-[#232336]'
										} `}
										onMouseEnter={() => setSelected(i)}
										onClick={() => {
											onSelect?.(item);
											onClose();
										}}
									>
										<MapPin
											size={20}
											className={
												i === selected
													? 'text-white'
													: 'text-default-500'
											}
										/>
										<span className="flex-1">
											{item.name}
										</span>
										<span
											className={`transition-opacity ${i === selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
										>
											<ChevronRight
												size={16}
												className="text-gray-400"
											/>
										</span>
									</button>
								))}
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default SearchModal;
