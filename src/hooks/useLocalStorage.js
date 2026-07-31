import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`localStorage 읽기 에러 (${key}):`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (
        storedValue === null ||
        storedValue === undefined ||
        (typeof storedValue === 'object' && Object.keys(storedValue).length === 0)
      ) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`localStorage 저장 에러 (${key}):`, error);
    }
  }, [key, storedValue]);

  // removeItem 호출 시 메모리 state와 로컬 스토리지 모두 완벽 비움
  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`localStorage 삭제 에러 (${key}):`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeItem];
}