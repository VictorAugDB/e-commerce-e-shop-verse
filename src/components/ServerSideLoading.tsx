export default function ServerSideLoading() {
  const circumference = Math.PI * 20 * 2

  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed top-0 flex h-full w-full items-center justify-center bg-black/80 text-white">
      <div className="relative h-12 w-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="h-12 w-12 animate-spinner fill-none stroke-[url(#GradientColor)] stroke-[.5rem]"
          strokeDasharray={circumference}
        >
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor="#aa5656" />
              <stop offset="100%" stopColor="#32502e" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
