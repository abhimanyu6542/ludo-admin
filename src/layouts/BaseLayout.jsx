import React from 'react';
import Sidebar from '../feature/Shared/Sidebar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from '../feature/Shared/Navbar';

function BaseLayout() {
  const open = true;
  
  return (
    <>
      <div className="relative flex flex-col-reverse font-title lg:flex-row">
        <div
          className={`sticky bottom-0 left-0 z-50 w-full bg-[#F9FAFB] lg:fixed lg:left-0 lg:top-0 lg:h-screen ${
            open ? 'lg:min-w-w1 lg:max-w-w1' : 'lg:w-fit'
          }`}
        >
          <div className="mt-5 hidden w-full items-center justify-between lg:flex">
            <div className="ml-5 flex items-center justify-center">
              <img src={'logo'} alt="" className="max-w-[180px]" />
              <h1 className="font-poppins">Baba Ludo Club</h1>
            </div>
          </div>
          <Sidebar />
        </div>

        <div
          className={`relative flex min-h-screen w-full flex-col bg-secondary lg:absolute lg:right-0 ${
            open ? 'lg:w-w2' : 'lg:w-[96%]'
          }`}
        >
           <div className="fixed right-0 top-0 z-40 w-full">
            <Navbar />
          </div>
          <div className="mt-10 w-full px-5">
            <Outlet />
            <ToastContainer progressClassName="my-progress-bar" />
          </div>
        </div>
      </div>
    </>
  );
}

export default BaseLayout;
