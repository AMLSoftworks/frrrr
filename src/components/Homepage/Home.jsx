"use client";
import { homePageData } from "@/services/dataAPI";
import React from "react";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import SongCard from "./SongCard";
import { useDispatch, useSelector } from "react-redux";
import SwiperLayout from "./Swiper";
import { setProgress } from "@/redux/features/loadingBarSlice";
import SongCardSkeleton from "./SongCardSkeleton";
import { GiMusicalNotes } from "react-icons/gi";
import SongBar from "./SongBar";
import OnlineStatus from "./OnlineStatus";
import ListenAgain from "./ListenAgain";
import { getUserInfo } from "@/services/dataAPI";

const Home = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User"); // Default name as 'User'
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { languages } = useSelector((state) => state.languages);

  // Salutation
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let salutation = "";
  if (currentHour >= 5 && currentHour < 12) {
    salutation = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    salutation = "Good Afternoon";
  } else if (currentHour >= 18 && currentHour < 20) {
    salutation = "Good Evening";
  } else {
    salutation = "Good Night";
  }

  // Fetch user info for the name
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserInfo();
        setUserName(res?.userName || "User"); // Fallback to "User" if username isn't available
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setProgress(70));
      const res = await homePageData(languages);
      setData(res);
      dispatch(setProgress(100));
      setLoading(false);
    };
    fetchData();
  }, [languages]);

  return (
    <div>
      <OnlineStatus />
      <h1 className="text-4xl font-bold mx-2 m-9 text-white flex gap-2">
        " {salutation}, {userName} " <GiMusicalNotes />
      </h1>

      <ListenAgain />

      {/* trending */}
      <SwiperLayout title={"Trending"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          <>
            {data?.trending?.songs?.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
              </SwiperSlide>
            ))}

            {data?.trending?.albums?.map((song) => (
              <SwiperSlide key={song?.id}>
                <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
              </SwiperSlide>
            ))}
          </>
        )}
      </SwiperLayout>

      {/* top charts */}
      <div className="my-4 lg:mt-14">
        <h2 className="text-white mt-4 text-2xl lg:text-3xl font-semibold mb-4">Top Charts</h2>
        <div className="grid lg:grid-cols-2 gap-x-10 max-h-96 lg:max-h-full lg:overflow-y-auto overflow-y-scroll">
          {loading ? (
            <div className="w-[90vw] overflow-x-hidden">
              <SongCardSkeleton />
            </div>
          ) : (
            data?.charts?.slice(0, 10)?.map((playlist, index) => (
              <SongBar key={playlist?.id} playlist={playlist} i={index} />
            ))
          )}
        </div>
      </div>

      {/* New Releases */}
      <SwiperLayout title={"New Releases"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          data?.albums?.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
            </SwiperSlide>
          ))
        )}
      </SwiperLayout>

      {/* featured playlists */}
      <SwiperLayout title={"Featured Playlists"}>
        {loading ? (
          <SongCardSkeleton />
        ) : (
          data?.playlists?.map((song) => (
            <SwiperSlide key={song?.id}>
              <SongCard key={song?.id} song={song} activeSong={activeSong} isPlaying={isPlaying} />
            </SwiperSlide>
              )
            )
          )
        }
      </SwiperLayout>

    </div>
  );
};

export default Home;
