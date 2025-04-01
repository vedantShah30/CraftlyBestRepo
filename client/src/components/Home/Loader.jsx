import { motion } from "framer-motion";

const getRandomPosition = (maxWidth, maxHeight) => ({
  x: Math.random() * maxWidth,
  y: Math.random() * maxHeight,
});

const getRandomDuration = () => Math.random() * 3 + 6;
const getRandomSize = () => `${Math.random() * 10 + 20}rem`;
const colors = ["#11CC72", "#A0CC11"];

const Loader = () => {
  const numCircles = 6;
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const positions = new Array(numCircles).fill(0).map(() =>
    getRandomPosition(containerWidth, containerHeight)
  );

  return (
    <div className="fixed h-screen w-screen bg-black opacity-50 z-40 flex items-center justify-center">
      <div className="absolute inset-0 -z-40 bg-[#141414]"></div>
      <div
        className="absolute inset-0 -z-20"
        style={{ backdropFilter: "blur(50px)" }}
      ></div>
      {positions.map((pos, index) => (
        <motion.div
          key={index}
          initial={{ x: pos.x, y: pos.y }}
          animate={{
            x: [
              pos.x,
              Math.min(pos.x + (Math.random() * 400 + 1000), containerWidth - 50),
              pos.x,
            ],
            y: [
              pos.y,
              Math.min(pos.y + (Math.random() * 800 - 50), containerHeight - 100),
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
    </div>
  );
};

export default Loader;
