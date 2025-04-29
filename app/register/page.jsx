// app/register/page.jsx
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div>
      <h1>Crea tu Cuenta</h1>
      <RegisterForm /> {/* Renderiza el formulario aquí */}
    </div>
  );
}