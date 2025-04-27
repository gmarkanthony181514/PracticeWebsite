import equilibriumImg from '../assets/images/landingSignUP/eventDetails.svg';
import avatarImg from '../assets/images/landingSignUP/eventDetails.svg';
import { EyeIcon, ClockIcon } from 'lucide-react';

export default function NFTCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d192c]">
      <div className="bg-[#1f2c3b] rounded-xl p-5 max-w-sm w-full shadow-lg text-white font-outfit">
        <div className="relative rounded-xl overflow-hidden group">
          <img src={equilibriumImg} alt="Equilibrium" className="w-full" />
          <div className="absolute inset-0 bg-cyan-400 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <EyeIcon className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-5">
          <h1 className="text-xl font-semibold hover:text-cyan-400 transition">
            <a href="#">Equilibrium #3429</a>
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Our Equilibrium collection promotes balance and calm.
          </p>

          <div className="flex justify-between text-sm items-center">
            <div className="text-cyan-400 font-medium flex items-center gap-1">
              <svg width="9" height="17" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 10.216 5.5 18 0 10.216l5.5 3.263 5.5-3.262ZM5.5 0l5.496 9.169L5.5 12.43 0 9.17 5.5 0Z"
                  fill="#00FFF8"
                />
              </svg>
              0.041 ETH
            </div>
            <div className="text-gray-400 flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              3 days left
            </div>
          </div>

          <div className="border-t border-[#2f415b] pt-4 flex items-center gap-4">
            <img
              src={avatarImg}
              alt="User avatar"
              className="w-8 h-8 rounded-full border border-white"
            />
            <p className="text-gray-400 text-sm">
              Creation of <a href="#" className="text-white hover:text-cyan-400">Jules Wyvern</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
