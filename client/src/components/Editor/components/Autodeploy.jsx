import React, { useState, useEffect } from "react";
import JSZip from "jszip";

const AutoDeployButton = ({ editor }) => {
    const [deploying, setDeploying] = useState(false);
    const [deployId, setDeployId] = useState(null);
    const [deployStatus, setDeployStatus] = useState(null);
    const [deployedUrl, setDeployedUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const NETLIFY_TOKEN = process.env.REACT_APP_NETLIFY_TOKEN;
    const siteId = process.env.REACT_APP_SITE_ID;

    const handleDeploy = async () => {
        setDeploying(true);
        setDeployedUrl(null);
        setErrorMessage(null);
        setDeployStatus("Uploading...");

        try {
            if (!editor) throw new Error("Editor instance is not available.");
            const html = editor.getHtml();
            const css = editor.getCss();
            const zip = new JSZip();
            zip.file("index.html", html);
            if (css.trim()) {
                zip.file("styles.css", css);
            }
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const formData = new FormData();
            formData.append("file", zipBlob, "project.zip");

            const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${NETLIFY_TOKEN}`
                },
                body: formData  
            });

            if (!response.ok) throw new Error(`Netlify Error: ${response.statusText}`);
            const result = await response.json();

            if (!result.id) throw new Error("Deployment ID not found.");
            setDeployId(result.id);

            setDeployStatus("Processing...");
        } catch (error) {
            setErrorMessage(error.message || "An error occurred during deployment.");
            setDeploying(false);
        }
    };

    useEffect(() => {
        if (deployId) {
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, {
                        headers: {
                            "Authorization": `Bearer ${NETLIFY_TOKEN}`
                        }
                    });

                    if (!response.ok) throw new Error(`Failed to fetch deployment status.`);
                    const result = await response.json();

                    if (result.state === "ready") {
                        setDeployStatus("✅ Deployment Complete!");
                        setDeployedUrl(result.url);
                        clearInterval(interval);
                        setDeploying(false);
                    } else if (result.state === "error") {
                        setDeployStatus("❌ Deployment Failed.");
                        setErrorMessage("Deployment failed. Check Netlify logs.");
                        clearInterval(interval);
                        setDeploying(false);
                    } else {
                        setDeployStatus(`🚀 Status: ${result.state}`);
                    }
                } catch (error) {
                    console.error(error);
                    setDeployStatus("⚠️ Error Fetching Status");
                    clearInterval(interval);
                    setDeploying(false);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [deployId]);

    return (
        <div style={{ textAlign: "center", marginTop: "2px", marginBottom: '2px' }}>
            <button
                onClick={handleDeploy}
                disabled={deploying}
                style={{
                    backgroundColor: deploying ? "gray" : "white",
                    cursor: deploying ? "not-allowed" : "pointer",
                }}
                className="py-[3px] px-[12px] text-black font-semibold font-dmSans text-[1rem]  rounded-md flex justify-center align-middle gap-2"
            >   
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="14px" height="25px"><path d="M 25 0.59375 L 24.28125 1.28125 L 16.28125 9.28125 C 15.882813 9.679688 15.882813 10.320313 16.28125 10.71875 C 16.679688 11.117188 17.320313 11.117188 17.71875 10.71875 L 24 4.4375 L 24 32 C 23.996094 32.359375 24.183594 32.695313 24.496094 32.878906 C 24.808594 33.058594 25.191406 33.058594 25.503906 32.878906 C 25.816406 32.695313 26.003906 32.359375 26 32 L 26 4.4375 L 32.28125 10.71875 C 32.679688 11.117188 33.320313 11.117188 33.71875 10.71875 C 34.117188 10.320313 34.117188 9.679688 33.71875 9.28125 L 25.71875 1.28125 Z M 7 16 L 7 50 L 43 50 L 43 16 L 33 16 C 32.640625 15.996094 32.304688 16.183594 32.121094 16.496094 C 31.941406 16.808594 31.941406 17.191406 32.121094 17.503906 C 32.304688 17.816406 32.640625 18.003906 33 18 L 41 18 L 41 48 L 9 48 L 9 18 L 17 18 C 17.359375 18.003906 17.695313 17.816406 17.878906 17.503906 C 18.058594 17.191406 18.058594 16.808594 17.878906 16.496094 C 17.695313 16.183594 17.359375 15.996094 17 16 Z"/></svg>
                {deploying ? "Deploying..." : "Publish"}
            </button>

            {deployStatus && <p>{deployStatus}</p>}

            {deployedUrl && (
                <p>
                    Site Deployed: <a href={deployedUrl} target="_blank" rel="noopener noreferrer">{deployedUrl}</a>
                </p>
            )}

            {errorMessage && <p style={{ color: "red" }}> {errorMessage}</p>}
        </div>
    );
};

export default AutoDeployButton;