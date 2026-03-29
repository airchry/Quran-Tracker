import { BookOpen, Zap, Star, TrendingUp, StickyNote } from "lucide-react"
import Surahs from "./Surahs"
import { useState, useEffect } from "react"
import type { Surah } from "./Surahs"
import SurahModal from "./SurahModal"
import api from "../api"

type Props = {
    name: string
    playerId: number
    player: "player1" | "player2"
    refresh: number
    onUpdate: () => void
}

function ProgressCard({ name, playerId, player, refresh, onUpdate }: Props) {
    
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [data, setData] = useState<Surah[]>([]);
    const [totalVersesDone, setTotalVersesDone] = useState(0);
    const [completedSurah, setCompletedSurah] = useState(0);
    const [surahRead, setSurahRead] = useState<any[]>([]);
    const [exp, setExp] = useState(0);

    const totalQuranVerses = 6236;
    const percent = ((totalVersesDone / totalQuranVerses) * 100).toFixed(1);

    const level = Math.floor(exp / 1000) + 1;

    const nextSurah = () => {
        setSelectedIndex((prev) => {
            if (prev === null) return 0;
            return (prev + 1) % data.length;
        })
    }

    const prevSurah = () => {
        setSelectedIndex((prev) => {
            if (prev === null) return 0;
            return (prev - 1 + data.length) % data.length;
        })
    }

    useEffect(() => {
        async function getData() {
            const res = await fetch("https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/quran.json")
            const data = await res.json()
            setData(data)
        }
        getData()
    }, [])

    const fetchProgress = async () => {
        try {
            const res = await api.get(
                `/verses/progress?playerId=${playerId}&player=${player}`
            );
            setTotalVersesDone(res.data.total)
        } catch (err) {
            console.error(err);
        }
    }

    const fetchPlayer = async () => {
        try {
            const res = await api.get(`/players/${playerId}`);
            const data = res.data;

            const expValue =
                player === "player1"
                    ? data.player1_exp
                    : data.player2_exp;

            setExp(expValue);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchProgress();
        fetchPlayer();
    }, [playerId, player, refresh])

    const fetchSurahProgress = async () => {
        const res = await api.get(
            `/verses/surah-progress?playerId=${playerId}&player=${player}`
        );

        const count = res.data.filter((s: any) => {
            const surahData = data.find(d => d.id === Number(s.surah));
            return surahData && Number(s.total_done) === surahData.total_verses;
        }).length

        setCompletedSurah(count);
    }

    useEffect(() => {
        if (data.length === 0) return;
        fetchSurahProgress();
    }, [playerId, player, data, refresh])

    const fetchSurahRead = async () => {
        const res = await api.get(
            `/verses/surah-progress?playerId=${playerId}&player=${player}`
        );
        setSurahRead(res.data);
    }

    useEffect(() => {
        fetchSurahRead();
    }, [playerId, player, refresh])

    const getSurahColor = (surahId: number, totalVerses: number) => {
        const progress = surahRead.find(s => Number(s.surah) === surahId);
        if (!progress) return "";

        const done = Number(progress.total_done);

        if (done === 0) return "";
        if (done === totalVerses) return "bg-green-400";
        return "bg-yellow-300";
    }

    const handleReset = async () => {
        const confirmReset = window.confirm("Yakin mau reset progress?");
        if (!confirmReset) return;

        try {
            await api.delete(`/verses/reset?playerId=${playerId}&player=${player}`);

            setTotalVersesDone(0);
            onUpdate();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 px-5 py-5 bg-white rounded-xl w-xl shadow-xl">
            
            <div className="flex justify-start items-center w-full gap-2 pb-5 border-b border-gray-500/20">
                <div className="bg-green-500 rounded-2xl p-4">
                    <BookOpen className="text-white w-8 h-8"/>
                </div>
                
                <div className="flex flex-col gap-1">
                    <p className="text-2xl text-gray-900 font-bold">{name}</p>
                    <div className="flex gap-2">
                        <div className="flex gap-1 items-center">
                            <Zap className="fill-amber-500 text-amber-500 w-4 h-4"/>
                            <p className="text-amber-500 text-sm">{exp}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <Star className="fill-purple-500 text-purple-500 w-4 h-4"/>
                            <p className="text-purple-500 text-sm">Level {level}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full">
                <div className="bg-emerald-500/10 border-2 border-emerald-500/50 p-5 rounded-xl">
                    <div className="flex flex-col items-center">
                        <TrendingUp className="text-emerald-500 w-5 h-5"/>
                        <p className="text-emerald-500 font-bold text-2xl">{percent}%</p>
                        <p className="text-gray-500 text-xs">Complete</p>
                    </div>
                </div>

                <div className="bg-purple-500/10 border-2 border-purple-500/50 p-5 rounded-xl">
                    <div className="flex flex-col items-center">
                        <StickyNote className="text-purple-500 w-5 h-5"/>
                        <p className="text-purple-500 font-bold text-2xl">{totalVersesDone}</p>
                        <p className="text-gray-500 text-xs">Verses</p>
                    </div>
                </div>

                <div className="bg-pink-500/10 border-2 border-pink-500/50 p-5 rounded-xl">
                    <div className="flex flex-col items-center">
                        <BookOpen className="text-pink-500 w-5 h-5"/>
                        <p className="text-pink-500 font-bold text-2xl">{completedSurah}</p>
                        <p className="text-gray-500 text-xs">Surahs</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full gap-1">
                <div className="flex justify-between text-gray-500 font-bold">
                    <p>Overall Journey</p>
                    <p>{totalVersesDone} / 6,236</p>
                </div>
                <div className="w-full h-4 bg-gray-500/20 rounded-full overflow-hidden">
                    <div
                        className="h-4 bg-amber-500 rounded-full"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-col w-full h-96 overflow-y-auto gap-2">
                <Surahs
                    data={data}
                    onSelect={(index) => setSelectedIndex(index)}
                    getSurahColor={getSurahColor}
                />
            </div>

            {selectedIndex !== null && (
                <SurahModal
                    name={data[selectedIndex].transliteration}
                    arabic={data[selectedIndex].name}
                    type={data[selectedIndex].type}
                    total_verses={data[selectedIndex].total_verses}
                    surah={data[selectedIndex].id}
                    playerId={playerId}
                    player={player}
                    onClose={() => setSelectedIndex(null)}
                    onNext={nextSurah}
                    onPrev={prevSurah}
                    onUpdate={onUpdate}
                />
            )}

            <button
                onClick={handleReset}
                className="bg-red-500/50 border-2 border-red-500/50 p-2 rounded-xl text-white"
                >
                Reset Progress
            </button>
        </div>
    )
}

export default ProgressCard