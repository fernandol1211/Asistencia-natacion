import LoginForm from "./LoginForm";

interface LoginModalProps {
  show: boolean;
  onCancel: () => void;
  onLoginSuccess: () => void;
  onRegisterSuccess: () => void;
}

export default function LoginModal({
  show,
  onCancel,
  onLoginSuccess,
  onRegisterSuccess,
}: LoginModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <LoginForm
          onCancel={onCancel}
          onLoginSuccess={onLoginSuccess}
          onRegisterSuccess={onRegisterSuccess}
        />
      </div>
    </div>
  );
}
