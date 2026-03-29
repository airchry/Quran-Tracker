import { ChevronRight, ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import api from "../api"

type Props = {
    name: string
    arabic: string
    type: string
    total_verses: number
    surah: number
    playerId: number
    player: "player1" | "player2"
    onClose: () => void
    onNext: () => void
    onPrev: () => void
    onUpdate: () => void
}

function SurahModal({
    name,
    arabic,
    type,
    total_verses,
    surah,
    playerId,
    player,
    onClose,
    onNext,
    onPrev,
    onUpdate
}: Props) {

    const [selectedVerses, setSelectedVerses] = useState<{ surah: number; verse: number }[]>([]);

    const toggleVerse = async (surah: number, verse: number) => {

        const exists = selectedVerses.some(
            v => Number(v.surah) === surah && Number(v.verse) === verse
        );

        try {
            if (exists) {
                await api.delete("/verses", {
                    data: { playerId, player, surah, verse }
                });

                setSelectedVerses(prev =>
                    prev.filter(v => !(v.surah === surah && v.verse === verse))
                );

            } else {
                await api.post("/verses/complete", {
                    playerId,
                    player,
                    surahNumber: surah,
                    verseNumber: verse
                });

                setSelectedVerses(prev => [...prev, { surah, verse }]);
            }

            onUpdate();

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get(
                `/verses?playerId=${playerId}&player=${player}&surah=${surah}`
            );
            setSelectedVerses(res.data);
        };

        fetchData();
    }, [surah, playerId, player]);

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[60%] bg-white rounded-xl"
            >
                
                <div className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 p-6 text-white rounded-t-xl">
                    <h2 className="font-bold text-3xl">{name}</h2>
                    <p className="text-xl">{arabic}</p>
                    <p>Type: {type}</p>
                    <p>Total Verses: <span className="font-bold">{total_verses}</span></p>
                </div>

                
                <div className="flex flex-col w-full p-6">
                    <p className="font-bold text-gray-500">Select Verse:</p>

                    <div className="grid grid-cols-15 gap-2 max-h-60 overflow-y-auto">
                        {Array.from({ length: total_verses }, (_, i) => i + 1).map((verse) => {

                            const isSelected = selectedVerses.some(
                                v => Number(v.surah) === surah && Number(v.verse) === verse
                            );

                            return (
                                <button
                                    key={verse}
                                    onClick={() => toggleVerse(surah, verse)}
                                    className={`cursor-pointer py-4 rounded-lg text-sm transition-all
                                        ${isSelected
                                            ? "bg-pink-500 text-white"
                                            : "bg-gray-100 hover:bg-pink-500 hover:text-white"
                                        }`}
                                >
                                    {verse}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex justify-center items-center w-full gap-4 mt-5">
                        <button
                            className="bg-emerald-100/50 hover:bg-emerald-200 transition-all rounded-full p-3"
                            onClick={onPrev}
                        >
                            <ChevronLeft />
                        </button>

                        <button
                            className="bg-emerald-100/50 hover:bg-emerald-200 transition-all rounded-full p-3"
                            onClick={onNext}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SurahModal