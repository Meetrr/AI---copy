import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import swal from "sweetalert";
import fileUploadImg from '../assets/img/uploadImage.jpg';

const ImgInference = () => {
  
  const [isImgDisplayed, setImgDisplayed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [models, setModels] = useState([]);
  const [inferToSend, setInferToSend] = useState({ project_type: '', model_name: '', model_path: '', img_str: '', conf: '' });
  const [boxes, setBoxes] = useState([]);
  const [highlightedBoxIndex, setHighlightedBoxIndex] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const imgRef = useRef(null);

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

  const handleImageChange = e => {
    const reader = new FileReader();
    const image = e.target.files[0];
    reader.onloadend = () => {
      const base64 = reader.result.replace('data:', '').replace(/^.+,/, '');
      setSelectedImage(reader.result);
      setImgDisplayed(true);

      setInferToSend(prevState => ({
        ...prevState,
        img_str: base64,
      }));
    };
    reader.readAsDataURL(image);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setInferToSend(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === "model_name") {
      const selectedModel = models.find(model => model.model_name === value);
      if (selectedModel) {
        setInferToSend(prevState => ({
          ...prevState,
          model_path: selectedModel.model_path,
          project_type: selectedModel.project_type
        }));
      }
    }
  };

  const sendInference = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_FETCH_GPU_URL}/infer_img`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inferToSend)
      });
      const infers = await res.json();
      console.log(infers)
      setBoxes(JSON.parse(infers));
      cropImageAreas(JSON.parse(infers)); // Crop images immediately after setting the boxes
    } catch (err) {
      console.log('Error in sending inference:', err);
      swal({ title: 'Error occurred', icon: 'error' });
    }
  }

  const cropImageAreas = (boxData) => {
    const image = new Image();
    image.src = selectedImage;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      const newCroppedImages = boxData.map(box => {
        const { x1, y1, x2, y2 } = box.box;
        const width = x2 - x1;
        const height = y2 - y1;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(
          image,
          x1, y1, width, height,
          0, 0, width, height
        );

        return canvas.toDataURL();
      });

      setCroppedImages(newCroppedImages);
    };
  }

  return (
    <main className="flex h-full w-full">
      <Sidebar />
      <div className='w-full h-screen p-[1vw] overflow-hidden'>
        {!isImgDisplayed ? (
          <div className="w-full h-full mt-5">
            <div id="file_upload_box" className="w-1/2 h-1/2 flex items-center justify-center relative border-2 border-black rounded-3xl bg-[#E6F1FF] overflow-hidden translate-x-1/2 translate-y-1/2">
              <div className="w-11/12 h-5/6 p-3 flex flex-col items-center justify-center rounded-3xl border-2 border-dotted border-black bg-white">
                <input type="file" id="file_upload" className="w-full h-full absolute z-0 opacity-0" onChange={handleImageChange} />
                <div className="flex flex-col items-center p-3 w-full h-full overflow-hidden">
                  <img src={fileUploadImg} alt="" className="w-full h-full object-contain scale-125 pointer-events-none" />
                </div>
                <span className="font-semibold">Browse Image</span>
                <span className="text-sm font-semibold text-zinc-500">Supports Only Images</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex gap-2 mt-5">
            <div className="w-1/2 h-1/2 overflow-hidden flex flex-col gap-5 shadow-lg p-4">
              <div className="w-full h-[400px] relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  ref={imgRef}
                  className="w-full h-full rounded-md"
                />

                {boxes.map((boxData, index) => (
                  <abbr
                    key={index}
                    title={`Name: ${boxData.name}, Confidence: ${boxData.confidence.toFixed(2)}`}
                    className={`${highlightedBoxIndex === index ? 'highlighted' : ''}`}
                    onMouseEnter={() => setHighlightedBoxIndex(index)}
                    onMouseLeave={() => setHighlightedBoxIndex(null)}
                    style={{
                      position: 'absolute',
                      top: `${(boxData.box.y1 / imgRef.current.naturalHeight) * 100}%`,
                      left: `${(boxData.box.x1 / imgRef.current.naturalWidth) * 100}%`,
                      width: `${((boxData.box.x2 - boxData.box.x1) / imgRef.current.naturalWidth) * 100}%`,
                      height: `${((boxData.box.y2 - boxData.box.y1) / imgRef.current.naturalHeight) * 100}%`,
                      border: '3px solid red',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                  </abbr>
                ))}
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div id="selections" className="w-full h-full flex items-center justify-center gap-3">
                  <span className="font-semibold">Model Name</span>
                  <select name="model_name" className="border border-black w-1/2 p-1" value={inferToSend.model_name} onChange={handleChange}>
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
                  <select name="conf" className="border border-black w-1/2 p-1 ml-2" value={inferToSend.conf} onChange={handleChange}>
                    <option defaultChecked>--- Select ---</option>
                    {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((conf, index) => (
                      <option value={conf} key={index}>{conf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div id="selections" className="w-full h-full flex items-center justify-center gap-3">
                <button onClick={sendInference} className="text-white text-lg -tracking-tight px-2 py-2 rounded font-semibold bg-lime-600 w-36 hover:bg-lime-700 transition">
                  Infer
                </button>
              </div>
            </div>

            <div id="left_side_div" className="w-1/2 h-[600px] shadow-lg p-4 overflow-y-auto">
              <div className="mb-2 w-full flex flex-col gap-3">
                {croppedImages.map((src, index) => (
                  <div key={index} className="w-full h-[100px] shadow-lg flex gap-5 p-3 overflow-hidden">
                    <img src={src} alt={`Cropped area ${index}`} className="w-1/2 h-full rounded-md" />
                    <div id="details" className="flex flex-col gap-1">
                      <table className="w-full h-full flex items-center justify-center gap-3">
                        <tbody>
                          <tr>
                            <td>Name: </td> &nbsp;
                            <td className="font-semibold">{boxes[index].name}</td>
                          </tr>
                          <tr>
                            <td>Confidence: </td> &nbsp;
                            <td className="font-semibold">{boxes[index].confidence}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ImgInference;
