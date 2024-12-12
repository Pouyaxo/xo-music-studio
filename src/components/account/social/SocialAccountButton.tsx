interface SocialAccountButtonProps {
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function SocialAccountButton({ connected, onConnect, onDisconnect }: SocialAccountButtonProps) {
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-500">Connected</span>
        <button 
          onClick={onDisconnect}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={onConnect}
      className="text-sm text-blue-500 hover:text-blue-400"
    >
      Connect
    </button>
  );
}