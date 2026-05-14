interface Props {
  senderType: 'user' | 'provider';
  content: string;
  time: string;
}

export function MessageBubble({ senderType, content, time }: Props) {
  const isProvider = senderType === 'provider';

  return (
    <div className={`flex ${isProvider ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
          isProvider
            ? 'bg-white border border-zinc-200 text-zinc-800'
            : 'bg-emerald-600 text-white'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <span className={`text-xs mt-1 block ${isProvider ? 'text-zinc-400' : 'text-emerald-100'}`}>
          {time}
        </span>
      </div>
    </div>
  );
}
