import * as React from "react";
import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
} from "@grapesjs/react";
import type { Editor, EditorConfig } from "grapesjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CustomModal from "./components/CustomModal.tsx";
import CustomAssetManager from "./components/CustomAssetManager.tsx";
import Topbar from "./components/Topbar.tsx";
import RightSidebar from "./components/RightSidebar.tsx";
import RepromptButton from "./components/RepromptButton.jsx";
import "./style.css";
import { getCode, saveCode } from "../../utils/code";
import { Navigate, useParams } from "react-router-dom";
import AutoDeployButton from "./components/Autodeploy.jsx";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  const { id } = useParams();
  const [defaultHTML, setDefaultHTML] = React.useState<string>("");
  const [defaultCSS, setDefaultCSS] = React.useState<string>("");
  const [editorInstance, setEditorInstance] = React.useState<Editor | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const code = await getCode(id);
        setDefaultHTML(code.HTML);
        setDefaultCSS(code.CSS);

        if (editorInstance) {
          editorInstance.setComponents(code.HTML);
          editorInstance.setStyle(code.CSS);
        }
      } catch (error) {
        console.error("Error fetching code:", error);
      }
    };
    fetchData();
  }, [id, editorInstance]);

  const gjsOptions: EditorConfig = {
    height: "calc(100vh - 40px)",
    storageManager: false,
    undoManager: { trackSelection: false },
    selectorManager: { componentFirst: true },
    projectData: {
      assets: [],
      pages: [
        {
          name: "Page",
          component: defaultHTML,
        },
      ],
    },
  };

  const onEditor = (editor: Editor) => {
    setEditorInstance(editor);
    (window as any).editor = editor;

    editor.on("load", () => {
      if (defaultCSS) {
        editor.setStyle(defaultCSS);
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <GjsEditor
        className="gjs-custom-editor text-white"
        grapesjs="https://unpkg.com/grapesjs"
        options={gjsOptions}
        plugins={[
          {
            id: "gjs-blocks-basic",
            src: "https://unpkg.com/grapesjs-blocks-basic",
          },
          {
            id: "grapesjs-plugin-forms",
            src: "https://unpkg.com/grapesjs-plugin-forms",
          },
          {
            id: "grapesjs-navbar",
            src: "https://unpkg.com/grapesjs-navbar",
          },
          {
            id: "grapesjs-component-countdown",
            src: "https://unpkg.com/grapesjs-component-countdown",
          },
          {
            id: "grapesjs-style-gradient",
            src: "https://unpkg.com/grapesjs-style-gradient",
          },
          {
            id: "grapesjs-style-filter",
            src: "https://unpkg.com/grapesjs-style-filter",
          },
          {
            id: "grapesjs-tooltip",
            src: "https://unpkg.com/grapesjs-tooltip",
          },
          {
            id: "grapesjs-custom-code",
            src: "https://unpkg.com/grapesjs-custom-code",
          },
          {
            id: "grapesjs-user-blocks",
            src: "https://unpkg.com/grapesjs-user-blocks",
          },
        ]}
        onEditor={onEditor}
      >
        <div className={`flex flex-col h-full`}>
          {loading && (
            <div className="fixed h-screen w-screen bg-black opacity-50 z-40"></div>
          )}
          {loading && (
            <div className="flex items-center justify-center min-h-screen z-50 h-screen w-screen fixed bg-black bg-opacity-50">
              <div className="relative">
                <div className="relative w-20 h-20">
                  <div
                    className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin"
                    style={{ animationDuration: "3s" }}
                  ></div>

                  <div
                    className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin"
                    style={{
                      animationDuration: "2s",
                      animationDirection: "reverse",
                    }}
                  ></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm"></div>
              </div>
            </div>
          )}
          <Topbar
            className="h-[40px] bg-neutral-800"
            editorInstance={editorInstance}
            id={id}
          />
          <div className="gjs-column-m flex flex-grow bg-black border-t border-white font-dmSans">
            <Canvas className="h-full gjs-custom-editor-canvas border-r" />
            <RightSidebar />
            <div className="fixed bottom-4 left-4 z-10">
              {editorInstance && (
                <RepromptButton
                  editorInstance={editorInstance}
                  setLoading={setLoading}
                />
              )}
            </div>
          </div>
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </GjsEditor>
    </ThemeProvider>
  );
}
