import axios from 'axios';

const endpoint = process.env.NEXT_PUBLIC_AZURE_DOCUMENT_ENDPOINT;
const modelId = "prebuilt-read";
const apiKey = process.env.NEXT_PUBLIC_AZURE_DOCUMENT_KEY;

function uint8ArrayToBase64(uint8Array: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const base64String = Buffer.from(uint8Array).toString('base64'); // Converte para base64
      resolve(base64String);
    } catch (error) {
      reject(error);
    }
  });
}


function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1]; // Remove "data:application/pdf;base64,"
      resolve(base64String || '');
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

async function getAnalyzeResults(resultUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(resultUrl, {
          headers: {
            "Ocp-Apim-Subscription-Key": apiKey,
          },
        });

        if (response.data?.status === 'running' || response.data.status === 'notStarted') {
          setTimeout(checkStatus, 500); // Recheca após 500ms se o status não for concluído
        } else if (response.data?.status === 'succeeded' && response.data?.analyzeResult) {
          resolve(response.data.analyzeResult.content);
        } else {
          reject("Failed to retrieve results.");
        }
      } catch (error) {
        reject(error);
      }
    };
    checkStatus();
  });
}

export default async function analyzeDocument(file: File | Uint8Array): Promise<string> {
  console.log(file instanceof Uint8Array);
  const base64Source = file instanceof File ? await convertFileToBase64(file) : await uint8ArrayToBase64(file);
  
  
  let ocr = '';

  try {
    const response = await axios.post(
      `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=2024-07-31-preview`,
      { base64Source },
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      }
    );

    if (response.status === 202) {
      const resultUrl = response.headers['operation-location'];
      if (resultUrl) {
        ocr = await getAnalyzeResults(resultUrl);
        console.log("OCR Result:", ocr);
      } else {
        throw new Error("Operation location URL not found in headers.");
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }

  return ocr;
}
