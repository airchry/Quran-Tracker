import PartnerName from "../components/PlayerName"
import Banner from "../components/Banner"
import Stats from "../components/Stats"
import ProgressCard from "../components/ProgressCard"
import { useState, useEffect } from "react"
import api from "../api"

function Home() {

    const [isEditingName, setIsEditingName] = useState(false);
    const [player1Name, setPlayer1Name] = useState("Player 1");
    const [player2Name, setPlayer2Name] = useState("Player 2");
    const playerId = 1;

    const [refresh, setRefresh] = useState(0);
    const triggerRefresh = () => {
        setRefresh(prev => prev + 1);
    }

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const res = await api.get("/players");
                const data = res.data;

                if (data) {
                    setPlayer1Name(data.player1_name || "Player 1");
                    setPlayer2Name(data.player2_name || "Player 2");
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchNames();
    }, []);

    const handleSave = async () => {
        try {
            const res = await api.put("/players", { 
                player1Name,
                player2Name
            });

            setPlayer1Name(res.data.player1_name);
            setPlayer2Name(res.data.player2_name);

            setIsEditingName(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center items-baseline gap-4">
                <h1 className="font-[Poppins] text-6xl leading-none font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">Qur'an Quest</h1>
            </div>

            <h2 className="text-gray-500 text-xl font-bold">Epic Journey to Jannah</h2>

            <PartnerName isEditingName={isEditingName} setIsEditingName={setIsEditingName} player1Name={player1Name} setPlayer1Name={setPlayer1Name} player2Name={player2Name} setPlayer2Name={setPlayer2Name} handleSave={handleSave}/>

            <Banner className="mb-10"/>

            <div className="grid grid-cols-2 gap-10">
                <Stats playerId={playerId} player="player1" refresh={refresh}/>
                <Stats playerId={playerId} player="player2" refresh={refresh}/>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <ProgressCard name={player1Name} playerId={playerId} player="player1" refresh={refresh} onUpdate={triggerRefresh} />
                <ProgressCard name={player2Name} playerId={playerId} player="player2" refresh={refresh} onUpdate={triggerRefresh} />
            </div>
            
        </div>
    )
}

export default Home