
# 메모장 웹 애플리케이션

## 프로젝트 소개
이 프로젝트는 Supabase를 활용한 간단한 메모장 웹 애플리케이션입니다. 사용자들이 메모를 작성하고, 저장하고, 검색할 수 있는 기능을 제공합니다.


- 환경 변수 설정하기
   `.env` 파일을 루트 디렉토리에 생성하고 다음 변수를 추가하세요:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- 개발 서버 실행하기
```bash
npm run dev
# 또는
yarn dev
```

## Supabase 설정 방법
1. [Supabase](https://supabase.io)에 가입하고 새 프로젝트를 생성합니다.
2. 생성된 프로젝트의 API 설정에서 `URL`과 `anon public key`를 복사합니다.
3. 이 값들을 `.env` 파일에 붙여넣습니다.

## 주요 기능
- 메모 작성 및 저장
- 메모 목록 보기
- 메모 검색
- 메모 수정 및 삭제

## 환경 변수 설명
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 API 키

