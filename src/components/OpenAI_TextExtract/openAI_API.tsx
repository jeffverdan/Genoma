import OpenAI from "openai";

interface Props {
    prompt?: string,
    ocr?: string
}

const openAI_API = async ({prompt, ocr}: Props) => {
    if(!ocr || !prompt) {
        console.log("Faltando prompt ou OCR");        
        return ''
    };
    const openai = new OpenAI({
        apiKey: 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        organization: "org-MFjoQjFayvW1Ctt9vaN5epde",
        project: "proj_VwLGCeyesuvs4eID0VJzSTY9",
        dangerouslyAllowBrowser: true
    });
    
    const completion = await openai.chat.completions.create({
        messages: [{
            role: "system",
            content: `${prompt} "${ocr}"`
        }],
        response_format: {
            type: "json_object"
        },
        // seed: 1,
        temperature: 0.06,
        model: "gpt-3.5-turbo",
    });

    return completion as any;
}

export default openAI_API;