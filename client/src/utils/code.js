import Editor from "@grapesjs/react";
import axios from "axios";
const backendURL = process.env.REACT_APP_BACKEND_URL;

export const createChat = async (prompt, userid, navigate) => {
  try {
    const response = await axios.post(`${backendURL}/code/create`, {
      prompt,
      userid,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const updateChat = async (code, prompt, id) => {
  try {
    const response = await axios.post(`${backendURL}/code/update/${id}`, {
      code,
      prompt,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const getCode = async (id) => {
  try {
    const response = await axios.get(`${backendURL}/code/get/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const deleteCode = async ({ id, userid }) => {
  try {
    const response = await axios.post(`${backendURL}/user/delete/${userid}`, {
      id,
    });
    return response;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const saveCode = async (id, editorHTML, editorCSS) => {
  try {
    const response = await axios.post(`${backendURL}/code/save/${id}`, {
      editorHTML,
      editorCSS,
    });
    return response;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};
