/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type RaffleImageProps = {
  size?: "sm" | "lg";
  hideDetails?: boolean;
  link?: string;
  imageSrc: string[];
};

function RaffleImage(props: RaffleImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <>
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {props.imageSrc.map((src) => {
            return (
              <CarouselItem key={src}>
                <img
                  className={clsx(
                    "object-cover w-full",
                    "max-w-full",
                    "height: auto",
                    "border border-primary",
                    props.link !== "" && "cursor-pointer",
                    !props.hideDetails && "rounded-lg",
                    props.hideDetails && "rounded-lg",
                    (!props.size || props.size === "sm") && "h-80",
                    props.size && props.size === "lg" && "h-[500px]"
                  )}
                  src={src}
                  //TODO: change this later to something meaningfull
                  alt={src}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {props.imageSrc.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </>
  );
}

export default RaffleImage;
