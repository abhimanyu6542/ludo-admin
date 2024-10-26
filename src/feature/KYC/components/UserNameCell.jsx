/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Profile from '/assets/profile.png';
import { Link } from 'react-router-dom';
import { supabase } from '../../../config/supabaseClient';

const UserNameCell = ({ value }) => {
  const [isManaged, setIsManaged] = useState(false);
  useEffect(() => {
    async function fetchUserData() {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_managed')
        .match({user_name: value})
        .single(); // We expect a single user

      if (userError) {
        console.log('Error fetching user data', userError);
      } else if (userData) {
        setIsManaged(userData.is_managed);
      }
    }

    fetchUserData();
  }, [value]);

  return (
    <div>
      <div className="flex justify-start capitalize items-center gap-3 font-normal text-base text-[#4B5563] font-poppins">
        <img src={Profile} alt="profile" className="w-7 h-7 rounded-full" />
        <Link
          to={`/users?query=${value}`}
          className={`text-xs font-medium underline font-poppins ${isManaged ? 'text-green-500' : 'text-[#EF4444]'}`}
        >
          {value}
        </Link>
      </div>
    </div>
  );
};

export default UserNameCell;
