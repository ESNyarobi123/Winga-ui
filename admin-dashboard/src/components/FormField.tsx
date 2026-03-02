const inputWrapperClass =
  "border-2 border-gray-200 bg-white rounded-xl min-h-12 px-4 w-full text-foreground focus:outline-none focus:border-winga-primary focus:ring-2 focus:ring-winga-primary/20 transition-colors hover:border-gray-300";
const labelClass = "text-foreground font-medium text-sm mb-2 block";

/** Kept for any legacy classNames reference; new code uses AdminInput/AdminTextarea */
export const inputClassNames = {
  inputWrapper: inputWrapperClass,
  input: "bg-white",
  label: labelClass,
  base: "flex flex-col gap-0",
  helperWrapper: "min-h-0",
};

export const inputClassNamesTall = {
  ...inputClassNames,
  inputWrapper: "border-2 border-gray-200 bg-white rounded-xl min-h-14 px-4 " + "focus:outline-none focus:border-winga-primary focus:ring-2 focus:ring-winga-primary/20 transition-colors",
};

export function formInputProps() {
  return { variant: "bordered" as const, classNames: inputClassNames };
}

/** Input with label above – no floating, no duplicate metadata */
export function AdminInput({
  label,
  value,
  onValueChange,
  onChange,
  placeholder,
  type = "text",
  required,
  className = "",
  id,
  minLength,
  maxLength,
}: {
  label: string;
  value?: string;
  onValueChange?: (v: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
  id?: string;
  minLength?: number;
  maxLength?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };
  const inputId = id ?? `input-${label.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      <label htmlFor={inputId} className={labelClass}>
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className={inputWrapperClass}
      />
    </div>
  );
}

/** Textarea with label above */
export function AdminTextarea({
  label,
  value,
  onValueChange,
  onChange,
  placeholder,
  required,
  className = "",
  id,
  minLength,
  minHeight = "140px",
}: {
  label: string;
  value?: string;
  onValueChange?: (v: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
  minLength?: number;
  minHeight?: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };
  const inputId = id ?? `textarea-${label.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      <label htmlFor={inputId} className={labelClass}>
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      <textarea
        id={inputId}
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="border-2 border-gray-200 bg-white rounded-xl px-4 py-3 w-full text-foreground focus:outline-none focus:border-winga-primary focus:ring-2 focus:ring-winga-primary/20 transition-colors resize-y"
        style={{ minHeight }}
      />
    </div>
  );
}

/** Select (native) wrapper – same look as inputs */
export function AdminSelect({
  label,
  value,
  onChange,
  children,
  required,
  placeholder = "Chagua...",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="border-2 border-gray-200 bg-white rounded-xl min-h-12 px-4 text-foreground focus:outline-none focus:border-winga-primary focus:ring-2 focus:ring-winga-primary/20 transition-colors w-full"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </label>
  );
}

/** Checkbox row for forms */
export function AdminCheckbox({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-winga-primary focus:ring-winga-primary focus:ring-2 transition-all shrink-0"
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground group-hover:text-winga-primary transition-colors">{label}</span>
        {description && <span className="text-xs text-winga-muted-foreground">{description}</span>}
      </div>
    </label>
  );
}
