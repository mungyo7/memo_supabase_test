"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

// Page 테이블의 타입 정의
interface Page {
  id: string;
  title: string;
  body: string;
  created_at: string;
  user_id: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  // 인증 상태 확인 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // 로그인한 사용자의 페이지 데이터 불러오기
  useEffect(() => {
    if (user) {
      fetchPages();
    }
  }, [user]);

  // Supabase에서 사용자별 페이지 데이터 가져오기
  const fetchPages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("page")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setPages(data);
      }
    } catch (error) {
      console.error("페이지를 불러오는 중 오류가 발생했습니다:", error);
      alert("페이지를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 새 메모 저장하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }
    
    if (!title.trim() || !body.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("page")
        .insert([{ title, body, user_id: user.id }])
        .select();

      if (error) {
        throw error;
      }

      // 저장 성공 후 입력 필드 초기화
      setTitle("");
      setBody("");
      
      // 목록 새로고침
      fetchPages();
    } catch (error) {
      console.error("메모 저장 중 오류가 발생했습니다:", error);
      alert("메모 저장 중 오류가 발생했습니다.");
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR");
  };
  
  // 로그아웃 처리
  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // 메모 삭제 기능
  const handleDelete = async (pageId: string) => {
    if (!confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("page")
        .delete()
        .eq("id", pageId)
        .eq("user_id", user?.id); // 사용자 ID 확인 - 보안을 위해

      if (error) {
        throw error;
      }
      
      // 삭제 후 목록 새로고침
      fetchPages();
    } catch (error) {
      console.error("메모 삭제 중 오류가 발생했습니다:", error);
      alert("메모 삭제 중 오류가 발생했습니다.");
    }
  };

  // 로딩 상태이거나 로그인되지 않은 경우 로딩 표시
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-gray-100 text-gray-800">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">메모장</h1>
        <div className="flex items-center gap-4">
          <span className="text-s text-gray-600">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="제목을 입력하세요..."
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="메모 내용을 입력하세요..."
            rows={4}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            메모 저장하기
          </button>
        </div>
      </form>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">저장된 메모 목록</h2>
        
        {loading ? (
          <p className="text-center text-gray-600">로딩 중...</p>
        ) : pages.length === 0 ? (
          <p className="text-gray-500">저장된 메모가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {pages.map((page) => (
              <li key={page.id} className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{page.title}</h3>
                  <button 
                    onClick={() => handleDelete(page.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 text-sm"
                  >
                    삭제
                  </button>
                </div>
                <p className="mb-2 whitespace-pre-line text-gray-700">{page.body}</p>
                <p className="text-xs text-gray-500">
                  작성일: {formatDate(page.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
