export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="bg-muted h-8 w-40 rounded-md" />
        <div className="bg-muted h-60 rounded-2xl" />
      </div>
    </div>
  );
}
