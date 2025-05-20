import { EventIcon } from '@/components/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';

const DefaultEventImage = () => (
	<div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
		<EventIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
	</div>
);

const Image = ({ image }: { image?: string | null }) => {
	return (
		<div className="w-full h-full relative overflow-hidden">
			{image ? (
				<img
					alt=""
					className="absolute inset-0 object-cover blur-xl scale-110 w-full h-full"
					src={image || ''}
				/>
			) : (
				<DefaultEventImage />
			)}
			{image ? (
				<img
					alt=""
					className="absolute inset-0 object-contain w-full h-full"
					src={image || ''}
				/>
			) : (
				<DefaultEventImage />
			)}
		</div>
	);
};

const ImagesSwiper = ({ images }: { images: string[] | null | undefined }) => {
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>();
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef<SwiperRef>(null);

	return (
		<div className="w-full h-full justify-center items-center relative">
			{/* Swiper navigation arrows */}
			{images && images.length > 1 && (
				<>
					<button
						type="button"
						className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 dark:bg-black/40 dark:text-white ${
							activeIndex === 0
								? 'opacity-50 cursor-not-allowed'
								: ''
						}`}
						aria-label="Previous image"
						onClick={(e) => {
							e.stopPropagation();
							swiperInstance?.slidePrev();
						}}
						disabled={activeIndex === 0}
					>
						<ChevronLeft size={24} />
					</button>
					<button
						type="button"
						className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 dark:bg-black/40 dark:text-white ${
							activeIndex === images.length - 1
								? 'opacity-50 cursor-not-allowed'
								: ''
						}`}
						aria-label="Next image"
						onClick={(e) => {
							e.stopPropagation();
							swiperInstance?.slideNext();
						}}
						disabled={activeIndex === images.length - 1}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
			{images && images.length > 0 ? (
				<Swiper
					spaceBetween={1}
					slidesPerView={1}
					onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
					className="w-full h-full"
					onSwiper={setSwiperInstance}
					ref={swiperRef}
				>
					{images.map((i) => (
						<SwiperSlide
							key={`${i}-${Math.random()}`}
							className="overflow-hidden h-full w-full"
						>
							<Image image={i} />
						</SwiperSlide>
					))}
				</Swiper>
			) : (
				<DefaultEventImage />
			)}
			{/* Slide indicator */}
			{images && images.length > 1 && (
				<div className="absolute bottom-2 right-4 bg-black/50 text-white text-xs rounded-md px-2 py-1 z-50 backdrop-blur-sm">
					{activeIndex + 1} / {images.length}
				</div>
			)}
		</div>
	);
};

export default ImagesSwiper;
