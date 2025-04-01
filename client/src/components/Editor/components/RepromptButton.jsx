import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { updateChat } from "../../../utils/code";
import * as React from "react";

export default function RepromptButton({ editorInstance, setLoading }) {
  const { id } = useParams();
  const [state, setState] = useState("normal");
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setState("normal");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const html = editorInstance.getHtml();
      const css = editorInstance.getCss();
      const imgUrls = [
        ...html.matchAll(/<img[^>]+src=\"([^\"]+)\"[^>]*>/g),
      ].map((match) => match[1]);
      const uploadPromises = imgUrls.map(async (url) => {
        if (url.startsWith("data:image")) {
          const byteString = atob(url.split(",")[1]);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], {
            type: url.split(",")[0].split(":")[1].split(";")[0],
          });
          const formData = new FormData();
          formData.append("file", blob, "image.png");
          const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
          const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
          if (!uploadPreset || !cloudName) {
            console.error("Cloudinary credentials are missing!");
            return null;
          }
          formData.append("upload_preset", uploadPreset);
          try {
            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );
            if (!res.ok) {
              const errorData = await res.json();
              console.error("Cloudinary error:", errorData);
              return null;
            }
            const data = await res.json();
            return { oldUrl: url, newUrl: data.secure_url };
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return null;
          }
        }
        return null;
      });
      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        Boolean
      );
      let modifiedHtml = html;
      uploadedImages.forEach(({ oldUrl, newUrl }) => {
        modifiedHtml = modifiedHtml.replaceAll(oldUrl, newUrl);
      });
      const result = modifiedHtml + "\n" + css;
      const responseChat = await updateChat(result, searchTerm, id);
      if (editorInstance) {
        editorInstance.setStyle(responseChat.CSS);
        editorInstance.setComponents(responseChat.HTML);
      } else {
        console.error("Editor not found");
      }
      setLoading(false);
      setTimeout(() => setSearchTerm(""), 0);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setLoading(false);
    }
  };

  return (
    <div className="block border-animation" ref={ref}>
      {state === "clicked" ? (
        <div className="flex items-center gap-2 min-w-[calc(100vw-410px)] p-1 h-auto rounded-full bg-white border-2 border-transparent transition-all duration-300 font-dmSans">
          <button
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer animated-button p-1"
            onClick={() => setState("normal")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 19L1.5 10L10.5 1"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 bg-white text-black placeholder-gray-400 border-none focus:outline-none font-dmSans"
            autoFocus
            placeholder="Fine-tune your prompt here"
          />
          <button
            onClick={handleSubmit}
            className=" bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="border-animation">
          <button
            className={`flex items-center gap-2 p-4 rounded-full bg-white text-black cursor-pointer transition-all duration-300 animated-button ${
              state === "hovered" ? "w-64" : "w-12"
            }`}
            onMouseEnter={() => setState("hovered")}
            onMouseLeave={() => setState("normal")}
            onClick={() => setState("clicked")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.61538 19.5H0.5L0.5 14.3747L11.0962 3.75803M5.61538 19.5L19.5 19.5M5.61538 19.5L16.2115 8.88332M11.0962 3.75803L13.2885 1.56148C14.701 0.146165 16.9913 0.146166 18.4038 1.56148C19.8164 2.97679 19.8164 5.27146 18.4038 6.68677L16.2115 8.88332M11.0962 3.75803L16.2115 8.88332"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {state === "hovered" && (
              <div className="text-black font-dmSans">
                <h1 className="text-black font-dmSans">
                  Fine-tune your prompt
                </h1>
              </div>
            )}
          </button>
        </div>
      )}
      <style>
        {`
          .border-animation {
            position: relative;
            display: inline-block;
            padding: 1.5px;
            border-radius: 9999px;
            background: conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red);
            animation: rotate 8s linear infinite;
          }

          .animated-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            position: relative;
            z-index: 1; 
          }

          @keyframes rotate {
            0% {
              background: conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red);
            }
            100% {
              background: conic-gradient(from 360deg, red, yellow, lime, aqua, blue, magenta, red);
            }
          }
        `}
      </style>
    </div>
  );
}
