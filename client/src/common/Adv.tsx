import Carousel from "@/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import React from "react";

const slides = [
  <div className="w-[100vw] h-[200px] bg-red-300">Slide 1</div>,
  <div className="w-[100vw] h-[200px] bg-blue-300">Slide 2</div>,
  <div className="w-[100vw] h-[200px] bg-green-300">Slide 3</div>,
];
function Adv() {
  return (
    <div className="hidden md:block">
      <div className="h-80 w-screen bg-black flex items-center justify-center flex-col">
        <Carousel
          slides={slides}
          plugins={[Autoplay(), Fade()]}
          options={{ loop: true }}
          className="w-screen h-[200px]"
        />
        {/* <Image
          src="/images/header/adv.png"
          alt="Advertisement"
          width={0}
          height={200}
          className="w-full h-[200px] object-cover"
          sizes="100vw"
          priority
        /> */}
        <p className="text-zinc-600 text-xs self-start mt-1 ml-15%">
          Advertisement
        </p>
      </div>
    </div>
  );
}

export default Adv;
