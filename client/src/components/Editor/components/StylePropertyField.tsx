import * as React from "react";
import { useEditor } from "@grapesjs/react";
import {
  mdiArrowDownDropCircle,
  mdiArrowUpDropCircle,
  mdiClose,
  mdiDelete,
  mdiPlus,
} from "@mdi/js";
import Icon from "@mdi/react";
import CustomSelect from "./Select.tsx";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CustomRadioGroup from "./Radio.jsx";
import Slider from "./Slider.jsx";
import TextField from "@mui/material/TextField";
import Counter from "./Counter.jsx";
import type {
  Property,
  PropertyComposite,
  PropertyRadio,
  PropertySelect,
  PropertySlider,
  PropertyStack,
} from "grapesjs";
import { BTN_CLS, ROUND_BORDER_COLOR, cx } from "./common.ts";

interface StylePropertyFieldProps extends React.HTMLProps<HTMLDivElement> {
  prop: Property;
}

export default function StylePropertyField({
  prop,
  ...rest
}: StylePropertyFieldProps) {
  const editor = useEditor();
  const handleChange = (value: string) => {
    prop.upValue(value);
  };
  const onChange2 = (ev: any) => {
    handleChange(ev);
  };

  const onChange = (ev: any) => {
    handleChange(ev.target.value);
  };

  const openAssets = () => {
    const { Assets } = editor;
    Assets.open({
      select: (asset, complete) => {
        prop.upValue(asset.getSrc(), { partial: !complete });
        complete && Assets.close();
      },
      types: ["image"],
      accept: "image/*",
    });
  };

  const type = prop.getType();
  const defValue = prop.getDefaultValue();
  const canClear = prop.canClear();
  const hasValue = prop.hasValue();
  const value = prop.getValue();
  const valueString = hasValue ? value : "";
  const valueWithDef = hasValue ? value : defValue;

  let inputToRender = (
    // <TextField
    //   placeholder={defValue}
    //   value={valueString}
    //   onChange={onChange}
    //   size="small"
    //   fullWidth
    // />
    <Counter defValue={defValue} val={valueString} onChange={handleChange} />
  );

  switch (type) {
    case "radio":
      {
        const radioProp = prop as PropertyRadio;
        inputToRender = (
          <CustomRadioGroup
            options={radioProp.getOptions().map((option) => ({
              label: radioProp.getOptionLabel(option),
              value: radioProp.getOptionId(option),
            }))}
            defaultValue={value} // Pass the default value
            onChange={onChange2} // Pass the change handler
          />
        );
      }
      break;
    case "select":
      {
        const selectProp = prop as PropertySelect;
        const options = selectProp.getOptions().map((option) => ({
          value: selectProp.getOptionId(option),
          label: selectProp.getOptionLabel(option),
        }));

        inputToRender = (
          <CustomSelect
            options={options}
            defaultValue={value}
            onChange={(selectedValue) => {
              onChange2(selectedValue);
            }}
            backgroundColor="#1E1E1E"
            dropdownBackgroundColor="#1E1E1E"
            dropdownHoverColor="#65E06F"
            style={{
              width: "100%",
            }}
          />
        );
      }
      break;
    case "color":
      {
        inputToRender = (
          <TextField
            fullWidth
            placeholder={defValue}
            value={valueString}
            onChange={onChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div
                    className={`w-[15px] h-[15px] ${ROUND_BORDER_COLOR}`}
                    style={{ backgroundColor: valueWithDef }}
                  >
                    <input
                      type="color"
                      className="w-[15px] h-[15px] cursor-pointer opacity-0"
                      value={valueWithDef}
                      onChange={(ev) => handleChange(ev.target.value)}
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        );
      }
      break;
    case "slider":
      {
        const sliderProp = prop as PropertySlider;
        // console.log(value);
        // console.log(sliderProp);
        inputToRender = (
          <Slider
            value={value}
            onChange2={onChange2}
            min={sliderProp.getMin() * 5}
            max={sliderProp.getMax() * 100}
            step={sliderProp.getStep()}
          />
        );
      }
      break;
    case "file":
      {
        inputToRender = (
          <div className="flex flex-col items-center gap-3">
            {value && value !== defValue && (
              <div
                className="w-[50px] h-[50px] rounded inline-block bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url("${value}")` }}
                onClick={() => handleChange("")}
              />
            )}
            <button type="button" onClick={openAssets} className={BTN_CLS}>
              Select Image
            </button>
          </div>
        );
      }
      break;
    case "composite":
      {
        const compositeProp = prop as PropertyComposite;
        inputToRender = (
          <div
            className={cx("flex flex-wrap p-2 bg-black/20", ROUND_BORDER_COLOR)}
          >
            {compositeProp.getProperties().map((prop) => (
              <StylePropertyField key={prop.getId()} prop={prop} />
            ))}
          </div>
        );
      }
      break;
    case "stack":
      {
        const stackProp = prop as PropertyStack;
        const layers = stackProp.getLayers();
        const isTextShadow = stackProp.getName() === "text-shadow";
        inputToRender = (
          <div
            className={cx(
              "flex flex-col p-2 gap-2 bg-black/20",
              ROUND_BORDER_COLOR
            )}
            style={{
              minHeight: "40px",
              borderRadius: "12px",
            }}
          >
            {layers.map((layer) => (
              <div key={layer.getId()} className="">
                <div className="flex gap-1 px-2 py-1 items-center">
                  <IconButton
                    size="small"
                    onClick={() => layer.move(layer.getIndex() - 1)}
                  >
                    <Icon size={0.7} path={mdiArrowUpDropCircle} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => layer.move(layer.getIndex() + 1)}
                  >
                    <Icon size={0.7} path={mdiArrowDownDropCircle} />
                  </IconButton>
                  <button className="flex-grow" onClick={() => layer.select()}>
                    {layer.getLabel()}
                  </button>
                  <div
                    className={cx(
                      "bg-white min-w-[17px] min-h-[17px] text-black text-sm flex justify-center",
                      ROUND_BORDER_COLOR
                    )}
                    style={layer.getStylePreview({
                      number: { min: -3, max: 3 },
                      camelCase: true,
                    })}
                  >
                    {isTextShadow && "T"}
                  </div>
                  <IconButton size="small" onClick={() => layer.remove()}>
                    <Icon size={0.7} path={mdiDelete} />
                  </IconButton>
                </div>
                {layer.isSelected() && (
                  <div className="p-2 flex flex-wrap">
                    {stackProp.getProperties().map((prop) => (
                      <StylePropertyField key={prop.getId()} prop={prop} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      break;
  }

  return (
    <div
      {...rest}
      className={cx("mb-4 px-1 text-sm", prop.isFull() ? "w-full" : "w-1/2")}
    >
      <div className={cx("flex mb-2 items-center", canClear && "text-sky-300")}>
        <div className="flex-grow capitalize">{prop.getLabel()}</div>
        {canClear && (
          <button onClick={() => prop.clear()}>
            <Icon path={mdiClose} size={0.7} />
          </button>
        )}
        {type === "stack" && (
          <IconButton
            size="small"
            className="!ml-2"
            onClick={() => (prop as PropertyStack).addLayer({}, { at: 0 })}
          >
            <Icon size={1} path={mdiPlus} />
          </IconButton>
        )}
      </div>
      {inputToRender}
    </div>
  );
}
