import { Provider } from '@/components/provider';
import './global.css';

export const metadata = {
  title: { default: 'react-confirm-alert', template: '%s | react-confirm-alert' },
  description: 'Confirm, alert and prompt dialogs for React 18 and 19.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
