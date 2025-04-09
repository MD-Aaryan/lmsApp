interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "reset" | "button";
  name?: string;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  label,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: "black",
        color: "white",
        border: "none",
        width: 120,
        height: 40,
        padding: "4px 8px",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 16,
      }}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
