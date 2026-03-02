const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
const variants = {
  primary: "bg-winga-primary text-white hover:bg-winga-primary-dark focus:ring-winga-primary btn-primary-winga",
  flat: "bg-transparent hover:bg-gray-100 text-foreground focus:ring-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  light: "bg-gray-100 text-foreground hover:bg-gray-200 focus:ring-gray-300",
};
const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function AdminButton({
  children,
  onPress,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  isLoading,
  startContent,
  endContent,
  className = "",
  isIconOnly,
  "aria-label": ariaLabel,
}: {
  children?: React.ReactNode;
  onPress?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "flat" | "danger" | "light";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
  isIconOnly?: boolean;
  "aria-label"?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onPress?.();
  };
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${sizes[size]} ${isIconOnly ? "p-0 min-w-[2.5rem]" : ""} ${className}`}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {startContent}
          {children}
          {endContent}
        </>
      )}
    </button>
  );
}
