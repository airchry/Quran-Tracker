import { Zap, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../api"

type Props = {
    playerId: number
    player: "player1" | "player2"
    refresh: number
}

function Stats({ playerId, player, refresh }: Props) {

    const [exp, setExp] = useState(0);

    const level = Math.floor(exp / 1000) + 1;
    const currentExp = exp % 1000;
    const percent = (currentExp / 1000) * 100;

    const getLevelEmoji = (level: number) => {
        if (level < 5) return "🌱";
        if (level < 10) return "🌿";
        if (level < 20) return "🌳";
        return "✨";
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerRes = await api.get(`/players/${playerId}`);
                const data = playerRes.data;

                const expValue =
                    player === "player1"
                        ? data.player1_exp
                        : data.player2_exp;

                setExp(expValue);

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [playerId, player, refresh]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 px-5 py-5 bg-white rounded-xl w-xl shadow-xl">
            
            {/* HEADER */}
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-2">
                    <div className="flex justify-center items-center text-2xl font-bold text-white bg-green-500 p-8 rounded-full w-8 h-8">
                        {level}
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-3xl">{getLevelEmoji(level)}</p>
                        <p className="text-sm text-gray-500">Level {level}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <div className="flex gap-1 justify-center items-center">
                        <Zap className="fill-amber-500 text-amber-500"/>
                        <p className="text-amber-500 text-2xl font-bold">{exp}</p>
                    </div>
                    <p className="text-gray-500 text-sm">Total EXP</p>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex flex-col w-full justify-center items-center">
                <div className="flex justify-between w-full text-gray-500 text-sm">
                    <p>Level {level}</p>
                    <p>{currentExp} / 1000 EXP</p>
                    <p>Level {level + 1}</p>
                </div>

                <div className="rounded-full bg-gray-500/30 w-full h-4 mx-4">
                    <div
                        className="rounded-full bg-green-500 h-full transition-all"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* INFO */}
            <div className="flex bg-yellow-500/10 w-full px-3 py-3 rounded-xl gap-1 items-center text-sm">
                <Trophy className="text-amber-500 w-5 h-5"/>
                <p className="text-amber-500 font-bold">{1000 - currentExp} EXP</p>
                <p className="text-gray-500">until next level!</p>
            </div>

        </div>
    )
}

export default Stats