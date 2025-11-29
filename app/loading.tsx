import TetrisLoading from "@/components/ui/tetris-loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <TetrisLoading size="md" speed="normal" loadingText="Loading Clovel..." />
    </div>
  );
}
