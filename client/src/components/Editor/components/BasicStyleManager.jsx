import React from "react";
import CustomAccordion from "./CustomAccordion.jsx";
import StylePropertyField from "./StylePropertyField.tsx";

function BasicStyleManager({ sectors }) {
  const basicSectors = [
    { name: "Dimensions", attributes: [] },
    { name: "Layout", attributes: [] },
    { name: "Text Editor", attributes: [] },
    { name: "Appearance", attributes: [] },
    { name: "Border", attributes: [] },
    { name: "Background", attributes: [] },
  ];
  sectors.forEach((sector) => {
    sector.getProperties().forEach((p) => {
      if (
        p.id === "width" ||
        p.id === "height" ||
        p.id === "min-height" ||
        p.id === "max-width"
      ) {
        basicSectors[0].attributes.push({ id: p.getId(), prop: p });
      }
      if (
        p.id === "display" ||
        p.id === "position" ||
        p.id === "top" ||
        p.id === "bottom" ||
        p.id === "left" ||
        p.id === "right"
      ) {
        basicSectors[1].attributes.push({ id: p.getId(), prop: p });
      }
      if (
        p.id === "font-family" ||
        p.id === "font-size" ||
        p.id === "font-weight" ||
        p.id === "color" ||
        p.id === "line-height" ||
        p.id === "text-align" ||
        p.id === "text-shadow" 
      ) {
        basicSectors[2].attributes.push({ id: p.getId(), prop: p });
      }
      if (p.id === "opacity") {
        basicSectors[3].attributes.push({ id: p.getId(), prop: p });
      }
      if (p.id === "border" || p.id === "border-radius") {
        basicSectors[4].attributes.push({ id: p.getId(), prop: p });
      }
      if (p.id === "background" || p.id === "background-color") {
        basicSectors[5].attributes.push({ id: p.getId(), prop: p });
      }
    });
    if (basicSectors[2].attributes.length > 4) {
      const temp = basicSectors[2].attributes[3];
      basicSectors[2].attributes[3] = basicSectors[2].attributes[4];
      basicSectors[2].attributes[4] = temp;
    }
  });

  return (
    <div className="text-white">
      {basicSectors.map((sector) => {
        if (sector.attributes.length === 0) return null;
        return (
          <CustomAccordion
            key={sector.name}
            title={sector.name}
            className=""
            size="sm"
            colour="gray-300"
            svg="Gray"
            font="inter"
            border="no"
          >
            <div className="flex flex-wrap pt-2 px-8 ">
              {sector.attributes.map((prop) => (
                <StylePropertyField key={prop.id} prop={prop.prop} />
              ))}
            </div>
          </CustomAccordion>
        );
      })}
    </div>
  );
}

export default BasicStyleManager;
