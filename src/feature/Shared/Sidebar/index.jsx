import React, { useState } from 'react';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import LogoutModal from './LogoutModal';
// -- icons
import { CiWallet, CiMoneyBill } from 'react-icons/ci';
import { LiaUsersSolid } from 'react-icons/lia';
import { MdLogout } from 'react-icons/md';
import { HiBadgeCheck } from 'react-icons/hi';
import { GiBattleGear } from 'react-icons/gi';
import { BiSolidOffer } from 'react-icons/bi';
import { MdHomeFilled } from 'react-icons/md';
import { useSelector } from 'react-redux';

const authSesionState = (state) => state.auth.user;

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = useSelector(authSesionState);
  const claims_admin = user?.app_metadata?.claims_admin || false;
  console.log(claims_admin, 'claims_admin');
  if (showLogoutModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  function signOutUser() {
    setShowLogoutModal(true);
  }

  return (
    <>
      <div className="flex items-center w-full py-2  lg:h-full lg:flex-col lg:items-start lg:pt-7">
        <div className="flex justify-between w-full h-full px-3 lg:mt-5 lg:flex-col lg:items-start ">
          <div className="flex flex-col justify-between">
            <div className="flex justify-start w-2/12 h-1/2 lg:w-full lg:flex-col lg:items-start lg:justify-start">
              {claims_admin === true ? (
                <div className="relative lg:w-full lg:px-1">
                  <NavLink
                    to="/home"
                    className={({ isActive }) => {
                      return clsx(
                        'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                        isActive && ' text-sidebarText'
                      );
                    }}
                  >
                    <div
                      className={
                        `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                        (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                      }
                    >
                      <MdHomeFilled className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                      {open && (
                        <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                          Home
                        </p>
                      )}
                      <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                        Home
                      </p>
                    </div>
                  </NavLink>
                </div>
              ) : null}

              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/users"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <LiaUsersSolid className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Users
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Users
                    </p>
                  </div>
                </NavLink>
              </div>
              {/* <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/kyc-request"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <HiBadgeCheck className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        KYC Requests
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      KYC Requests
                    </p>
                  </div>
                </NavLink>
              </div> */}
              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/add-utr"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <HiBadgeCheck className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Add UTR
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Add UTR
                    </p>
                  </div>
                </NavLink>
              </div>
              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/manage-game"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <HiBadgeCheck className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Manage Game
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Manage Game
                    </p>
                  </div>
                </NavLink>
              </div>

              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/add-money"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <CiMoneyBill className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Add Money Request
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Add Money Request
                    </p>
                  </div>
                </NavLink>
              </div>

              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/battles"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <GiBattleGear className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Battles
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Battles
                    </p>
                  </div>
                </NavLink>
              </div>
              <div className="relative lg:w-full lg:px-1">
                <NavLink
                  to="/withdrawal"
                  className={({ isActive }) => {
                    return clsx(
                      'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                      isActive && ' text-sidebarText'
                    );
                  }}
                >
                  <div
                    className={
                      `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                      (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                    }
                  >
                    <CiWallet className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                    {open && (
                      <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                        Withdrawal
                      </p>
                    )}
                    <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                      Withdrawal
                    </p>
                  </div>
                </NavLink>
              </div>

              {claims_admin === true ? (
                <div className="relative lg:w-full lg:px-1">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) => {
                      return clsx(
                        'flex cursor-pointer flex-col items-center justify-center font-bold text-[#9CA3AF] hover:after:absolute hover:after:left-12 hover:after:top-0.5 hover:after:rounded-md hover:after:border-0 text-xl font-poppins lg:mb-4 lg:flex lg:justify-start lg:p-1.5',
                        isActive && ' text-sidebarText'
                      );
                    }}
                  >
                    <div
                      className={
                        `flex flex-col items-center lg:flex lg:w-full lg:flex-row ` +
                        (open ? ' lg:justify-start lg:py-1' : ' lg:justify-center')
                      }
                    >
                      <BiSolidOffer className={`text-xl text-inherit` + (open && ' lg:mr-2')} />
                      {open && (
                        <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                          Settings
                        </p>
                      )}
                      <p className="flex text-base font-poppins font-medium leading-5 lg:hidden lg:text-[12px]">
                        Settings
                      </p>
                    </div>
                  </NavLink>
                </div>
              ) : null}

              <button
                onClick={() => signOutUser()}
                className={`flex w-[10%] ml-2 ${
                  claims_admin === true ? 'lg:mt-[40px]' : 'lg:mt-[140px]'
                }  cursor-pointer items-center justify-center text-tertiary-t6 hover:font-semibold hover:text-rose-600 hover:after:absolute hover:after:left-12 hover:after:top-1.5 hover:after:rounded-md hover:after:border-0 hover:after:font-medium hover:after:text-secondary sm:flex-row lg:w-full lg:items-center lg:p-1.5 lg:py-2 lg:hover:after:px-2 lg:hover:after:py-1`}
              >
                <div
                  className={`flex flex-col items-center lg:flex lg:w-full lg:flex-row lg:justify-start`}
                >
                  <MdLogout
                    className={`text-xl text-inherit lg:hover:text-inherit ` + (open && ' lg:mr-2')}
                  />
                  {open && (
                    <p className="hidden text-base font-medium leading-5 lg:text-md font-poppins lg:flex">
                      Logout
                    </p>
                  )}
                  <p className="flex text-base font-medium leading-5 font-poppins lg:hidden">
                    Logout
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* -- Logout-Modal -- */}
        {showLogoutModal ? <LogoutModal setShowLogoutModal={setShowLogoutModal} /> : null}
      </div>
    </>
  );
};

export default Sidebar;