export type Surah = {
id: number
name: string
transliteration: string
type: string
total_verses: number
}

type Props = {
    data: Surah[]
    onSelect: (index: number) => void
    getSurahColor: (id: number, total: number) => string
}

function Surahs({ data, onSelect, getSurahColor }: Props) {

    return (
        <div>
            {data.map((surah, index) => (
                <div key={surah.id} onClick={ () => onSelect(index) } className="cursor-pointer w-full mb-2 bg-white shrink-0">
                    <div className="flex w-full gap-2 justify-between items-center">
                        <div className={`w-full flex items-center border rounded-2xl border-gray-500/30 border-b-3 border-b-pink-500 py-2 px-2 gap-2 ${getSurahColor(surah.id, surah.total_verses)}`}>
                            <div className="flex justify-center items-center px-5 py-3 w-14 h-14 bg-pink-500 rounded-xl text-white text-xl font-bold">
                                <div>{surah.id}</div>
                            </div>
                            <div className="flex flex-col justify-center w-full">
                                <p className="text-2xl text-purple-500 font-bold">{surah.transliteration}</p>
                                <p className="text-gray-500">{surah.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Surahs