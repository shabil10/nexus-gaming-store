function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 text-white">
      <div className="text-center">
        <div className="mb-4 text-5xl">
          🎮
        </div>

        <h2 className="text-2xl font-bold">
          {message}
        </h2>

        <p className="mt-2 text-slate-400">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
}

export default LoadingState;