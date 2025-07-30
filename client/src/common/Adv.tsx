import Carousel from "@/components/carousel";
import getDateString from "@/hooks/useDateString";
import { useNewsAds } from "@/hooks/useNews";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import React from "react";

function Adv() {
  const { data: ads = [], isPending } = useNewsAds();

  const slides = ads?.map((ad: any, i: number) => (
    <div
      key={i}
      className="w-[100vw] h-[200px] relative overflow-hidden cursor-pointer"
      onClick={() =>
        window.open(
          `${getDateString(ad?.createdAt)}/${ad?.newsCategory}/${ad?.slug}`,
          "_blank"
        )
      }
    >
      <Image
        src={ad?.file?.url}
        alt={ad?.title}
        className={
          "w-full h-full object-cover transition-transform transform group-hover:scale-100 hover:opacity-50"
        }
        fill
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-semibold">{ad?.title}</h3>
        <div
          className="text-sm line-clamp-2"
          dangerouslySetInnerHTML={{ __html: ad?.editorText || "" }}
        />
      </div>
    </div>
  ));

  return (
    <div className="hidden md:block">
      <div className="h-80 w-screen bg-black flex items-center justify-center flex-col">
        {slides?.length > 0 && (
          <Carousel
            slides={slides}
            plugins={[Autoplay(), Fade()]}
            options={{ loop: true }}
            className="w-screen h-[200px]"
          />
        )}

        <p className="text-zinc-600 text-xs self-start mt-1 ml-15%">
          Advertisement
        </p>
      </div>
    </div>
  );
}

export default Adv;
