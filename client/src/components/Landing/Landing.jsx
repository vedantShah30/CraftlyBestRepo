import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Login/LogOut.tsx";
import { useUser } from "../../context/UserContext";

const getDistributedPosition = (index, total, width, height) => ({
  x: (width / total) * index + width / (2 * total),
  y: Math.random() * height * 0.6 + height * 0.2,
});

const getRandomDuration = () => Math.random() * 6 + 14;
const getRandomSize = () => `${Math.random() * 10 + 20}rem`;
const colors = ["#11CC72", "#A0CC11"];

const Landing = () => {
  const containerRef = useRef(null);
  const numCircles = 6;
  const [positions, setPositions] = useState([]);
  const navigate = useNavigate();
  const [lopen, setLopen] = useState(false);
  const dropdownRef = useRef(null);
  const hasInitialized = useRef(false);
  const { id } = useUser();

  useEffect(() => {
    if (!hasInitialized.current) {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setPositions(
          new Array(numCircles)
            .fill(0)
            .map((_, i) => getDistributedPosition(i, numCircles, width, height))
        );
        hasInitialized.current = true;
      }
    }

    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        setPositions((prevPositions) =>
          prevPositions.map((pos, i) => ({
            x: Math.min(pos.x, width),
            y: Math.min(pos.y, height),
          }))
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-40 bg-[#141414]"></div>
      <div className="absolute inset-0 -z-10 bg-[url('../public/images/Group16.png')] opacity-20 bg-cover"></div>
      <div
        className="absolute h-screen w-screen -z-30"
        style={{ backdropFilter: "blur(10px)" }}
      ></div>

      {positions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            x: [
              pos.x,
              Math.min(
                pos.x + (Math.random() * 400 + 1000),
                containerRef.current.clientWidth - 50
              ),
              pos.x,
            ],
            y: [
              pos.y,
              Math.min(
                pos.y + (Math.random() * 800 - 50),
                containerRef.current.clientHeight - 100
              ),
              pos.y,
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: getRandomDuration(),
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute rounded-full blur-3xl -z-20 opacity-70"
          style={{
            backgroundColor: colors[index % colors.length],
            width: getRandomSize(),
            height: getRandomSize(),
          }}
        />
      ))}

      <header className="w-full flex h-[120px] justify-between items-center py-[25px] px-20">
        <img src="/images/logo.png" alt="Logo" />
        <div className="flex space-x-4 rounded-full border border-gray-500">
          <div className="relative">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={(event) => {
                event.stopPropagation();
                setLopen((prev) => !prev);
              }}
            >
              <path
                d="M30.6163 16.3187C30.6163 19.8473 27.7558 22.7077 24.2272 22.7077C20.6987 22.7077 17.8382 19.8473 17.8382 16.3187C17.8382 12.7901 20.6987 9.92969 24.2272 9.92969C27.7558 9.92969 30.6163 12.7901 30.6163 16.3187Z"
                stroke="white"
                strokeWidth="1.45714"
              />
              <path
                d="M24.2272 37.6154C30.5561 37.6154 34.2023 35.9829 35.8938 34.9322C36.6853 34.4405 37.0754 33.5352 36.9949 32.5974C36.885 31.3166 36.4374 30.0374 35.9818 29.0227C35.3835 27.6905 33.9987 26.967 32.5382 26.967H15.9162C14.4558 26.967 13.0709 27.6905 12.4727 29.0227C12.017 30.0374 11.5695 31.3166 11.4596 32.5974C11.3791 33.5352 11.7692 34.4405 12.5607 34.9322C14.2521 35.9829 17.8984 37.6154 24.2272 37.6154Z"
                stroke="white"
                strokeWidth="1.45714"
              />
            </svg>
            {lopen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-4 bg-[#1E1E1E] border border-gray-700 px-4 py-2 shadow-lg rounded-lg z-50"
              >
                {id ? (
                  <Logout />
                ) : (
                  <button className="" onClick={() => navigate("/login")}>
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="w-full flex flex-col items-center justify-center flex-grow pt-8">
        <div className="flex flex-col text-center max-w-4xl mx-auto">
          <h1 className="text-[46px] font-dmSans leading-tight font-bold">
            Transform Your Ideas into Stunning Websites Instantly
          </h1>
          <h3 className="mt-4 mb-8 text-lg font-dmSans font-semibold">
            Get your responsive website in just 3 steps.{" "}
            <span className="text-[#f2b635]"> No coding required.</span>
          </h3>
          <div className="flex justify-center">
            <img
              src="/images/Landing.png"
              className="max-w-[100%] h-[15rem]"
              alt="Landing"
            />
          </div>
          <button
            className="mt-3 px-8 py-3 bg-white text-black text-sm hover:bg-gray-100 rounded-full max-w-fit mx-auto font-dmSans font-semibold"
            onClick={() => (id ? navigate("/home") : navigate("/login"))}
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
};

export default Landing;
