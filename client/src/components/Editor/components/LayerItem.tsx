import * as React from "react";
import { useEditor } from "@grapesjs/react";
import type { Component } from "grapesjs";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "./common.ts";

export declare interface LayerItemProps
  extends React.HTMLProps<HTMLDivElement> {
  component: Component;
  level: number;
  draggingCmp?: Component;
  dragParent?: Component;
}

const itemStyle = { maxWidth: `100%` };

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
  ...props
}: LayerItemProps) {
  const editor = useEditor();
  const { Layers } = editor;
  const layerRef = useRef<HTMLDivElement>(null);
  const [layerData, setLayerData] = useState(Layers.getLayerData(component));
  const { open, selected, hovered, components, visible, name } = layerData;
  const componentsIds = components.map((cmp) => cmp.getId());
  const isDragging = draggingCmp === component;
  const cmpHash = componentsIds.join("-");
  const level = props.level + 1;

  useEffect(() => {
    level === 0 && setLayerData(Layers.getLayerData(component));
    if (layerRef.current) {
      (layerRef.current as any).__cmp = component;
    }
  }, [component]);

  useEffect(() => {
    const up = (cmp: Component) => {
      cmp === component && setLayerData(Layers.getLayerData(cmp));
    };
    const ev = Layers.events.component;
    editor.on(ev, up);

    return () => {
      editor.off(ev, up);
    };
  }, [editor, Layers, component]);

  const cmpToRender = useMemo(() => {
    return components.map((cmp) => (
      <LayerItem
        key={cmp.getId()}
        component={cmp}
        level={level}
        draggingCmp={draggingCmp}
        dragParent={dragParent}
      />
    ));
  }, [cmpHash, draggingCmp, dragParent]);

  const toggleOpen = (ev: MouseEvent) => {
    ev.stopPropagation();
    setTimeout(() => {
      Layers.setLayerData(component, { open: !open });
    }, 200);
  };

  const toggleVisibility = (ev: MouseEvent) => {
    ev.stopPropagation();
    Layers.setLayerData(component, { visible: !visible });
  };

  const select = (event: MouseEvent) => {
    event.stopPropagation();
    Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (hovered: boolean) => {
    if (!hovered || !draggingCmp) {
      Layers.setLayerData(component, { hovered });
    }
  };

  const wrapperCls = cx(
    "layer-item flex flex-col",
    selected,
    (!visible || isDragging) && "opacity-50"
  );

  return (
    <div className={wrapperCls}>
      <div
        onClick={select}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        className="group max-w-full"
        data-layer-item
        ref={layerRef}
      >
        <div
          className={cx(
            `flex items-center p-1 pr-2  mr-3 mb-[-4] `,
            !components.length && "gap-0",
            components.length && "gap-1.5",
            level === 0
          )}
          style={{
            marginLeft: `${level === -1 ? 30 : level * 27}px`,
          }}
        >
          <div
            className={cx("group-hover:opacity-100 cursor-pointer")}
            onClick={toggleVisibility}
          >
            <svg
              width="19.13"
              height="13"
              viewBox="0 0 22 16"
              fill="none"
              className={open ? "text-green-300" : "text-white"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="eye">
                <path
                  d="M20.1296 8.46875C20.1296 9.78572 15.8473 14.9688 10.5648 14.9688C5.2823 14.9688 1 9.78572 1 8.46875C1 7.15178 5.2823 1.96875 10.5648 1.96875C15.8473 1.96875 20.1296 7.15178 20.1296 8.46875Z"
                  fill="white"
                />
                <path
                  d="M14.7733 6.17463C14.7733 8.49748 12.8891 10.3805 10.5648 10.3805C8.24053 10.3805 6.35632 8.49748 6.35632 6.17463C6.35632 3.85179 8.24049 1.96875 10.5648 1.96875C12.8891 1.96875 14.7733 3.85179 14.7733 6.17463Z"
                  fill="white"
                />
                <path
                  d="M10.5648 1.96875C5.2823 1.96875 1 7.15178 1 8.46875C1 9.78572 5.2823 14.9688 10.5648 14.9688C15.8473 14.9688 20.1296 9.78572 20.1296 8.46875C20.1296 7.15178 15.8473 1.96875 10.5648 1.96875ZM10.5648 1.96875C8.24049 1.96875 6.35632 3.85179 6.35632 6.17463C6.35632 8.49748 8.24053 10.3805 10.5648 10.3805C12.8891 10.3805 14.7733 8.49748 14.7733 6.17463C14.7733 3.85179 12.8891 1.96875 10.5648 1.96875Z"
                  stroke="#0E0E0E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
          <div
            className={cx(
              "truncate flex-grow font-dmSans text-sm",
              open ? "text-green-300" : "text-white",
              !components.length && "pointer-events-none ml-[-10] "
            )}
            onClick={toggleOpen}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={open ? "text-green-300" : "text-white"}
              style={{
                transform: `rotate(${open ? 0 : -90}deg)`,
                transition: "transform 0.25s ease",
              }}
            >
              <g id="Controls">
                <path
                  id="chevron-up"
                  d="M14.0625 7.4375L9 12.5L3.9375 7.4375"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <div
            className={cx(
              "truncate flex-grow font-dmSans text-sm",
              open ? "text-green-300" : "text-white",
              !components.length && "pointer-events-none ml-[-10] "
            )}
            onClick={toggleOpen}
            style={{ ...itemStyle, fontFamily: "inter" }}
          >
            {name}
          </div>
          <div className="hover:cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 35 34"
              fill="none"
              className={open ? "text-green-300" : "text-white"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Controls">
                <path
                  id="diagonals-outsight"
                  d="M13.7422 10.2527L17.1 6.89492L20.4588 10.2537M17.1015 6.8972L17.1004 27.0479M13.7441 23.686L17.1028 27.0447L20.4606 23.6869M23.8184 20.329L27.1763 16.9712L23.8175 13.6124M27.1741 16.9698L7.02332 16.9708M10.3853 20.3272L7.02652 16.9684L10.3843 13.6106"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      {!!(open && components.length) && (
        <div className={cx("max-w-full", !open && "hidden")}>{cmpToRender}</div>
      )}
    </div>
  );
}
