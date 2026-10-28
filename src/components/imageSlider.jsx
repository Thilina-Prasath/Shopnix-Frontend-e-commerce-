import { useState } from "react";

export default function ImageSlider(props) {
  const images = props.images; // images arry tik kiyw gnn
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full max-w-[500px] md:w-[500px]">
      {" "}
      {/* image size ek */}
      <img
        src={images[currentIndex]}
        className="w-full h-64 sm:h-80 md:h-[500px] object-cover rounded-2xl sm:rounded-3xl"
      />
      <div className="w-full mt-2 sm:mt-0 h-auto sm:h-[100px] flex justify-center items-center gap-1.5 sm:gap-0 overflow-x-auto scrollbar-hide py-2">
        {images?.map((image, index) => {
          return (
            <img
              key={index}
              className={
                "w-14 h-14 sm:w-[90px] sm:h-[90px] m-1 sm:m-2 rounded-xl sm:rounded-2xl object-cover cursor-pointer hover:border-4 hover:border-accent shrink-0 " +
                (index == currentIndex && "border-accent border-4")
              }
              src={image}
              onClick={() => {
                setCurrentIndex(index); // images athr maru wenn plwn
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
