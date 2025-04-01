import * as React from "react";
import { StylesResultProps } from "@grapesjs/react";
import BasicStyleManager from "./BasicStyleManager.jsx";
import AdvanceStyleManager from "./AdvanceStyleManager.jsx";
import StylePropertyField from "./StylePropertyField.tsx";
import CustomAccordion from "./CustomAccordion.jsx";

export default function CustomStyleManager({ sectors }) {
  if (sectors.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="mx-2 text-lg opacity-50 text-center">
          Please Select an element from the canvas.
        </h1>
      </div> 
    );
  }
  return (
    <div className="gjs-custom-style-manager text-left">
      <CustomAccordion title="Basic" className="basic" size="lg" colour="white" font="sans" svg="White" border="yes">
        <BasicStyleManager sectors={sectors} />
      </CustomAccordion>
      <CustomAccordion title="Advanced" className="advance" size="lg" colour="white" font="sans" svg="White" border="yes">
        <AdvanceStyleManager sectors={sectors} />
      </CustomAccordion>
      {/* {sectors.map((sector) => (
        <CustomAccordion
          key={sector.getId()}
          title={sector.getName()}
          className=""
        >
          <div className="flex flex-wrap">
            {sector.getProperties().map((prop) => (
              <StylePropertyField key={prop.getId()} prop={prop} />
            ))}
          </div>
        </CustomAccordion>
      ))} */}
    </div>
  );
}
