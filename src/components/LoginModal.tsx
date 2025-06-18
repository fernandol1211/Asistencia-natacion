// src/components/LoginModal.tsx
import LoginForm from "@/components/LoginForm";

interface LoginModalProps {
  show: boolean;
  onCancel: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  show,
  onCancel,
  onLoginSuccess,
}: LoginModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <LoginForm onCancel={onCancel} onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
