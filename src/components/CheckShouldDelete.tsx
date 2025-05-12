import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure
} from '@heroui/react';
import { DeleteDocumentBulkIcon } from '@heroui/shared-icons';
import clsx from 'clsx';
import React from 'react';

const iconClasses =
	'text-2xl text-default-500 pointer-events-none flex-shrink-0';

interface CheckShouldDeleteProps {
	onConfirm: () => void;
	children: React.ReactNode;
}

export default function CheckShouldDelete({
	onConfirm,
	children
}: CheckShouldDeleteProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<>
			<Button
				onPress={onOpen}
				color="danger"
				variant="flat"
				startContent={
					<DeleteDocumentBulkIcon
						className={clsx(iconClasses, '!text-danger')}
					/>
				}
			>
				{children}
			</Button>
			<Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Confirm Deletion
							</ModalHeader>
							<ModalBody>
								<p>
									Are you sure you want to delete this? This
									action cannot be undone.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="default"
									variant="light"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button color="danger" onPress={handleConfirm}>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
