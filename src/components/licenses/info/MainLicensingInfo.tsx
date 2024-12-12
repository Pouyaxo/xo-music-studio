"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDataStore } from "@/lib/store/dataStore";
import { LicenseCard } from "./LicenseCard";
import { Shield, Zap, Headphones } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

export function MainLicensingInfo() {
  const licenses = useDataStore((state) => state.licenses);
  const error = useDataStore((state) => state.error.licenses);
  const fetchData = useDataStore((state) => state.fetchData);
  const [currentIndex, setCurrentIndex] = useState(2);
  const swiperRef = useRef<SwiperType>();

  useEffect(() => {
    fetchData("licenses");
  }, [fetchData]);

  const sortedLicenses = [...licenses].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-white hover:text-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-visible">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-90" />
      </div>

      <div className="relative justify-center items-center z-10 w-full max-w-[1800px] mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-white mb-4">Licensing Info</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect license for your needs and take your music to the
            next level
          </p>
        </div>

        <div className="w-full mb-12">
          <div className="licensing-container">
            <div className="w-full relative flex justify-center items-center">
              <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={5}
                initialSlide={2}
                spaceBetween={0}
                navigation={true}
                rewind={true}
                modules={[Navigation]}
                className="licensing-swiper"
                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {sortedLicenses.map((license, index) => (
                  <SwiperSlide
                    key={license.id}
                    className={`swiper-slide-licensing ${
                      index === currentIndex ? "swiper-slide-active" : ""
                    }`}
                  >
                    <LicenseCard
                      title={license.name.toUpperCase()}
                      price={
                        license.type === "exclusive"
                          ? "MAKE AN OFFER"
                          : `$${license.price.toFixed(2)}`
                      }
                      isPopular={license.is_featured}
                      features={[
                        `Included files: ${license.file_types.join(", ")}`,
                        license.distribution_limit
                          ? `Up to ${license.distribution_limit.toLocaleString()} copies`
                          : "Unlimited copies",
                        license.streaming_limit
                          ? `Up to ${license.streaming_limit.toLocaleString()} streams`
                          : "Unlimited streams",
                        license.music_video_limit
                          ? `${license.music_video_limit} music video${
                              license.music_video_limit > 1 ? "s" : ""
                            }`
                          : "Unlimited music videos",
                        license.radio_station_limit
                          ? `${license.radio_station_limit} radio station${
                              license.radio_station_limit > 1 ? "s" : ""
                            }`
                          : "Unlimited radio stations",
                      ]}
                      savings="BUY 2 TRACKS, GET 1 FREE!"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            All Licenses Include
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Quality Guarantee",
                description:
                  "Professional-grade audio files with pristine quality",
              },
              {
                icon: Zap,
                title: "Instant Access",
                description: "Download your files immediately after purchase",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description:
                  "Get help whenever you need it with our dedicated support",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-black p-8 rounded-xl border border-zinc-800 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent group-hover:from-white/10 group-hover:to-transparent rounded-xl transition-all duration-500" />
                <feature.icon className="w-12 h-12 text-white-500 mb-6" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLicensingInfo;
