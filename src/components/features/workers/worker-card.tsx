import { Mail, ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Supports both legacy (joined, type, country, avatar, bio) and WorkerListItem (location, title, description, profileImageUrl). */
interface WorkerCardProps {
    id: string;
    name: string;
    joined?: string;
    type?: string;
    country?: string;
    avatar?: string;
    bio?: string;
    /** WorkerListItem: location */
    location?: string;
    /** WorkerListItem: title / headline */
    title?: string;
    /** WorkerListItem: description */
    description?: string;
    profileImageUrl?: string;
    tags: string[];
    profileVerified?: boolean;
    profileCompleteness?: number;
    onClick?: () => void;
    onActionClick?: (e: React.MouseEvent) => void;
}

export function WorkerCard({
    name,
    joined,
    type,
    country,
    avatar,
    bio,
    location,
    title,
    description,
    profileImageUrl,
    tags,
    profileVerified,
    onClick,
    onActionClick,
}: WorkerCardProps) {
    const displayCountry = country ?? location ?? "";
    const displayType = type ?? title ?? "";
    const displayBio = bio ?? description ?? "";
    const displayAvatar = avatar ?? profileImageUrl ?? "";

    return (
        <div
            className="bg-white rounded-2xl p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0px_4px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300 border border-border/50 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={displayAvatar || "/placeholder-avatar.png"}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover border border-border"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                    {joined && (
                        <span className="text-xs font-semibold text-muted-foreground mb-1 block">
                            {joined}
                        </span>
                    )}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-[#111827]">{name}</h3>
                        {displayCountry && (
                            <span className="text-sm bg-muted px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                                🌍 {displayCountry}
                            </span>
                        )}
                        {displayType && (
                            <span className="text-sm bg-[#E6F3EE] text-[#006E42] px-2 py-0.5 rounded font-bold">
                                {displayType}
                            </span>
                        )}
                        {profileVerified && (
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <BadgeCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                        )}
                    </div>
                    <p className="text-[#4B5563] text-sm md:text-base leading-relaxed mb-4">
                        {displayBio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {(Array.isArray(tags) ? tags : []).map((tag, idx) => (
                            <span
                                key={`${idx}-${String(tag)}`}
                                className="text-xs font-semibold bg-[#F3F4F6] text-[#374151] px-3 py-1.5 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions Layout like Winga */}
                <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6 min-w-[180px]">
                    <Button
                        className="w-full bg-[#006E42] hover:bg-[#005a35] text-white rounded-full font-bold h-11 shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onActionClick?.(e);
                        }}
                    >
                        <Mail className="w-4 h-4 mr-2" /> Message
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full rounded-full font-bold h-11 text-[#006E42] border-[#006E42]/20 hover:bg-[#E6F3EE] hover:text-[#006E42]"
                        onClick={(e) => {
                            e.stopPropagation();
                            onActionClick?.(e);
                        }}
                    >
                        Contact Info <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
