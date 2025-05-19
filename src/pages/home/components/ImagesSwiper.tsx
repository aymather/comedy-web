import { EventIcon } from '@/components/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';

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
				<div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
					<EventIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
				</div>
			)}
			{image ? (
				<img
					alt=""
					className="absolute inset-0 object-contain w-full h-full"
					src={image || ''}
				/>
			) : (
				<div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
					<EventIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
				</div>
			)}
		</div>
	);
};

const ImagesSwiper = ({ images }: { images: string[] }) => {
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>();
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef<SwiperRef>(null);

	return (
		<div className="w-full h-full justify-center items-center relative">
			{/* Swiper navigation arrows */}
			<button
				type="button"
				className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 dark:bg-black/40 dark:text-white"
				aria-label="Previous image"
				onClick={(e) => {
					e.stopPropagation();
					swiperInstance?.slidePrev();
				}}
			>
				<ChevronLeft size={24} />
			</button>
			<button
				type="button"
				className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 dark:bg-black/40 dark:text-white"
				aria-label="Next image"
				onClick={(e) => {
					e.stopPropagation();
					swiperInstance?.slideNext();
				}}
			>
				<ChevronRight size={24} />
			</button>
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
			{/* Slide indicator */}
			<div className="absolute bottom-2 right-4 bg-black/50 text-white text-xs rounded-md px-2 py-1 z-50 backdrop-blur-sm">
				{activeIndex + 1} / {images.length}
			</div>
		</div>
	);
};

export default ImagesSwiper;
