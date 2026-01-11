import OrderDetailsClient from './OrderDetailsClient';

export const runtime = 'edge';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <OrderDetailsClient id={id} />;
}
