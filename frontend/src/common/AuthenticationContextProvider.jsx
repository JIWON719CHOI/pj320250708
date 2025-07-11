import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// 유효기간을 넘긴 토큰 삭제
const token = localStorage.getItem("token");
if (token) {
  const decoded = jwtDecode(token);
  const exp = decoded.exp;
  if (exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  }
}

// axios interceptor - 토큰이 있으면 Authorization 헤더에 `Bearer token` 붙이기
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// step1. create context
const AuthenticationContext = createContext(null);

export function AuthenticationContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 초기 마운트 시 로컬스토리지에서 토큰 꺼내기
    const raw = localStorage.getItem("token");
    if (!raw) return; // 토큰 없으면 종료

    // JWT 문자열 검증
    const parts = raw.split(".");
    if (parts.length !== 3) {
      console.warn("Invalid JWT format, removing token:", raw);
      localStorage.removeItem("token");
      return;
    }

    // 디코딩 시도
    let payload;
    try {
      payload = jwtDecode(raw);
    } catch (e) {
      console.error("Failed to decode JWT:", e);
      localStorage.removeItem("token");
      return;
    }

    // 사용자 정보 조회
    axios
      .get(`/api/member?email=${payload.sub}`)
      .then((res) => {
        setUser({
          email: res.data.email,
          nickName: res.data.nickName,
        });
      })
      .catch((err) => {
        console.error("회원 정보 조회 실패:", err);
      });
  }, []);

  // login 함수 수정: 객체 또는 문자열 둘 다 처리
  function login(tokenObj) {
    // tokenObj가 문자열인지 객체인지 확인
    const tokenString =
      typeof tokenObj === "string"
        ? tokenObj
        : tokenObj && typeof tokenObj.token === "string"
          ? tokenObj.token
          : "";

    if (!tokenString) {
      console.error(
        "⚠️ 로그인 후 유효한 토큰 문자열을 찾을 수 없습니다:",
        tokenObj,
      );
      return;
    }

    // 로컬스토리지에 순수 JWT 문자열 저장
    localStorage.setItem("token", tokenString);

    // 위와 동일한 검증/디코딩 로직
    const parts = tokenString.split(".");
    if (parts.length !== 3) {
      console.error(
        "로그인 후 받은 토큰 형식이 올바르지 않습니다:",
        tokenString,
      );
      return;
    }

    let payload;
    try {
      payload = jwtDecode(tokenString);
    } catch (e) {
      console.error("로그인 후 토큰 디코딩 실패:", e);
      return;
    }

    axios
      .get(`/api/member?email=${payload.sub}`)
      .then((res) => {
        setUser({
          email: res.data.email,
          nickName: res.data.nickName,
        });
      })
      .catch((err) => {
        console.error("로그인 후 회원 정보 조회 실패:", err);
      });
  }

  // logout: 토큰 삭제 및 유저 상태 초기화
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // step3. provide context
  return (
    <AuthenticationContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext };
