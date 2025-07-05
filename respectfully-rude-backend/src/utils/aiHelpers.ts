import Replicate from "replicate";
import { GoogleGenAI } from "@google/genai";

export const backhandedOutput = async (
  name: string,
  text: string,
  img: any,
  mimeType: string = "image/jpeg"
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "application/json",
  };
  const model = "gemini-2.0-flash";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Generate weird name.
  Use this input -  name: "${name}" and info: ${text} ;
  I have given you the rudest sentence, addressing them by name in one not too short not too long compliment and make 10 years old understand that (make it more brutal and roast the key features) and generate the img prompt for generating img in another model,
  Respond in strict JSON like:
  {
    "name": "changed name original name ${name}",
    "compliments": [
      {
        "text": "Backhanded compliment here.",
        "prompt": "Expected based on the img and complimented text For example: Make this person look like a complete cartoon loser with: messy hair, drooling mouth, dark eye bags, goofy glasses, a shocked expression, cartoon scars on their cheeks, bad fashion and also very funny"
      }
    ]
  }
  ***Only return JSON. No markdown or code block.***`,
        },
      ],
      inlineData: {
        mimeType: mimeType,
        data: img,
      },
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const res = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!res) {
      throw new Error("No text in model response");
    }

    const output = JSON.parse(res);

    return {
      name: output.name,
      compliments: output.compliments?.[0]?.text,
      prompt: output.compliments?.[0]?.prompt,
    };
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to parse response from gemini model");
  }
};

export const imgOutputUrl = async (prompt: string, img: any) => {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const imgOutput = await replicate.run(
      "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d",
      {
        input: {
          image: img,
          prompt: prompt,
          scheduler: "DPMSolverMultistep",
          num_outputs: 1,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          num_inference_steps: 25,
        },
      }
    );

    // @ts-ignore
    return imgOutput[0].url().href;
  } catch (error) {
    console.error("Replicate error:", error);
    throw new Error("Failed to parse response from replicate model");
  }
};
