import React, { useState } from 'react'
import { MdFileDownload } from "react-icons/md";
import { supabase } from '../../../config/supabaseClient';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';

const DownLoadCell = ({value}) => {
  const [isDownLoad, setIsDownLoad]= useState(false)
   const downloadImage = async () => {
    setIsDownLoad(true)
    setTimeout(()=>{
      setIsDownLoad(false)
    }, 2000)

    // Attempt to download the image from Supabase storage
    const { data: aadhaar_front_data, error: aadhaar_front_error } = await supabase
        .storage
        .from('aadhaar_front_side')
        .download(value.aadhaar_front);

    if (aadhaar_front_error) {
        console.error('Error downloading image:', aadhaar_front_error);
        setIsDownLoad(false)
        return;
    }

    // Create a blob URL for the downloaded data
    const url = URL.createObjectURL(aadhaar_front_data);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = value.aadhaar_front.split('/').pop(); // Use the file name from the path
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // Attempt to download the image from Supabase storage
    const { data: aadhaar_back_data, error: aadhaar_back_error } = await supabase
        .storage
        .from('aadhaar_back_side')
        .download(value.aadhaar_back);

    if (aadhaar_back_error) {
        console.error('Error downloading image:', aadhaar_back_error);
        setIsDownLoad(false)
        return;
    }

    // Create a blob URL for the downloaded data
    const url_back = URL.createObjectURL(aadhaar_back_data);

    // Create a temporary anchor element to trigger the download
    const b = document.createElement('a');
    b.href = url_back;
    b.download = value.aadhaar_back.split('/').pop(); // Use the file name from the path
    document.body.appendChild(a);
    b.click();

    // Clean up
    document.body.removeChild(b);
    URL.revokeObjectURL(url_back);

  
}

  return (
    <div>
       <div className='flex justify-start px-5 cursor-pointer items-center'>
        {
          isDownLoad ? <div className='ml-2'><BasicSpinner /></div> : <MdFileDownload onClick={downloadImage} className='text-[#1F2937] w-6 h-6' />
        }
         
        </div> 
    </div>
  )
}

export default DownLoadCell