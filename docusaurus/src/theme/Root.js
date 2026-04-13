import React from 'react';
import FloatingBanner from '@site/src/components/FloatingBanner';

export default function Root({children}) {
  return (
    <>
      <FloatingBanner />
      {children}
    </>
  );
}
