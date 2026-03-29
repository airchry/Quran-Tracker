function Banner({ className = "" }) {
    return (
        <div className={`flex justify-center bg-gradient-to-r from-cyan-500 to-emerald-500 py-5 px-8 rounded-2xl text-xl text-white ${className}`}>
            <p>The real treasure is the knowledge we gain along the way.</p>
        </div>
    )
}

export default Banner;