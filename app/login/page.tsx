import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { FaMotorcycle } from "react-icons/fa";


export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex w-full items-center justify-center rounded-lg bg-blue-500 p-3 ">
          <div className="w-32 text-white md:w-36">
          <div className="w-32 text-white items-center flex gap-2 md:w-40">
        <FaMotorcycle className='text-2xl'/> MotoManage
        </div>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
