import { FaMotorcycle } from 'react-icons/fa';

export default function AcmeLogo() {
  return (
    <div
      className={` flex flex-row items-center leading-none text-white`}
    >
      <div className="text-4xl text-white items-center flex gap-2">
        <FaMotorcycle className='text-6xl'/> MotoManage
        </div>
    </div>
  );
}
