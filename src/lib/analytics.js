// src/lib/analytics.js
import ReactGA from 'react-ga4';

// 필드 터치/포커스 시 시작 플래그
export const trackFieldFocus = (fieldName, stepNumber) => {
  if (window.gtag || ReactGA.isInitialized) {
    ReactGA.event({
      category: 'Form_Interaction',
      action: 'field_focus',
      label: `Step${stepNumber}_${fieldName}`,
    });
  } else {
    console.log(`[Track Focus] Step ${stepNumber} - Field: ${fieldName}`);
  }
};

// 필드 입력 완료/이탈 시 플래그
export const trackFieldBlur = (fieldName, stepNumber, hasValue) => {
  if (window.gtag || ReactGA.isInitialized) {
    ReactGA.event({
      category: 'Form_Interaction',
      action: 'field_blur',
      label: `Step${stepNumber}_${fieldName}`,
      value: hasValue ? 1 : 0,
    });
  } else {
    console.log(`[Track Blur] Step ${stepNumber} - Field: ${fieldName} (HasValue: ${hasValue})`);
  }
};