import GatewayHeader from '@/components/GatewayHeader';
import FloatingBuilders from '@/components/FloatingBuilders';
import ZainChat from '@/components/ZainChat';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GatewayHeader />
      {children}
      <FloatingBuilders />
      <ZainChat />
    </>
  );
}
