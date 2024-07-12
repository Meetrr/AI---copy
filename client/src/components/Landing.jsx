
import { MdOutlineLightbulb } from "react-icons/md";

const Landing = () => {
  return (
    <>
    <main className="h-full w-full flex flex-col gap-[3px] items-center justify-center overflow-y-hidden ">
        <i><MdOutlineLightbulb id="bulb_icon" className="text-[2vw]"/></i>
        <h2 id="landing_text" className="text-[1.5vw] font-semibold tracking-tight">The answer to all your car related concerns !</h2>
    </main> 
    </>
  )
}

export default Landing;