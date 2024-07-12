import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { GrPrevious } from "react-icons/gr";

const ModelDetails = () => {
  const [showFolders, setShowFolders] = useState(false);
  const [fetchedFiles, setFetchedFiles] = useState([]);
  const [allFilesFromFolder, setAllFilesFromFolder] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Fetching Models folder Files from backend
  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/get/modelFiles`, {
        method: 'GET'
      });
      const data = await response.json();
      setFetchedFiles(data);
    }
    fetchFiles();
  }, []);

  // To get all files from the specific folder after click event and selecting a folder getting files according to the folder
  const filesFromFolder = async (file) => {
    setSelectedFolder(file);
    const response = await fetch(`${ import.meta.env.VITE_FETCH_URL }/get/allFilesFromFolder/${file}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: file })
    });
    const data = await response.json();
    setAllFilesFromFolder(data);
    setShowFolders(true);
  }

  // To get content of a specific file
  const fetchFileContent = async (folder, file) => {
    const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/get/readFile/${folder}/${file}`);
    const fileType = response.headers.get('Content-Type');
    setFileType(fileType);
    
    if (fileType.includes('image')) {
      const blob = await response.blob();
      setFileContent(URL.createObjectURL(blob));
    } else if (fileType.includes('text/csv')) {
      const text = await response.text();
      setFileContent(text);
    }
  }

  return (
    <main className='flex h-full w-full'>
      <Sidebar/>

      {!showFolders ? (
        <div id="container" className='w-full h-max py-2 px-2 flex flex-col gap-2'>
          <h2 className='font-semibold text-2xl ml-2'>All Models</h2>
          <div id="pills" className='flex flex-wrap gap-2 mt-5'>
            <div className='w-full flex gap-5 flex-wrap sm:text-md'>
              {fetchedFiles.map((file, index) => {
                return (
                  <div id="pill" 
                    key={ index } 
                    onClick={ () => filesFromFolder(file) }
                    className='px-3 py-2 bg-green-500 rounded-md w-[40%] hover:bg-green-400 cursor-pointer text-xl font-semibold overflow-x-auto'
                  >
                    <span className='block w-full text-ellipsis overflow-hidden whitespace-nowrap'>{ index + 1 }. {file}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div id="container" className='h-screen w-full py-2 px-2 flex gap-2'>
          <div id="sidebar_files" className='h-full w-1/6 p-4 shadow-2xl bg-zinc-200 overflow-hidden overflow-y-auto'>
            <div id="buttons_heading" className='flex items-center justify-between'>
              <h2 className='text-2xl font-semibold'>Files</h2>
              <button className='text-lg mr-4' onClick={ () => setShowFolders(false) }><GrPrevious /></button>
            </div>
            <div id="files" className='mt-5'>
              <div className='flex flex-col gap-2 w-full text-lg'>
                {allFilesFromFolder.map((file, index) => {
                  return (
                    <div key={ index } className='flex w-full overflow-x-auto'>
                      <span 
                        className='block w-full bg-zinc-400 mt-2 px-2 py-1 font-semibold rounded-lg hover:bg-zinc-300 cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap'
                        onClick={ () => fetchFileContent(selectedFolder, file) }
                      >
                        { file }
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div id="display-box" className='w-full h-full flex items-center justify-center overflow-auto'>
            {fileType && fileType.includes('image') && fileContent && (
              <img src={fileContent} alt="Selected file" className="max-h-full max-w-full" />
            )}
            {fileType && fileType.includes('text/csv') && fileContent && (
              <pre className="w-full h-full bg-white p-4 overflow-auto">{fileContent}</pre>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default ModelDetails;
