import { CircleCheck } from "lucide-react";

interface MessageStatusProps {
    status: string;
}

export default function MessageStatus({ status }: MessageStatusProps) {
    return (
        <div className="mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="flex-shrink-0">
                <CircleCheck className="w-5 h-5 text-green-600 mt-0.5" />
            </div>
            <p className="text-xs sm:text-sm text-green-700 font-medium">
                {status}
            </p>
        </div>
    );
}