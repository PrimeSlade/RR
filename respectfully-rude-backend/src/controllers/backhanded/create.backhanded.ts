import type { Context } from "hono";
import { backhandedOutput, imgOutputUrl } from "../../utils/aiHelpers.ts";

const createList = async (c: Context) => {
  const formData = await c.req.formData();

  const name = formData.get("name");
  const text = formData.get("text");
  const imgFile = formData.get("img");

  if (!imgFile || !(imgFile instanceof File)) {
    return c.text("No image uploaded or wrong field name", 400);
  }

  const arrayBuffer = await imgFile?.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  //const img = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  const img = `data:${imgFile?.type};base64,${buffer.toString("base64")}`;

  try {
    // @ts-ignore
    const genOutPut = await backhandedOutput(name, text, img);
    console.log(genOutPut.name, genOutPut.compliments);

    if (!genOutPut.prompt) {
      throw new Error("Error getting a promt from model");
    }

    const imgUrl = await imgOutputUrl(genOutPut.prompt, img);
    console.log(imgUrl);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        data: null,
        msg:
          error instanceof Error
            ? error.message
            : "Could not create a new backhanded",
      },
      500
    );
  }
};

export { createList };
