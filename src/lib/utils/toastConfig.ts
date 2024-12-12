import { ToasterProps } from 'sonner';

const baseToastStyle = {
  borderRadius: '9999px',
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backdropFilter: 'blur(8px)',
  fontSize: '14px',
  width: 'fit-content',
  maxWidth: 'fit-content',
  margin: '0 auto',
  color: '#fff'
};

export const TOAST_CONFIG: ToasterProps = {
  position: "bottom-center",
  toastOptions: {
    style: baseToastStyle,
    classNames: {
      success: 'bg-[rgba(22,101,52,0.8)] border border-[rgba(34,197,94,0.2)] backdrop-blur-[8px]',
      error: 'bg-[rgba(153,27,27,0.8)] border border-[rgba(239,68,68,0.2)] backdrop-blur-[8px]',
      default: 'bg-[rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.1)] backdrop-blur-[8px]'
    }
  },
  expand: false,
  closeButton: false,
  richColors: false,
  duration: 4000,
  className: 'compact-toast',
  invert: false,
  gap: 8
};