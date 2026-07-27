// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // 1. 초기값 설정: localStorage에 저장된 데이터가 있으면 불러오고, 없으면 initialValue 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`localStorage 읽기 에러 (${key}):`, error);
      return initialValue;
    }
  });

  // 2. State가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`localStorage 저장 에러 (${key}):`, error);
    }
  }, [key, storedValue]);

  // 3. localStorage 데이터 삭제 함수
  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`localStorage 삭제 에러 (${key}):`, error);
    }
  };

  return [storedValue, setStoredValue, removeItem];
}