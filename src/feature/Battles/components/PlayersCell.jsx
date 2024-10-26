/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Profile from '/assets/profile.png';
import vs_image from '/assets/vs_image.png';
import { Link } from 'react-router-dom';
import { supabase } from '../../../config/supabaseClient';

const PlayersCell = ({ value }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUser() {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_managed, user_name')
        .in('user_name', [
          value?.created_by,
          value.accepted_by,
        ]);

      if (userError) {
        console.log('Error while fetching users', userError);
      } else {
        setUsers(userData);
      }
    }

    getUser();
  }, [value]);

  const isManaged = (userName) => {
    const user = users.find(u => u.user_name === userName);
    return user?.is_managed;
  };

  return (
    <div className='flex justify-start items-center gap-3'>
      <div className="flex justify-start capitalize items-center gap-3 font-normal text-base text-[#4B5563] font-poppins">
        <img src={Profile} alt="profile" className="w-7 h-7 rounded-full" />
        <Link
          to={`/users?query=${value.created_by}`}
          className={`text-xs font-medium underline font-poppins ${isManaged(value.created_by) ? 'text-green-500' : 'text-[#EF4444]'}`}
        >
          {value.created_by}
        </Link>
      </div>

      <img src={vs_image} alt="vs" />

      <div className="flex justify-start capitalize items-center gap-3 font-normal text-base text-[#4B5563] font-poppins">
        <img src={Profile} alt="profile" className="w-7 h-7 rounded-full" />
        <Link
          to={`/users?query=${value.accepted_by}`}
          className={`text-xs font-medium underline font-poppins ${isManaged(value.accepted_by) ? 'text-green-500' : 'text-[#EF4444]'}`}
        >
          {value.accepted_by}
        </Link>
      </div>
    </div>
  );
};

export default PlayersCell;
