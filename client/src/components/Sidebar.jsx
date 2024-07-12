import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

import aiLogo from '../assets/img/CET_AI_3.png';

import { FaHome } from 'react-icons/fa';
import { SiAlwaysdata } from 'react-icons/si';
import { CiLogout } from 'react-icons/ci';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

const Sidebar = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState({});

  const navigate = useNavigate();
  const handleLogout = () => {
    swal({
      title: 'Are you sure?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((result) => {
      if (result) {
        navigate('/');
      }
    });
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleNestedDropdown = (parentIndex, childIndex) => {
    setOpenNestedDropdowns((prev) => ({
      ...prev,
      [parentIndex]: {
        ...prev[parentIndex],
        [childIndex]: !prev[parentIndex]?.[childIndex],
      },
    }));
  };

  const navlinks = [
    { icon: <FaHome />, title: 'Predict', path: '/home' },
    { icon: <SiAlwaysdata />, title: 'Train NN Model', path: '/train' },
    {
      icon: <SiAlwaysdata />,
      title: 'Train CV Model',
      path: '#',
      isDropdown: true,
      dropdownItems: [
        { title: 'Train New Model', path: '/trainNewModel' },
        { title: 'FineTune Existing Model', path: '/fineTune' },
      ],
    },
    {
      icon: <SiAlwaysdata />,
      title: 'Inference',
      path: '#',
      isDropdown: true,
      dropdownItems: [
        { title: 'Image Inference', path: '/img_inf' },
        {
          title: 'Video Inference',
          path: '#',
          isDropdown: true,
          dropdownItems: [
            { title: 'Live Video', path: '/live_video' },
            { title: 'Pre-recorded Video', path: '/vid_inf' },
          ],
        },
      ],
    },
  ];

  return (
    <main className="h-screen w-[20%] bg-zinc-800 p-[1vw] overflow-hidden text-white flex flex-col justify-between">
      <div id="logo">
        <img src={aiLogo} alt="logo" className="object-cover" />
      </div>

      <div
        id="links"
        className="flex-1 w-full mt-[5vh] text-[1vw] font-semibold select-none overflow-y-auto"
      >
        <div className="flex flex-col gap-[1.5vh] mb-3">
          {navlinks.map((item, index) => {
            return (
              <div key={index} className="w-full flex flex-col">
                {item.isDropdown ? (
                  <>
                    <div
                      onClick={() => toggleDropdown(index)}
                      className="relative list-none w-full flex items-center gap-[1vw] bg-zinc-700 px-[.5vw] py-[.5vh] rounded-[3px] hover:bg-zinc-500 cursor-pointer"
                    >
                      <i>{item.icon}</i>
                      <span>{item.title}</span>
                      <i className="absolute right-2 transition-all text-2xl font-bold">
                        {openDropdowns[index] ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                      </i>
                    </div>
                    {openDropdowns[index] && (
                      <div className="flex flex-col gap-[1.5vh] mt-[1vh] ml-[1vw]">
                        {item.dropdownItems.map((dropdownItem, idx) => {
                          return (
                            <div key={idx} className="w-full flex flex-col">
                              {dropdownItem.isDropdown ? (
                                <>
                                  <div
                                    onClick={() => toggleNestedDropdown(index, idx)}
                                    className="relative list-none w-full flex items-center gap-[1vw] bg-zinc-600 px-[.5vw] py-[.5vh] rounded-[3px] hover:bg-zinc-400 cursor-pointer"
                                  >
                                    <span>{dropdownItem.title}</span>
                                    <i className="absolute right-2 transition-all text-2xl font-bold">
                                      {openNestedDropdowns[index]?.[idx] ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                                    </i>
                                  </div>
                                  {openNestedDropdowns[index]?.[idx] && (
                                    <div className="flex flex-col gap-[1.5vh] mt-[1vh] ml-[1vw]">
                                      {dropdownItem.dropdownItems.map((nestedItem, nestedIdx) => (
                                        <NavLink
                                          key={nestedIdx}
                                          to={nestedItem.path}
                                          className="list-none w-full flex items-center bg-zinc-500 px-[.5vw] py-[.5vh] rounded-[3px] hover:bg-zinc-300"
                                        >
                                          <span>{nestedItem.title}</span>
                                        </NavLink>
                                      ))}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <NavLink
                                  to={dropdownItem.path}
                                  className="list-none w-full flex items-center bg-zinc-600 px-[.5vw] py-[.5vh] rounded-[3px] hover:bg-zinc-400"
                                >
                                  <span>{dropdownItem.title}</span>
                                </NavLink>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className="list-none w-full flex items-center gap-[1vw] bg-zinc-700 px-[.5vw] py-[.5vh] rounded-[3px] hover:bg-zinc-500"
                  >
                    <i>{item.icon}</i>
                    <span>{item.title}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full mb-[2vh]">
        <button onClick={ handleLogout } className="w-full bg-zinc-700 px-[.5vw] py-[.5vh] rounded-[3px] text-xl font-semibold text-left hover:bg-red-500 flex items-center gap-[1vw]">
          <i>
            <CiLogout />
          </i>
          Log Out
        </button>
      </div>
    </main>
  );
};

export default Sidebar;
