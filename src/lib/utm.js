// src/lib/utm.js
const UTM_STORAGE_KEY = 'aug_zine_utm_params';

// URL query parameter에서 UTM 추출 및 저장
export const captureUtmParams = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  const extractedUtm = {};
  let hasUtm = false;

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      extractedUtm[key] = value;
      hasUtm = true;
    } else {
      extractedUtm[key] = null;
    }
  });

  // URL에 UTM 파라미터가 포함되어 접속한 경우 저장
  if (hasUtm) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(extractedUtm));
  }
};

// 저장된 UTM 파라미터 불러오기
export const getStoredUtmParams = () => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    };
  } catch (error) {
    console.error('UTM 불러오기 에러:', error);
    return {};
  }
};