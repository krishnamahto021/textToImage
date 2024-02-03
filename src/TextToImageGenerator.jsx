import { useState } from "react";
// Your query function
async function query(data) {
  const token = import.meta.env.VITE_TEXT_TO_IMAGE_TOKEN;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob();
  return result;
}

// Main React component
function TextToImageGenerator() {
  const [textInput, setTextInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    try {
      setLoading(true); // Set loading to true while waiting for the response

      const response = await query({ inputs: textInput });
      const resultBlob = new Blob([response]);
      const imageUrl = URL.createObjectURL(resultBlob);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#00b4d8] to-[#90e0ef]">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Text to Image Generator
        </h1>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 resize-none focus:outline-none"
          placeholder="Describe what you want to create through your creativity"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          required
        ></textarea>
        <button
          className="bg-[#03045e] text-[#caf0f8] rounded-md p-2 w-full text-center font-medium"
          onClick={handleGenerateImage}
        >
          Generate Image
        </button>
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03045e]"></div>
              <span className="ml-2">Generating...</span>
            </div>
          ) : (
            imageSrc && (
              <img
                src={imageSrc}
                alt="Generated Image"
                className="w-full rounded-md"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default TextToImageGenerator;
