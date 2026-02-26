import { Separator } from '@/components/ui/separator';
import { type PropsWithChildren } from 'react';

export default function ItemsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col lg:flex-row">
                <Separator className="my-6 lg:hidden" />

                {/* HAPUS max-w */}
                <div className="w-full flex-1">
                    <section className="w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
