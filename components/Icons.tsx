import React from 'react';

export const FireIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0110.5 18.75a.75.75 0 00-1.071 1.052 8.25 8.25 0 00-2.5-1.065.75.75 0 01-.555-.722c.008-.41.242-.782.633-1.018a5.25 5.25 0 002.324-4.22c.023-.97.41-1.894 1.003-2.65.666-.828 1.55-1.553 2.55-2.073a.75.75 0 00-1.072-1.052z" clipRule="evenodd" />
    <path d="M9.172 19.545a.75.75 0 01-.555.722 8.25 8.25 0 01-4.868-4.84.75.75 0 01.722-.555c.41-.008.782.242 1.018.633a5.25 5.25 0 011.698 4.288.75.75 0 00.985-.248 5.25 5.25 0 00-1.018-3.63.75.75 0 01.985-.248 6.75 6.75 0 01-1.282 4.432z" />
  </svg>
);

export const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.316-5.033 9.75 9.75 0 011.838-3.433a9.75 9.75 0 012.562-2.358A9.75 9.75 0 0112 7.5a9.75 9.75 0 012.784.526 9.75 9.75 0 012.562 2.358 9.75 9.75 0 011.838 3.433A9.75 9.75 0 0116.5 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25l-2.25 2.25M15 11.25l2.25 2.25M12 21V15m0 0V7.5m0 7.5h.008v.008H12V15zm0-3.75h.008v.008H12v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18.75h18" />
    </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21 6.75l-3.75-3.75L15.47 4.78 19.22 8.53 21 6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const CrossIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const Spinner = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ReloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M2.985 19.644A8.25 8.25 0 0111.664 2.985m7.948 7.948L16.023 9.348m0 0A8.25 8.25 0 004.342 8.25" />
    </svg>
);

export const FullscreenEnterIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9 15m11.25 5.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);