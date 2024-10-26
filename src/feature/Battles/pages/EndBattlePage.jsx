import React, { useEffect, useState } from 'react';
import { setCurrentBattles } from '../../../slice/battle.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBattleUserResponseDataApi } from '../api/battleApi';
import BasicSpinner from '../../../components/Spinner/BasicSpinner';

const EndBattlePage = () => {
  const current_battles = useSelector((state) => state.battle.current_battles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [battleData, setBattleResponseData] = useState([]);
  const handleBack = () => {
    dispatch(setCurrentBattles(null));
    navigate('/battles');
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      let battleResponse = await getBattleUserResponseDataApi(current_battles.id);
      setBattleResponseData(battleResponse.data);
      setIsLoading(false);
    }
    fetchData();
  }, [current_battles.id]);

  const creatorData = battleData?.filter((item) => item.user_type === 'creator');
  const playerData = battleData?.filter((item) => item.user_type === 'player');

  const img_url =
    'https://ejwcfznguynlntyuvznp.supabase.co/storage/v1/object/public/user_win_screenshot/';

  // const downloadImage = (isCreatorImage) => {
  //   console.log(isCreatorImage, 'isCreatorImage');
  //   // Create a temporary anchor element
  //   const link = document.createElement('a');
  //   link.href = isCreatorImage
  //     ? img_url + creatorData[0]?.screenshot
  //     : img_url + playerData[0]?.screenshot;
  //     link.download = 'downloaded_image.jpg'; // Specify the download filename
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link); // Clean up the element after download
  // };
  const downloadImage = (isCreatorImage) => {
    console.log(isCreatorImage, 'isCreatorImage');
    // Create a temporary anchor element

    const url = isCreatorImage
      ? img_url + creatorData[0]?.screenshot
      : img_url + playerData[0]?.screenshot;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = isCreatorImage ? creatorData[0]?.screenshot : playerData[0]?.screenshot;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error fetching the file:', error);
      });
  };

  return (
    <div>
      <div className="flex items-center justify-start w-full">
        <div className="flex text-2xl font-bold font-poppins w-fit items-center p-1 px-2 text-[#1F2937]">
          Game Details
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <BasicSpinner />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 py-3 px-3 bg-green-600 text-white font-medium font-poppins">
            <h1 className="font-poppins font-medium text-base">Game ID: {current_battles?.id} </h1>
            <h1 className="font-poppins font-medium text-base">
              Entry Fee: {current_battles?.entry_fee}{' '}
            </h1>
            <h1 className="font-poppins font-medium text-base">Prize: {current_battles?.prize}</h1>
            <h1 className="font-poppins font-medium text-base">
              Room Code: {current_battles?.room_code}
            </h1>
            <h1 className="font-poppins font-medium capitalize text-base">
              Status: {current_battles?.battle_status}
            </h1>
          </div>
          <div className="flex justify-between items-center mt-4 gap-10">
            <div className="border-2 w-full h-[420px] p-4 break-words rounded-lg shadow-md">
              <h1 className="text-black font-poppins font-medium text-base">
                Player 1 : <span>{current_battles?.created_by}</span>{' '}
              </h1>
              <h1 className="text-black font-poppins font-medium text-base">
                Match Response :{' '}
                <span className="">
                  {creatorData[0]?.match_response ? creatorData[0]?.match_response : 'N/A'}
                </span>{' '}
              </h1>
              <div className="flex justify-start gap-3 text-black font-poppins font-medium text-base">
                Screenshot:
                <span>
                  {creatorData[0]?.screenshot ? (
                    <div>
                      <img
                        src={img_url + creatorData[0]?.screenshot}
                        alt={creatorData[0].user_id}
                        className="border-green-500 w-64 h-64"
                      />

                      <button
                        onClick={() => downloadImage(true)}
                        className="flex border-2 w-fit bg-green-500 cursor-pointer items-center p-1 px-6 rounded-md font-medium text-xl font-title text-white"
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </span>{' '}
              </div>

              <h1 className="text-black font-poppins font-medium text-base">
                Remarks : <span>{creatorData[0]?.remarks ? creatorData[0]?.remarks : 'N/A'}</span>{' '}
              </h1>
            </div>
            <div className="border-2 w-full h-[420px] p-4 break-words rounded-lg shadow-md ">
              <h1 className="text-black font-poppins font-medium text-base">
                Player 2 : <span>{current_battles?.accepted_by}</span>{' '}
              </h1>
              <h1 className="text-black font-poppins font-medium text-base">
                Match Response :{' '}
                <span>{playerData[0]?.match_response ? playerData[0]?.match_response : 'N/A'}</span>{' '}
              </h1>
              <div className="flex justify-start gap-3 text-black font-poppins font-medium text-base">
                Screenshot:
                <span>
                  {playerData[0]?.screenshot ? (
                    <div>
                      <img
                        src={img_url + playerData[0]?.screenshot}
                        alt={playerData[0].user_id}
                        className="border-green-500 w-64 h-64"
                      />
                      <button
                        onClick={() => downloadImage(false)}
                        className="flex border-2 w-fit bg-green-500 cursor-pointer items-center p-1 px-6 rounded-md font-medium text-xl font-title text-white"
                      >
                        Download
                      </button>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </span>{' '}
              </div>
              <h1 className="text-black font-poppins font-medium text-base">
                Remarks : <span>{playerData[0]?.remarks ? playerData[0]?.remarks : 'N/A'}</span>{' '}
              </h1>
            </div>
          </div>

          <div className="flex items-center mt-5 justify-center w-full">
            <div
              onClick={handleBack}
              className="flex border-2 w-fit bg-red-500 cursor-pointer items-center p-1 px-6 rounded-md font-medium text-xl font-title text-white"
            >
              Close
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EndBattlePage;
