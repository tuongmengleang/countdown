import {NewYearCountdown} from "./components/Countdown.tsx";
import Snowfall from "./components/Snowfall.tsx";

function App() {
    return (
        <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
            {/* Background Elements */}
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber/10 blur-[120px] rounded-full pointer-events-none" />
            
            <Snowfall />
            {/*<CountdownTimer />*/}
            <NewYearCountdown />
        </div>
    )
}

export default App
