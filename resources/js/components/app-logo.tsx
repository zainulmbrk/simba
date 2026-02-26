import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/assets/logo-kpu.svg.png" alt="Logo" width={25} height={25} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SIMBA V.1
                </span>
            </div>
        </>
    );
}
