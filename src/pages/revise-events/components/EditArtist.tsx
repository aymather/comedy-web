import { artistApiSlice } from '@/flux/api/artist';
import { Artist } from '@/flux/api/artist/artist.entity';
import {
	addToast,
	Button,
	Form,
	Input,
	Kbd,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	User
} from '@heroui/react';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface EditArtistProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	artist: Artist;
	onUpdate: () => void;
}

const EditArtist = ({
	isOpen,
	onOpenChange,
	artist,
	onUpdate
}: EditArtistProps) => {
	const [updateArtistMutation] = artistApiSlice.useUpdateArtistMutation();

	const [formData, setFormData] = useState({
		name: artist.name,
		profile_image_url: artist.profile_image_url || ''
	});

	const openGoogleImages = () => {
		window.open(
			`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
				`${formData.name} profile image comedian`
			)}`,
			'_blank'
		);
	};

	useHotkeys('meta+shift+comma', () => openGoogleImages());
	useHotkeys('enter', () => handleSubmit(), {
		enableOnFormTags: true,
		preventDefault: true
	});

	const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault();

		try {
			await updateArtistMutation({
				params: {
					artist_uid: artist.artist_uid
				},
				body: formData
			}).unwrap();

			onOpenChange(false);
			onUpdate();

			addToast({
				title: 'Artist updated',
				description: 'Artist updated successfully',
				variant: 'solid',
				color: 'success'
			});
		} catch (error) {
			addToast({
				title: 'Error updating artist',
				description: 'Please try again',
				variant: 'solid',
				color: 'danger'
			});
		}
	};

	const handleReset = () => {
		setFormData({
			name: artist.name,
			profile_image_url: artist.profile_image_url || ''
		});
		onOpenChange(false);
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<Form
					className="w-full flex flex-col items-center gap-6 p-6"
					style={{ minWidth: 350 }}
					onSubmit={handleSubmit}
					onReset={handleReset}
				>
					<ModalHeader className="w-full text-center">
						Edit Artist
					</ModalHeader>
					<ModalBody className="w-full flex flex-col items-center gap-4">
						<User
							avatarProps={{
								src: formData.profile_image_url || undefined,
								className: 'w-20 h-20'
							}}
							name={null}
						/>
						<Button
							variant="flat"
							className="mb-2"
							onPress={() => openGoogleImages()}
						>
							Search Google Images
							<Kbd keys={['command', 'shift']}>,</Kbd>
						</Button>
						<div className="w-full flex flex-col gap-4">
							<Input
								isRequired
								label="Name"
								labelPlacement="outside"
								name="name"
								placeholder="Enter artist name"
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										name: e.target.value
									}))
								}
							/>

							<Input
								label="Profile Image URL"
								labelPlacement="outside"
								name="profile_image_url"
								placeholder="Enter profile image URL"
								type="url"
								value={formData.profile_image_url}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										profile_image_url: e.target.value
									}))
								}
							/>
						</div>
					</ModalBody>
					<ModalFooter className="w-full flex justify-center gap-2">
						<Button type="reset" variant="flat">
							Cancel
						</Button>
						<Button color="primary" type="submit">
							Save
						</Button>
					</ModalFooter>
				</Form>
			</ModalContent>
		</Modal>
	);
};

export default EditArtist;
