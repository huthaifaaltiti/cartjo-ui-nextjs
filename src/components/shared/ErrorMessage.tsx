type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full h-full p-3 flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p className="font-medium">Something went wrong</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
