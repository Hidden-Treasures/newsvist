import React, { FC, useCallback, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

type CarouselProps = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  className?: string;
};

const Carousel: FC<CarouselProps> = ({
  slides,
  options,
  plugins = [],
  className = "",
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className={`overflow-hidden ${className}`} ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0 px-2">
            {slide}
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      {/* <div className="flex justify-center mt-4 gap-2">
    {slides.map((_, index) => (
      <button
        key={index}
        className={`w-2 h-2 rounded-full transition-colors ${
          index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
        }`}
        onClick={() => emblaApi?.scrollTo(index)}
      />
    ))}
  </div> */}
    </div>
  );
};

export default Carousel;
