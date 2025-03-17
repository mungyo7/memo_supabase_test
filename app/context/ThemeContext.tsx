"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 기본값을 light로 설정
  const [theme, setTheme] = useState<Theme>("light");

  // 초기 테마 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 로컬 스토리지에서 테마 확인
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      
      // 저장된 테마가 있으면 사용, 없으면 기본값으로 light 사용
      const initialTheme = savedTheme || "light";
      
      setTheme(initialTheme);
      
      // HTML 요소에 클래스 적용
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // ... 나머지 코드 유지 ...
} 