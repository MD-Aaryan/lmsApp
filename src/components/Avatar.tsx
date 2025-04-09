interface AvatarProps {
  src?: string;
  name: string;
  email: string;
  className?: string;
}
export default function Avatar({ src, name, email }: AvatarProps) {
  return (
    <div className="flex items-center gap-2">
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-16 h-16 rounded-full border-2 border-gray-300"
          height={64}
          width={64}
        />
      ) : (
        <div className="w-12 h-10 bg-gray-300 rounded-full flex ">
          <span className="text-gray-500 font-bold">{name.slice(0, 1)}</span>
        </div>
      )}
      <div className="flex flex-col">
        <p className="font-bold">{name}</p>
        <p className="text-sm font-semibold text-gray-600">{email}</p>
      </div>
    </div>
  );
}
