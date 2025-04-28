import React, { useState } from 'react';

const API_URL = 'http://localhost:8000';

export default function BackendDemo() {
  // State for registration
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBirthday, setRegBirthday] = useState('');
  const [regMsg, setRegMsg] = useState('');

  // State for login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  // State for JWT token
  const [token, setToken] = useState('');

  // State for user info
  const [userInfo, setUserInfo] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [userMsg, setUserMsg] = useState('');

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg('');
    try {
      const res = await fetch(`${API_URL}/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          birthday: regBirthday ? regBirthday : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) setRegMsg('✅ ' + data.message);
      else setRegMsg('❌ ' + (data.detail || 'Registration failed'));
    } catch (err) {
      setRegMsg('❌ Error: ' + err.message);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg('');
    try {
      const params = new URLSearchParams();
      params.append('username', loginUsername);
      params.append('password', loginPassword);
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.access_token);
        setLoginMsg('✅ Login successful!');
      } else {
        setLoginMsg('❌ ' + (data.detail || 'Login failed'));
      }
    } catch (err) {
      setLoginMsg('❌ Error: ' + err.message);
    }
  };

  // Get user info handler
  const handleGetUser = async (e) => {
    e.preventDefault();
    setUserMsg('');
    setUserInfo(null);
    try {
      const res = await fetch(`${API_URL}/user/?username=${encodeURIComponent(userQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserInfo(data);
      else setUserMsg('❌ ' + (data.detail || 'Failed to fetch user info'));
    } catch (err) {
      setUserMsg('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>🚀 FastAPI Backend Demo</h2>

      <section style={{ marginBottom: 32 }}>
        <h3>Register</h3>
        <form onSubmit={handleRegister}>
          <input placeholder="Username" value={regUsername} onChange={e => setRegUsername(e.target.value)} required /> <br />
          <input placeholder="Password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required /> <br />
          <input placeholder="Birthday (YYYY-MM-DD)" value={regBirthday} onChange={e => setRegBirthday(e.target.value)} /> <br />
          <button type="submit">Register</button>
        </form>
        <div>{regMsg}</div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required /> <br />
          <input placeholder="Password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required /> <br />
          <button type="submit">Login</button>
        </form>
        <div>{loginMsg}</div>
        {token && <div style={{ wordBreak: 'break-all', fontSize: 12, marginTop: 8 }}><b>JWT Token:</b> {token}</div>}
      </section>

      <section>
        <h3>Get User Info (Protected)</h3>
        <form onSubmit={handleGetUser}>
          <input placeholder="Username to query" value={userQuery} onChange={e => setUserQuery(e.target.value)} required /> <br />
          <button type="submit" disabled={!token}>Get User Info</button>
        </form>
        <div>{userMsg}</div>
        {userInfo && (
          <pre style={{ background: '#f4f4f4', padding: 10, borderRadius: 4 }}>{JSON.stringify(userInfo, null, 2)}</pre>
        )}
      </section>
    </div>
  );
} 