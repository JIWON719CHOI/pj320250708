import axios from "axios";

export default function App() {
  /**
   * ✅ [1] 로그인 → JWT 토큰 발급 (sub1)
   */
  const handleLogin = () => {
    axios
      .post("/api/learn/jwt/sub1", {
        email: "son@son.com",
        password: "son",
      })
      .then(({ data }) => {
        console.log("🎟️ 발급된 토큰:", data);
        localStorage.setItem("token", data);
      })
      .catch((err) => {
        console.error("❌ 로그인 실패:", err);
      });
  };

  /**
   * ✅ [2] 로그아웃 → 로컬스토리지에서 토큰 삭제
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("🚪 로그아웃 완료: 토큰 삭제됨");
  };

  /**
   * ✅ [3] 토큰 포함 여부에 따른 일반 인증 확인 요청 (sub2)
   */
  const handleCheckAuth = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/learn/jwt/sub2", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then(({ data }) => {
        console.log("ℹ️ 인증 확인 응답:", data);
      })
      .catch((err) => {
        console.error("❌ 인증 확인 실패:", err);
      });
  };

  /**
   * ✅ [4] 무조건 토큰 없이 인증 확인 요청 (sub2)
   */
  const handleNoToken = () => {
    axios
      .get("/api/learn/jwt/sub2")
      .then(({ data }) => {
        console.log("📭 응답 (토큰 없이):", data);
      })
      .catch((err) => {
        console.error("❌ 요청 실패:", err);
      });
  };

  /**
   * ✅ [5] 로그인 상태 필수 요청 (sub3)
   */
  const handleProtected = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/learn/jwt/sub3", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then(({ data }) => {
        console.log("🔐 보호된 리소스 응답:", data);
      })
      .catch((err) => {
        console.error("🚫 접근 실패:", err);
      });
  };

  /**
   * ✅ [6] 일반 유저 전용 토큰 발급 (sub6)
   */
  const handleUserLogin = () => {
    axios
      .get("/api/learn/jwt/sub6")
      .then(({ data }) => {
        console.log("👤 일반 유저 토큰:", data);
        localStorage.setItem("token", data);
      })
      .catch((err) => {
        console.error("❌ 일반 유저 로그인 실패:", err);
      });
  };

  /**
   * ✅ [7] 관리자(admin) 전용 토큰 발급 (sub7)
   */
  const handleAdminLogin = () => {
    axios
      .get("/api/learn/jwt/sub7")
      .then(({ data }) => {
        console.log("🛡️ 관리자 토큰:", data);
        localStorage.setItem("token", data);
      })
      .catch((err) => {
        console.error("❌ 관리자 로그인 실패:", err);
      });
  };

  /**
   * ✅ [8] 매니저(manager) 전용 토큰 발급 (sub8)
   */
  const handleManagerLogin = () => {
    axios
      .get("/api/learn/jwt/sub8")
      .then(({ data }) => {
        console.log("👔 매니저 토큰:", data);
        localStorage.setItem("token", data);
      })
      .catch((err) => {
        console.error("❌ 매니저 로그인 실패:", err);
      });
  };

  /**
   * ✅ [9] 관리자 전용 리소스 접근 (sub9)
   */
  const handleAdminRequest = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/learn/jwt/sub9", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log("🛡️ 관리자 전용 응답:", data);
      })
      .catch((err) => {
        console.error("🚫 관리자 접근 실패:", err);
      });
  };

  /**
   * ✅ [10] 매니저 전용 리소스 접근 (sub10)
   */
  const handleManagerRequest = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/learn/jwt/sub10", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log("👔 매니저 전용 응답:", data);
      })
      .catch((err) => {
        console.error("🚫 매니저 접근 실패:", err);
      });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h3>🔐 JWT 로그인 & 권한 테스트</h3>
      <div style={{ display: "grid", rowGap: "0.5rem", maxWidth: 360 }}>
        <button onClick={handleLogin}>1. 기본 로그인 (sub1)</button>
        <button onClick={handleLogout}>2. 로그아웃 (토큰 삭제)</button>
        <button onClick={handleCheckAuth}>
          3. 토큰 포함 여부 인증 확인 (sub2)
        </button>
        <button onClick={handleNoToken}>
          4. 무조건 토큰 없이 인증 확인 (sub2)
        </button>
        <button onClick={handleProtected}>
          5. 인증 필수 리소스 요청 (sub3)
        </button>
        <button onClick={handleUserLogin}>6. 일반 유저 토큰 발급 (sub6)</button>
        <button onClick={handleAdminLogin}>7. 관리자 토큰 발급 (sub7)</button>
        <button onClick={handleManagerLogin}>8. 매니저 토큰 발급 (sub8)</button>
        <button onClick={handleAdminRequest}>
          9. 관리자 전용 리소스 요청 (sub9)
        </button>
        <button onClick={handleManagerRequest}>
          10. 매니저 전용 리소스 요청 (sub10)
        </button>
      </div>
    </div>
  );
}
