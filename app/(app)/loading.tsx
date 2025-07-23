import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20">
      <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
    </div>
  );
}

export default Loading;