import React, { useEffect, useState } from 'react';

const TxnStatusCell = ({ value }) => {
  const [status, setStatus] = useState();
  useEffect(() => {
    switch (value) {
      case 'recharge': {
        setStatus('Wallet recharge');
        return;
      }
      case 'withdrawn': {
        setStatus('Coin Redeem');
        return;
      }
      case 'battle_won': {
        setStatus('Battle win');
        return;
      }
      case 'battle_entry_fee': {
        setStatus('Deduct for Battle join');
        return;
      }
      case 'battle_rejected': {
        setStatus('Refund for Cancel Battle');
        return;
      }
      case 'refunded': {
        setStatus('Refund');
        return;
      }
      case 'battle_entry_fee_refunded': {
        setStatus('Battle fee refunded');
        return;
      }
      case 'referral_bonus': {
        setStatus('Referral Bonus');
        return;
      }
      case 'admin_credit': {
        setStatus('Credited by Admin');
        return;
      }
      case 'admin_debit': {
        setStatus('Debited by Admin');
        return;
      }
      default: {
        setStatus('----');
        return;
      }
    }
  }, [value]);

  return (
    <>
      <p className='text-black font-poppins'>{status}</p>
    </>
  );
};
export default TxnStatusCell;
