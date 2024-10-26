import React, { useState } from 'react';
import useLogout from '../../Auth/hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';

function LogoutModal({ setShowLogoutModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);

  const handleSignOut = () => {
    useLogout(navigate, dispatch);
    setShowSpinner(true);
  };

  return (
    <>
      <div className="w-full h-full z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0">
        <div className="p-10 bg-secondary border-0 rounded-lg">
          <h1 className=" text-tertiary-t6 text-xl mb-10">Are you sure you want to SignOut?</h1>

          <div className="flex justify-center w-full">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="mr-4 bg-transparent px-10 rounded-md border-2 border-tertiary-t4 py-1.5 text-center text-sm font-medium text-tertiary-t5 hover:bg-primary hover:text-secondary hover:border-primary cursor-pointer"
            >
              No
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-md border-2 border-primary py-1.5 px-10 text-center text-sm font-medium text-secondary cursor-pointer bg-primary"
            >
              Yes
              {showSpinner ? (
                <div className="ml-4">
                  <BasicSpinner />
                </div>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogoutModal;
