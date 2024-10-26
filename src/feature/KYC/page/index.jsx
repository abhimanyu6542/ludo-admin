import React from 'react';
import TableBody from '../../../components/Table/TableBody';
import { SearchUser } from '../../Users/utils/SearchUser';
import GenericTextCell from '../../../components/Table/GenericTextCell';
import DownLoadCell from '../components/DownLoadCell';
import UserNameCell from '../components/UserNameCell';
import KycEditCell from '../components/KycEditCell';
import { userGetKycQuery } from '../hooks/userGetKycQuery';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';
import KycStatusCell from '../components/KycStatusCell';

const KycRequestTable = () => {

  const getSchema = () => {
    const columns = [
      {
        Header: `User name`,
        accessor: 'users',
        Cell: ({ row }) => (
          <UserNameCell value={row.original.users.user_name ? row.original.users.user_name : 'Not Available'} />
        ),
      },
      {
        Header: `Phone`,
        accessor: 'user_id',
        Cell: ({ row }) => (
          <GenericTextCell
            value={row.original.user_id ? row.original.user_id : 'Not Available'}
          />
        ),
      },
      {
        Header: `Email`,
        accessor: 'email',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.email ? row.original.email : 'Not Available'} />
        ),
      },

      {
        Header: `Aadhar`,
        accessor: 'aadhaar_number',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.aadhaar_number ? row.original.aadhaar_number : 'Not Available'} />
        ),
      },
      {
        Header: `DOB`,
        accessor: 'dob',
        Cell: ({ row }) => (
          <GenericTextCell value={row.original.dob ? row.original.dob : 'Not Available'} />
        ),
      },
      {
        Header: `Status`,
        accessor: 'kyc_status',
        Cell: ({ row }) => (
          <KycStatusCell value={row.original.kyc_status ? row.original.kyc_status : 'Not Available'} />
        ),
      },

      {
        Header: `Documents`,
        accessor: 'created_at',
        Cell: ({ row }) => (
          <DownLoadCell
            value={row.original ? row.original : 'Not Available'}
          />
        ),
      },
      {
        Header: `Actions`,
        Cell: ({ row }) => <KycEditCell row={row} />,
      },
    ];
    return columns;
  };

  const userGetKycData = userGetKycQuery()

  console.log(userGetKycData, "userGetKycDataFromApi")
  const column = getSchema();
  return (
    <div>
      <div className="w-full px-2 py-3 mb-2 border-0 rounded-md bg-secondary lg:px-6 lg:py-7">
        <div className="flex items-center mb-3 w-[60%]">
          <h1 className=" font-medium text-2xl font-poppins mr-6">Manual KYC requests</h1>

          <SearchUser />
        </div>
        {userGetKycData.isLoading || userGetKycData.isFetching ? (
          <div className="flex items-center justify-center w-full my-20">
            {' '}
            <BasicSpinner />{' '}
          </div>
        ) : userGetKycData.data.data.length === 0 ? (
          <div className="flex items-center justify-center pb-20 mx-auto mt-16 text-2xl font-bold text-primary">
            No Data Available
          </div>
        ) : (
          <TableBody columns={column} data={userGetKycData.data.data} />
        )}
        {/* <TableBody columns={column} data={data} /> */}
      </div>
    </div>
  );
};

export default KycRequestTable;
