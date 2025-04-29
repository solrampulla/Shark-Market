// app/login/page.jsx
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <LoginForm /> {/* Renderiza el formulario aquí */}
    </div>
  );
}