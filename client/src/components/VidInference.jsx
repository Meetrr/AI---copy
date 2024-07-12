import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import uploadVideo from '../assets/img/uploadVideo2.jpg';
import swal from "sweetalert";

const VidInference = () => {
  const [isVideoDisplayed, setVideoDisplayed] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [models, setModels] = useState([]);
  const [videoInfers, setVideoInfers] = useState({ model_name: '', conf:'' });
  const [videoDetailsFromBackend, setVideoDetailsFromBackend] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_FETCH_URL}/get/model`, {
          method: 'GET'
        });
        const models = await res.json();
        setModels(models);
      } catch (err) {
        console.log('Error in fetching models in ImgInference:', err);
      }
    };
    fetchData();
  }, []);

  const handleVideoChange = e => {
    const video = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedVideo(video); // Store the File object itself
      setVideoDisplayed(true);
    };

    reader.onerror = () => {
      console.error("Error reading video file");
    };

    reader.readAsDataURL(video);
  };

  const sendVideoInference = async () => {
    if (!selectedVideo) return swal({ title: 'Video not found', icon: 'warning' });

    const formData = new FormData();
    formData.append("video", selectedVideo);
    formData.append("model_name", videoInfers.model_name);

    try {
      await fetch(`${import.meta.env.VITE_FETCH_URL}/get/infer_video`, {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => setVideoDetailsFromBackend(data))
      .then(async () => {
        const sendToGPU = await fetch(`${import.meta.env.VITE_FETCH_GPU_URL}/infer_vid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videoDetailsFromBackend)
        });

        const data = await sendToGPU.json();
        console.log(data);
      });
    } catch (err) {
      console.log('Error in VideInference:', err);
      return swal({ title: 'Error occurred', icon: 'error' });
    }
  };

  return (
    <main className="w-full h-screen flex">
      <Sidebar />
      <div id="video_inference_div" className="w-full h-full p-[1vw] overflow-hidden">
        {!isVideoDisplayed ? (
          <div className="w-full h-full mt-5">
            <div id="file_upload_box" className="w-1/2 h-1/2 flex items-center justify-center relative border-2 border-black rounded-3xl bg-green-400 overflow-hidden translate-x-1/2 translate-y-1/2">
              <div className="w-11/12 h-5/6 p-3 flex flex-col items-center justify-center rounded-3xl border-2 border-dotted border-black bg-white">
                <input type="file" id="file_upload" className="w-full h-full absolute z-0 opacity-0" onChange={handleVideoChange} name="video" />
                <div className="flex flex-col items-center p-3 w-full h-full overflow-hidden">
                  <img src={uploadVideo} alt="" className="w-full h-full object-contain scale-125 pointer-events-none" />
                </div>
                <span className="font-semibold">Browse Video</span>
                <span className="text-sm font-semibold text-zinc-500">Supports Only Videos</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex gap-2 mt-5">
            <div className="w-1/2 h-1/2 overflow-hidden flex flex-col gap-5 shadow-lg p-4">
              <div className="w-full h-[400px] relative">
                <video
                  src={URL.createObjectURL(selectedVideo)}
                  alt="Selected"
                  className="w-full h-full rounded-md"
                  controls
                  autoPlay
                />
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div id="selections" className="w-full h-full flex items-center justify-center gap-3">
                  <span className="font-semibold">Model Name</span>
                  <select name="model_name" className="border border-black w-1/2 p-1" value={videoInfers.model_name} onChange={e => setVideoInfers({ ...videoInfers, [e.target.name]: e.target.value })}>
                    <option defaultChecked selected>--- Select ---</option>
                    {models.map((model, index) => (
                      <option value={model.model_name} key={index}>
                        {model.model_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div id="selections" className="w-full h-full flex items-center justify-center gap-3">
                  <span className="font-semibold">Confidence</span>
                  <select name="conf" className="border border-black w-1/2 p-1 ml-2" value={videoInfers.conf} onChange={e => setVideoInfers({ ...videoInfers, [e.target.name]: e.target.value })}>
                    <option defaultChecked>--- Select ---</option>
                    {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((conf, index) => (
                      <option value={conf} key={index}>{conf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div id="selections" className="w-full h-full flex items-center justify-center gap-3">
                <button onClick={sendVideoInference} className="text-white text-lg -tracking-tight px-2 py-2 rounded font-semibold bg-lime-600 w-36 hover:bg-lime-700 transition">
                  Infer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default VidInference;