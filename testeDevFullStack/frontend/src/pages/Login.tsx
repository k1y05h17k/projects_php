import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import Field from "../components/ui/Field";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import PasswordInput from "../components/ui/PasswordInput";

const TOKEN_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || "app_token";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, reload } = useAuth();

  // já logado? manda pra /users
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/users", { replace: true });
    }
  }, [authLoading, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem(TOKEN_KEY, res.access_token);
      await reload();
      // força troca de rota (evita algum estado preso)
      window.location.assign("/users");
    } catch (err: any) {
      setError(err?.response?.data?.message || "E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container"
      style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}
    >
      <div className="card" style={{ width: 420 }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <form onSubmit={onSubmit} className="grid">
          <Field label="E-mail">
            <TextInput
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              required
            />
          </Field>

          <Field label="Senha">
            <PasswordInput
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              placeholder="••••••••"
              required
            />
          </Field>
          <Button type="submit" loading={loading}>
            Entrar
          </Button>
          {error && <p className="error">{error}</p>}

          <div className="row" style={{ justifyContent: "space-between" }}>
            <Link to="/signup" className="ghost">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
