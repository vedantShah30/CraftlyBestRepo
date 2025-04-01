import OpenAI from "openai";
import dotenv from "dotenv";
import Code from "../models/code.js";
import User from "../../users/models/users.js";
dotenv.config();

const openai = new OpenAI({
  organization: process.env.ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const reprompt = new OpenAI({
  organization: process.env.ORG,
  apiKey: process.env.REPROMPT_API_KEY,
});

export const createChat = async (req, res) => {
  try {
    const basePrompt = `
      You are master in HTML, CSS and bootstrap. Your task is to generate HTML and CSS separately in this format {HTML:...,CSS:....} and also while generating make sure that the website is:
      1) Responsive,
      2) Has good color combinations, gradients, and shadows which aligns with '${req.body.prompt} ' and represents calmness and mordern touch.
      3) Add few quotes and must have content for '${req.body.prompt}'.
      4) Make the website attractive, and
      5) Add animations and transitions,
      6) Use good fonts and icons related to the website,
      7) this website must include a navbar, body section, hero section, content section image cards, footer
      8) Use bootstrap components whenever you want
      9) define all the colours in the root of the style as :root {
          --color-a: name of color;
          --color-b: name of color;
          --color-c: name of color;
          --color-d: name of color;
        }  
      Also, ensure the HTML code is more than 200 lines, and the CSS should be at least 400 lines. Be as creative as possible while following all the above instructions.
    `;
    const finalPrompt = `${req.body.prompt} \n ${basePrompt}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are master in HTML,CSS. Your task is to generate HTML and CSS separately in this format {HTML:...,CSS:....} and also while generating make sure that the website is 1)Responsive and good, 2) has good UI, 3) has good color combinations, gradients and shadows, 4) add quotes and sentences related to the website, 5) make the website attractive, 6) add animations and transitions, 7) use good fonts and icons related to the website, 8) incorporate microinteractions related to the website, and use :root{--color-a: #DADADA; --color-b: #3A47EE; --color-c: #020202; --color-d: #FFFFFF;and also HTML code should be more than 100 lines and css should be atleast 200 lines .Be as creative as possible while following all the 8 instructions given.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
    });
    const responseContent = completion.choices[0].message.content;
    console.log(responseContent);
    const htmlMatch = responseContent.match(/<html[\s\S]*<\/html>/);
    const cssMatch = responseContent.match(/```css([\s\S]*?)```/);
    const html = htmlMatch ? htmlMatch[0] : null;
    const css = cssMatch ? cssMatch[1].trim() : null;
    if (!html || !css) {
      return res.status(400).json({
        error: "Failed to extract HTML or CSS from the response.",
      });
    }
    const code = await Code.create({
      title: req.body.prompt,
      HTML: html,
      CSS: css,
    });
    const user = await User.findById(req.body.userid);
    user.prompts.push(code._id);
    await user.save();
    res.json(code);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateChat = async (req, res) => {
  const repromptBase = `I am giving you my code ${req.body.code}. Do not change it, only add ${req.body.prompt}. Keep the rest of the code intact.`;

  try {
    const completion = await reprompt.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in HTML and CSS. Your task is to modify an existing HTML and CSS code based on the user's prompt. Return only a JSON object in this format:\n\n" +
            "```json\n" +
            '{ "HTML": "<updated HTML>", "CSS": "<updated CSS>" }\n' +
            "```\n\n" +
            "Ensure that:\n" +
            "1. The response is **pure JSON** (no explanations, no markdown, no extra text).\n" +
            "2. The updated code remains **fully responsive**.\n" +
            "3. The structure of the code remains intact.",
        },
        {
          role: "user",
          content: repromptBase,
        },
      ],
    });
    let responseContent = completion.choices[0].message.content;
    responseContent = responseContent
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/, "");
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError);
      return res
        .status(500)
        .json({ error: "Invalid JSON format received from AI" });
    }

    const { HTML, CSS } = parsedResponse;

    if (!HTML || !CSS) {
      console.error("Missing HTML or CSS in API response.");
      return res
        .status(500)
        .json({ error: "HTML or CSS is missing in AI response" });
    }
    const code = await Code.findByIdAndUpdate(
      req.params.id,
      { HTML, CSS },
      { new: true }
    );
    return res.json(code);
  } catch (error) {
    console.error("Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const getCode = async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);
    if (!code) {
      return res.status(404).json({ error: "Code not found" });
    }
    res.json(code);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const saveCode = async (req, res) => {
  try {
    const code = await Code.findByIdAndUpdate(req.params.id, {
      HTML: req.body.editorHTML,
      CSS: req.body.editorCSS,
    });
    res.json(code);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
