import { Heart } from "lucide-react"

type Props = {
    isEditingName: boolean
    setIsEditingName: (v: boolean) => void
    player1Name: string
    setPlayer1Name: (v: string) => void
    player2Name: string
    setPlayer2Name: (v: string) => void
    handleSave: () => void
}

function PlayerName({ isEditingName, setIsEditingName, player1Name, setPlayer1Name, player2Name, setPlayer2Name, handleSave }: Props) {

    return (
        <div className="flex flex-col items-center justify-center text-gray-400">
            {isEditingName ? (
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Partner 1 Name"
                    value={player1Name}
                    onChange={ (e) => setPlayer1Name(e.target.value) }
                    className="px-4 py-2 border-2 border-emerald-300 rounded-xl text-center focus:border-emerald-500 focus:outline-none text-gray-700"
                />
                <Heart color="red" className="group-hover:w-7 group-hover:h-7 transition-all"/>
                <input
                    type="text"
                    placeholder="Partner 2 Name"
                    value={player2Name}
                    onChange={ (e) => setPlayer2Name(e.target.value) }
                    className="px-4 py-2 border-2 border-emerald-300 rounded-xl text-center focus:border-emerald-500 focus:outline-none text-gray-700"
                />
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-green-500 transition-colors">Save</button>
            </div>
            ) : (
            <div onClick={ () => setIsEditingName(true) } className="flex items-center gap-2 text-xl font-bold text-gray-700 hover:text-emerald-500 transition-colors group">
                <p>{player1Name}</p>
                <Heart color="red" className="group-hover:w-7 group-hover:h-7 transition-all"/>
                <p>{player2Name}</p>
            </div>
            )}

            <p className="italic text-sm">Click to edit player names</p>
            
        </div>
    )
}

export default PlayerName