import * as React from "react";
import { useEditor } from "@grapesjs/react";
import { useEffect, useState, useCallback } from "react";
import Icon from "@mdi/react";
import { mdiFullscreen } from "@mdi/js";

export default function TopbarButtons({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { UndoManager, Commands } = editor;

  const cmdButtonsLeft = [
    {
      id: "core:fullscreen",
      iconPath: <Icon path={mdiFullscreen} size={1} />,
      disabled: () => false,
      options: { target: "#root" },
    },
    {
      id: "core:undo",
      iconPath: (
        <svg
          width="25"
          height="25"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.0528 7.01172L6.6601 11.4045L11.0528 15.7972M7.39222 11.4045H19.1062C22.7453 11.4045 25.6953 14.3545 25.6953 17.9936C25.6953 21.6327 22.7453 24.5827 19.1062 24.5827H7.39222"
            stroke="white"
            strokeWidth="1.60297"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: "core:redo",
      iconPath: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.3925 7.01172L25.7852 11.4045L21.3925 15.7972M25.0531 11.4045H13.3391C9.70005 11.4045 6.75 14.3545 6.75 17.9936C6.75 21.6327 9.70005 24.5827 13.3391 24.5827H25.0531"
            stroke="white"
            strokeWidth="1.60297"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      disabled: () => !UndoManager.hasRedo(),
    },
  ];

  const cmdButtonsRight = [
    {
      id: "core:preview",
      id: "core:fullscreen",
      iconPath: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0371 11.931C11.2488 11.931 7.36719 16.5608 7.36719 17.7372C7.36719 18.9136 11.2488 23.5434 16.0371 23.5434C20.8253 23.5434 24.707 18.9136 24.707 17.7372C24.707 16.5608 20.8253 11.931 16.0371 11.931ZM16.0371 11.931C13.9302 11.931 12.2224 13.613 12.2224 15.688C12.2224 17.7629 13.9303 19.4449 16.0371 19.4449C18.1439 19.4449 19.8519 17.7629 19.8519 15.688C19.8519 13.613 18.1439 11.931 16.0371 11.931ZM25.4005 11.931C22.7598 9.7613 19.6769 8.51562 16.3839 8.51562C13.0909 8.51562 10.0079 9.7613 7.36719 11.931"
            stroke="white"
            strokeWidth="1.60297"
            strokeLinecap="round"
          />
        </svg>
      ),
      disabled: () => false,
    },
    {
      id: "core:component-outline",
      iconPath: (
        <svg
          width="25"
          height="25"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="9.0308"
            y="7.81596"
            width="16.4304"
            height="16.4304"
            fill="white"
            stroke="#1E1E1E"
            strokeWidth="1.20222"
          />
          <path
            d="M14.0391 7.21484V24.4467"
            stroke="#1E1E1E"
            strokeWidth="1.20222"
          />
          <path
            d="M19.6523 7.21484V24.4467"
            stroke="#1E1E1E"
            strokeWidth="1.20222"
          />
          <path
            d="M25.6602 13.625L8.42828 13.625"
            stroke="#1E1E1E"
            strokeWidth="1.20222"
          />
          <path
            d="M25.6602 19.2383L8.42828 19.2383"
            stroke="#1E1E1E"
            strokeWidth="1.20222"
          />
        </svg>
      ),
      disabled: () => false,
      options: {},
    },
  ];

  useEffect(() => {
    const cmdEvent = "run stop";
    const updateEvent = "update";
    const updateCounter = () => setUpdateCounter((value) => value + 1);

    const onCommand = (id: string) => {
      cmdButtonsLeft.find((btn) => btn.id === id) && updateCounter();
    };

    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, [editor, cmdButtonsLeft]);

  const handleCommand = useCallback(
    (id, options) => {
      if (Commands.isActive(id)) {
        Commands.stop(id);
      } else {
        Commands.run(id, options);
      }
      setUpdateCounter((value) => value + 1);
    },
    [Commands]
  );

  return (
    <div className="flex">
      <svg
        className="my-1 mb-1.5 mx-0"
        width="20"
        height="25"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.8906 0.199219V33.8615"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.20222"
        />
      </svg>
      <div className={`flex gap-3 my-1 ${className}`}>
        {cmdButtonsLeft.map(({ id, iconPath, disabled, options }) => (
          <button
            key={id}
            type="button"
            className={`${Commands.isActive(id) ? "bg-neutral-700" : ""} ${
              disabled?.() ? "opacity-40 hover:bg-neutral-800" : ""
            } hover:bg-neutral-700 rounded`}
            onClick={() => handleCommand(id, options)}
            disabled={disabled?.()}
          >
            {iconPath}
          </button>
        ))}
      </div>
      <svg
        className="my-1 mb-1.5 mx-0"
        width="20"
        height="25"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.8906 0.199219V33.8615"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.20222"
        />
      </svg>
      <div className={`flex gap-3 my-1 ${className}`}>
        {cmdButtonsRight.map(({ id, iconPath, disabled, options }) => (
          <button
            key={id}
            type="button"
            className={`${Commands.isActive(id) ? "bg-neutral-700" : ""} ${
              disabled?.() ? "opacity-50" : ""
            } hover:bg-neutral-700 rounded`}
            onClick={() => handleCommand(id, options)}
            disabled={disabled?.()}
          >
            {iconPath}
          </button>
        ))}
      </div>
      <svg
        className="my-1 mb-1.5 mx-0"
        width="20"
        height="25"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.8906 0.199219V33.8615"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="1.20222"
        />
      </svg>
    </div>
  );
}
