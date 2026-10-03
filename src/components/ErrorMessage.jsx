function ErrorMessage({
  title = "Something went wrong",
  message
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 text-white">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">

        <div className="mb-3 text-4xl">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold text-red-400">
          {title}
        </h2>

        <p className="mt-2 text-slate-300">
          {message}
        </p>

      </div>
    </div>
  );
}

export default ErrorMessage;